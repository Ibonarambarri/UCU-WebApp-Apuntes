// Web Worker del buscador: carga el índice MiniSearch y (opcionalmente) los embeddings
// para no trabar la interfaz. Todo se sirve desde el propio servidor local.
import MiniSearch from 'minisearch';
import { tokenizeIndex, tokenizeQuery, processTerm, normalize, SECTION_BY_KEY } from './text.js';
import SYNONYMS from './synonyms.js';

const RRF_K = 60;
const MODEL_ID = 'Xenova/multilingual-e5-small';

let ms = null;
let chunks = null; // [docIdx, heading, anchor, occ, text]
let docs = null; // manifest.docs
let chunkBoost = null; // Float32Array
let chunkSection = null; // string[]
let chunkPenalty = null; // Float32Array: penalización semántica para fragmentos muy cortos

// semántico
let semState = 'off'; // off | loading | ready | error
let semPromise = null;
let extractor = null;
let emb = null; // Int8Array
let embScales = null; // Float32Array
let DIM = 384;

const post = (msg) => self.postMessage(msg);

// ---------------------------------------------------------------------------
// Sinónimos (normalizados una sola vez)
// ---------------------------------------------------------------------------
const SYN = Object.entries(SYNONYMS)
  .map(([k, v]) => [normalize(k).trim(), v])
  .sort((a, b) => b[0].length - a[0].length);

function expandQuery(q) {
  const nq = ' ' + normalize(q).replace(/[^\p{L}\p{N}\s]+/gu, ' ').replace(/\s+/g, ' ') + ' ';
  const base = [];
  const extra = [];
  const seen = new Set();
  const add = (list, raw) => {
    for (const tok of tokenizeQuery(raw)) {
      const t = processTerm(tok);
      if (t && !seen.has(t)) {
        seen.add(t);
        list.push(t);
      }
    }
  };
  add(base, q);
  const matchedKeys = [];
  for (const [key, vals] of SYN) {
    if (nq.includes(' ' + key + ' ')) {
      matchedKeys.push(key);
      for (const v of vals) add(extra, v);
    }
  }
  return { base, extra, all: [...base, ...extra], matchedKeys };
}

// ---------------------------------------------------------------------------
// Carga
// ---------------------------------------------------------------------------
async function init() {
  const t0 = performance.now();
  const [manifest, chunkData, indexText] = await Promise.all([
    fetch('/data/manifest.json').then((r) => r.json()),
    fetch('/data/chunks.json').then((r) => r.json()),
    fetch('/data/search-index.json').then((r) => r.text()),
  ]);
  docs = manifest.docs;
  chunks = chunkData;
  ms = MiniSearch.loadJSON(indexText, {
    idField: 'i',
    fields: ['title', 'heading', 'text'],
    storeFields: [],
    tokenize: tokenizeIndex,
    processTerm,
    searchOptions: { tokenize: tokenizeQuery, processTerm },
  });
  chunkBoost = new Float32Array(chunks.length);
  chunkSection = new Array(chunks.length);
  chunkPenalty = new Float32Array(chunks.length);
  for (let i = 0; i < chunks.length; i++) {
    const s = docs[chunks[i][0]].s;
    chunkSection[i] = s;
    chunkBoost[i] = SECTION_BY_KEY[s]?.boost ?? 1;
    const words = (chunks[i][4].match(/\S+/g) || []).length;
    chunkPenalty[i] = words < 60 ? 0.02 * (1 - words / 60) : 0;
  }
  post({ type: 'ready', chunks: chunks.length, docs: docs.length, ms: Math.round(performance.now() - t0) });
}

async function initSemantic() {
  if (semPromise) return semPromise;
  semState = 'loading';
  post({ type: 'sem-status', status: 'loading', detail: 'Cargando embeddings…' });
  semPromise = (async () => {
    const [meta, embBuf, scaleBuf] = await Promise.all([
      fetch('/data/embeddings-meta.json').then((r) => {
        if (!r.ok) throw new Error('No hay embeddings: corré npm run build-index');
        return r.json();
      }),
      fetch('/data/embeddings.bin').then((r) => r.arrayBuffer()),
      fetch('/data/embeddings-scales.bin').then((r) => r.arrayBuffer()),
    ]);
    DIM = meta.dim;
    emb = new Int8Array(embBuf);
    embScales = new Float32Array(scaleBuf);
    if (embScales.length !== chunks.length) throw new Error('Embeddings desactualizados: corré npm run build-index');

    post({ type: 'sem-status', status: 'loading', detail: 'Cargando modelo local…' });
    const { pipeline, env } = await import('@huggingface/transformers');
    // OFFLINE: nada de huggingface.co ni CDNs.
    env.allowRemoteModels = false;
    env.allowLocalModels = true;
    env.localModelPath = '/models/';
    env.useBrowserCache = false;
    env.backends.onnx.wasm.wasmPaths = {
      mjs: new URL('/ort/ort-wasm-simd-threaded.asyncify.mjs', self.location.origin).href,
      wasm: new URL('/ort/ort-wasm-simd-threaded.asyncify.wasm', self.location.origin).href,
    };
    env.backends.onnx.wasm.numThreads = 1;
    extractor = await pipeline('feature-extraction', MODEL_ID, {
      dtype: 'q8',
      device: 'wasm',
      progress_callback: (p) => {
        if (p.status === 'progress' && p.total) {
          post({ type: 'sem-status', status: 'loading', detail: `Cargando modelo local… ${Math.round((p.loaded / p.total) * 100)}%` });
        }
      },
    });
    // calentar
    await extractor('query: hola', { pooling: 'mean', normalize: true });
    semState = 'ready';
    post({ type: 'sem-status', status: 'ready', detail: 'Modelo local listo' });
  })().catch((err) => {
    semState = 'error';
    semPromise = null;
    post({ type: 'sem-status', status: 'error', detail: String(err?.message || err) });
    throw err;
  });
  return semPromise;
}

// ---------------------------------------------------------------------------
// Búsqueda
// ---------------------------------------------------------------------------
function keywordSearch(terms, allowed) {
  if (!terms.length) return [];
  const res = ms.search(
    { combineWith: 'OR', queries: terms },
    {
      boost: { title: 3, heading: 2, text: 1 },
      fuzzy: (term) => (term.length >= 5 ? 0.2 : false),
      prefix: (term) => term.length >= 3,
      boostDocument: (id) => chunkBoost[id],
      filter: allowed ? (r) => allowed.has(chunkSection[r.id]) : undefined,
    }
  );
  return res;
}

async function semanticSearch(query, allowed, topK = 150) {
  await initSemantic();
  const out = await extractor('query: ' + query, { pooling: 'mean', normalize: true });
  const q = out.data;
  const N = embScales.length;
  const scores = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    let s = 0;
    const off = i * DIM;
    for (let d = 0; d < DIM; d++) s += emb[off + d] * q[d];
    // mismo boost por sección, suavizado (el coseno de e5 vive en un rango estrecho ~0.7–0.9),
    // y penalización leve a fragmentos muy cortos (títulos sueltos que "atraen" cualquier consulta)
    scores[i] = s * embScales[i] + 0.01 * (chunkBoost[i] - 1) - chunkPenalty[i];
  }
  // top-K
  const idx = [];
  for (let i = 0; i < N; i++) {
    if (allowed && !allowed.has(chunkSection[i])) continue;
    idx.push(i);
  }
  idx.sort((a, b) => scores[b] - scores[a]);
  return idx.slice(0, topK).map((i) => ({ id: i, score: scores[i] }));
}

function makeSnippet(text, terms, maxLen = 260) {
  const words = [];
  const re = /[\p{L}\p{N}_$]+/gu;
  let m;
  while ((m = re.exec(text))) {
    const n = normalize(m[0]);
    let hit = null;
    for (const t of terms) {
      if (t.length < 3 ? n === t : n === t || n.startsWith(t) || (t.length >= 5 && n.includes(t))) {
        hit = t;
        break;
      }
    }
    if (hit) words.push({ s: m.index, e: m.index + m[0].length, t: hit });
  }
  // ventana con más términos distintos
  let bestStart = 0;
  if (words.length) {
    let best = -1;
    for (let i = 0; i < words.length; i++) {
      const start = words[i].s;
      const distinct = new Set();
      for (let j = i; j < words.length && words[j].e - start < maxLen - 40; j++) distinct.add(words[j].t);
      if (distinct.size > best) {
        best = distinct.size;
        bestStart = start;
      }
    }
    bestStart = Math.max(0, bestStart - 50);
    const sp = text.lastIndexOf(' ', bestStart);
    if (sp > 0 && bestStart - sp < 20) bestStart = sp + 1;
  }
  const end = Math.min(text.length, bestStart + maxLen);
  const parts = [];
  let pos = bestStart;
  for (const w of words) {
    if (w.s < bestStart || w.e > end) continue;
    if (w.s > pos) parts.push([text.slice(pos, w.s), 0]);
    parts.push([text.slice(w.s, w.e), 1]);
    pos = w.e;
  }
  if (pos < end) parts.push([text.slice(pos, end), 0]);
  if (bestStart > 0) parts.unshift(['… ', 0]);
  if (end < text.length) parts.push([' …', 0]);
  return parts.map(([t, h]) => [t.replace(/\s+/g, ' '), h]);
}

function collapse(list, limit = 40, perDoc = 2) {
  const perDocCount = new Map();
  const out = [];
  for (const r of list) {
    const d = chunks[r.id][0];
    const c = perDocCount.get(d) || 0;
    if (c >= perDoc) continue;
    perDocCount.set(d, c + 1);
    out.push(r);
    if (out.length >= limit) break;
  }
  return out;
}

async function search({ reqId, query, mode, sources }) {
  const t0 = performance.now();
  const allowed = sources && sources.length ? new Set(sources) : null;
  const { all, matchedKeys } = expandQuery(query);

  const kw = keywordSearch(all, allowed).slice(0, 200);
  let fused;
  let semMs = 0;
  if (mode === 'semantic') {
    const ts = performance.now();
    const sem = await semanticSearch(query, allowed);
    semMs = Math.round(performance.now() - ts);
    const score = new Map();
    const src = new Map();
    kw.slice(0, 100).forEach((r, rank) => {
      score.set(r.id, (score.get(r.id) || 0) + 1 / (RRF_K + rank + 1));
      src.set(r.id, 'k');
    });
    sem.forEach((r, rank) => {
      score.set(r.id, (score.get(r.id) || 0) + 1 / (RRF_K + rank + 1));
      src.set(r.id, src.has(r.id) ? 'ks' : 's');
    });
    fused = [...score.entries()].map(([id, s]) => ({ id, score: s, via: src.get(id) })).sort((a, b) => b.score - a.score);
  } else {
    fused = kw.map((r) => ({ id: r.id, score: r.score, via: 'k' }));
  }

  const matchTerms = new Map(kw.map((r) => [r.id, r.terms]));
  const top = collapse(fused);
  const results = top.map((r) => {
    const [d, heading, anchor, occ, text] = chunks[r.id];
    const doc = docs[d];
    const terms = [...new Set([...(matchTerms.get(r.id) || []), ...all])].filter((t) => t.length >= 2);
    return {
      chunk: r.id,
      docId: doc.id,
      title: doc.t,
      section: doc.s,
      heading,
      anchor,
      occ,
      score: r.score,
      via: r.via,
      snippet: makeSnippet(text, terms),
    };
  });
  post({
    type: 'results',
    reqId,
    query,
    mode,
    results,
    total: fused.length,
    expanded: all,
    matchedKeys,
    ms: Math.round(performance.now() - t0),
    semMs,
  });
}

self.onmessage = async (e) => {
  const msg = e.data;
  try {
    if (msg.type === 'init') await init();
    else if (msg.type === 'search') await search(msg);
    else if (msg.type === 'warm-semantic') await initSemantic();
    else if (msg.type === 'debug-resources')
      post({ type: 'debug-resources', urls: performance.getEntriesByType('resource').map((r) => r.name) });
  } catch (err) {
    post({ type: 'error', reqId: msg.reqId, error: String(err?.message || err) });
  }
};
