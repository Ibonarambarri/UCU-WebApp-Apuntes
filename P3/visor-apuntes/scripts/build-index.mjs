// Genera public/data/ a partir de los apuntes de P3/ y la documentación offline
// (React Native, Expo SDK 58 + Expo Router, AsyncStorage) + los apuntes y la doc de React de P2/.
//   - manifest.json         lista de documentos (para la barra lateral)
//   - docs/<id>.json        markdown limpio de cada documento
//   - chunks.json           fragmentos (por heading) para el buscador
//   - search-index.json     índice MiniSearch serializado
//   - embeddings.bin        embeddings int8 (N x 384) + embeddings-scales.bin (float32 x N)
//   - embeddings-meta.json
// Uso: node scripts/build-index.mjs [--no-embed]
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import MiniSearch from 'minisearch';
import {
  tokenizeIndex,
  processTerm,
  headingKey,
  slugify,
  SECTIONS,
  SECTION_BY_KEY,
} from '../src/search/text.js';
import { cleanJsx, cleanAdmonitions } from './mdx-clean.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const P3 = path.resolve(ROOT, '..');
const WEBAPP = path.resolve(P3, '..');
const P2 = path.join(WEBAPP, 'P2');
const OUT = path.join(ROOT, 'public', 'data');
const NO_EMBED = process.argv.includes('--no-embed');
const MODEL_ID = 'Xenova/multilingual-e5-small';

const t0 = Date.now();
// Las rutas "src" son relativas a la carpeta WebApp/ (P3/… o P2/…).
const rel = (abs) => path.relative(WEBAPP, abs).split(path.sep).join('/');

// ---------------------------------------------------------------------------
// 1. Descubrir fuentes
// ---------------------------------------------------------------------------
const SKIP_DIRS = new Set(['node_modules', '.git', '.expo', 'dist', 'build']);
function walk(dir, pred, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (!SKIP_DIRS.has(e.name)) walk(p, pred, acc);
    } else if (pred(p)) acc.push(p);
  }
  return acc;
}

const RN_BASE = 'P3/docs-offline/react-native-website/docs/';
const EXPO_BASE = 'P3/docs-offline/expo/docs/pages/';
const EXPO_API_BASE = 'P3/docs-offline/expo-api-v58/';
const ASYNC_BASE = 'P3/docs-offline/async-storage/packages/website/docs/';
const REACT_BASE = 'P2/docs-offline/react.dev/src/content/';
const EXPO_VERSION = 'v58.0.0';
// Carpetas de docs.expo.dev que se indexan (el resto —EAS, builds, etc.— queda afuera).
const EXPO_DIRS = ['router', `versions/${EXPO_VERSION}`, 'guides', 'get-started', 'develop', 'tutorial', 'linking'];

const noExt = (s) => s.replace(/\.mdx?$/, '');
/** Ruta relativa a WebApp/ → id de documento (idéntico al que usa el visor en la URL). */
function srcToId(src) {
  if (src.startsWith(RN_BASE)) return 'rn/' + noExt(src.slice(RN_BASE.length));
  if (src.startsWith(EXPO_BASE)) return 'expo/' + noExt(src.slice(EXPO_BASE.length));
  if (src.startsWith(EXPO_API_BASE)) return 'expo-api/' + noExt(src.slice(EXPO_API_BASE.length));
  if (src.startsWith(ASYNC_BASE)) return 'async-storage/' + noExt(src.slice(ASYNC_BASE.length));
  if (src.startsWith(REACT_BASE)) return 'react/' + noExt(src.slice(REACT_BASE.length));
  if (src.startsWith('P2/')) return 'p2/' + noExt(src.slice(3));
  return 'notas/' + noExt(src.replace(/^P3\//, ''));
}

const sources = []; // {abs, src, section, tree}
const isPartial = (abs) => path.basename(abs).startsWith('_');
const mdFiles = (dir) => walk(dir, (p) => /\.mdx?$/.test(p) && !isPartial(p)).sort();

// Carpetas de "Mis apuntes" en la barra lateral. El último segmento es la hoja (el documento);
// el orden de las carpetas y de los documentos es el de inserción (no alfabético).
function notesTree(src) {
  const r = src.replace(/^P3\//, '');
  const leaf = r.replace(/\//g, '~');
  if (/^(PLAN-DE-RUTA-EXAMEN|CHULETA-EXAMEN|ESTRATEGIA-EXAMEN)\.md$/.test(r)) return `⭐ Examen/${leaf}`;
  if (r.startsWith('clase/')) return `📘 Clase/${leaf}`;
  if (r.startsWith('parciales/') && r.endsWith('/README.md')) return `📝 Enunciados de parciales/${leaf}`;
  if (r.includes('2026sem2')) return `🎯 Simulacros 2026sem2 (resueltos)/${leaf}`;
  if (r.startsWith('parciales/')) return `🗂 Parciales anteriores/${leaf}`;
  return `🧭 Guías e índices/${leaf}`;
}

// Apuntes de P2 (React): mismos niveles que el visor de P2.
const P2_NIVELES = [
  [1, 6, 'Nivel 1 · Cimientos (1-6)'],
  [7, 9, 'Nivel 2 · Estado (7-9)'],
  [10, 12, 'Nivel 3 · Datos (10-12)'],
  [13, 15, 'Nivel 4 · Navegación (13-15)'],
  [16, 17, 'Nivel 5 · Estado compartido (16-17)'],
  [18, 19, 'Nivel 6 · Terminaciones (18-19)'],
];
function p2Tree(src) {
  const r = src.replace(/^P2\//, '');
  const leaf = r.replace(/\//g, '~');
  const n = Number(path.basename(r).slice(0, 2));
  const nivel = n ? P2_NIVELES.find(([a, b]) => n >= a && n <= b) : null;
  return `📗 Clase P2 (React)/${nivel ? nivel[2] + '/' : ''}${leaf}`;
}

/** .md del primer nivel de una carpeta, en orden (00, 01, 02…). Las subcarpetas (_insumos/) NO. */
function topLevelMd(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isFile() && e.name.endsWith('.md'))
    .map((e) => path.join(dir, e.name))
    .sort((a, b) => a.localeCompare(b));
}

// Mis apuntes P3 (en el orden pedido)
{
  const seen = new Set();
  const add = (abs) => {
    if (!fs.existsSync(abs) || seen.has(abs)) return;
    seen.add(abs);
    const src = rel(abs);
    sources.push({ abs, src, section: 'notas', tree: notesTree(src) });
  };
  for (const f of ['README.md', 'PLAN-DE-RUTA-EXAMEN.md', 'CHULETA-EXAMEN.md', 'ESTRATEGIA-EXAMEN.md', 'GUIA-ESTUDIO-TARDE.md']) add(path.join(P3, f));
  for (const f of topLevelMd(P3)) add(f); // cualquier otro .md suelto en P3/
  for (const f of topLevelMd(path.join(P3, 'clase'))) add(f);
  const parcDir = path.join(P3, 'parciales');
  const parciales = fs.existsSync(parcDir)
    ? fs.readdirSync(parcDir, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name)
    : [];
  // primero los simulacros 2026sem2, después el resto (más nuevos primero)
  const ordered = [...parciales.filter((d) => d.includes('2026sem2')).sort(), ...parciales.filter((d) => !d.includes('2026sem2')).sort().reverse()];
  for (const d of ordered) add(path.join(parcDir, d, 'APUNTES-PARCIAL.md'));
  for (const d of ordered) add(path.join(parcDir, d, 'README.md'));
  add(path.join(P3, 'docs-offline/INDICE.md'));
}

// React Native
for (const abs of mdFiles(path.join(WEBAPP, RN_BASE))) {
  const src = rel(abs);
  sources.push({ abs, src, section: 'rn', tree: noExt(src.slice(RN_BASE.length)) });
}
// Expo Router (guías) + Expo (SDK 58 y guías generales)
for (const dir of EXPO_DIRS) {
  for (const abs of mdFiles(path.join(WEBAPP, EXPO_BASE, dir))) {
    const src = rel(abs);
    const r = noExt(src.slice(EXPO_BASE.length));
    if (dir === 'router') sources.push({ abs, src, section: 'expo-router', tree: r.slice('router/'.length) });
    else sources.push({ abs, src, section: 'expo', tree: r.replace(`versions/${EXPO_VERSION}/sdk/`, 'SDK 58/').replace(`versions/${EXPO_VERSION}`, 'SDK 58') });
  }
}
// Expo API reference (md generados)
for (const abs of mdFiles(path.join(WEBAPP, EXPO_API_BASE))) {
  const src = rel(abs);
  sources.push({ abs, src, section: 'expo-api', tree: noExt(src.slice(EXPO_API_BASE.length)) });
}
// AsyncStorage v2
for (const abs of mdFiles(path.join(WEBAPP, ASYNC_BASE))) {
  const src = rel(abs);
  sources.push({ abs, src, section: 'async-storage', tree: noExt(src.slice(ASYNC_BASE.length)) });
}
// Apuntes de P2 (clase/)
for (const abs of topLevelMd(path.join(P2, 'clase'))) {
  const src = rel(abs);
  sources.push({ abs, src, section: 'p2', tree: p2Tree(src) });
}
// React (docs de P2)
for (const sub of ['learn', 'reference']) {
  for (const abs of mdFiles(path.join(WEBAPP, REACT_BASE, sub))) {
    const src = rel(abs);
    sources.push({ abs, src, section: 'react', tree: noExt(src.slice(REACT_BASE.length)) });
  }
}

for (const s of sources) s.id = srcToId(s.src);
const idSet = new Set(sources.map((s) => s.id));
console.log(`Fuentes encontradas: ${sources.length}`);

// ---------------------------------------------------------------------------
// 2. Front-matter
// ---------------------------------------------------------------------------
function parseFrontMatter(raw) {
  const fm = {};
  let body = raw;
  if (raw.startsWith('---\n') || raw.startsWith('---\r\n')) {
    const end = raw.indexOf('\n---', 4);
    if (end > 0) {
      const block = raw.slice(4, end);
      body = raw.slice(raw.indexOf('\n', end + 1) + 1);
      for (const line of block.split(/\r?\n/)) {
        const m = line.match(/^([\w-]+):\s*(.*)$/);
        if (m) fm[m[1]] = m[2].trim().replace(/^(["'])(.*)\1$/, '$2');
      }
    }
  }
  return { fm, body };
}

for (const s of sources) {
  const raw = fs.readFileSync(s.abs, 'utf8');
  const { fm, body } = parseFrontMatter(raw);
  s.fm = fm;
  s.body = body;
}


// ---------------------------------------------------------------------------
// 3. Limpieza
// ---------------------------------------------------------------------------
const FENCE_RE = /^(\s*(?:>\s?)*\s*)(`{3,}|~{3,})(.*)$/;

/** Aplica fn a los trozos de texto que NO están dentro de bloques de código. */
function mapOutsideFences(md, fn) {
  const lines = md.split('\n');
  const out = [];
  let buf = [];
  let fence = null;
  const flush = () => {
    if (buf.length) out.push(fn(buf.join('\n')));
    buf = [];
  };
  for (const line of lines) {
    const m = line.match(FENCE_RE);
    if (fence) {
      out.push(line);
      if (m && m[2][0] === fence[0] && m[2].length >= fence.length && !m[3].trim()) fence = null;
    } else if (m) {
      flush();
      fence = m[2];
      out.push(line);
    } else buf.push(line);
  }
  flush();
  return out.join('\n');
}

/** Aplica fn solo fuera de `código inline`. */
function mapOutsideInlineCode(text, fn) {
  return text
    .split(/(`+[^`\n]*`+)/g)
    .map((part, i) => (i % 2 ? part : fn(part)))
    .join('');
}

function normalizeFenceLangs(md) {
  return md.replace(/^(\s*(?:>\s?)*\s*)(`{3,}|~{3,})([\w+-]*)([^\n]*)$/gm, (all, pre, f, lang, rest) => {
    if (!lang) return all;
    let l = lang.toLowerCase().replace(/-nolint$/, '');
    const map = { plain: 'text', sh: 'bash', shell: 'bash', console: 'bash', 'js-interactive-example': 'js', snackplayer: 'jsx', terminal: 'bash', zsh: 'bash' };
    l = map[l] || l;
    // conservar nombre de archivo de Sandpack como meta
    return `${pre}${f}${l}${rest}`;
  });
}

// --- react.dev (MDX) ---
const CALLOUTS = {
  Note: 'NOTE',
  Pitfall: 'PITFALL',
  DeepDive: 'DEEPDIVE',
  Wip: 'NOTE',
  Canary: 'NOTE',
  Experimental: 'NOTE',
  Deprecated: 'PITFALL',
  Hint: 'HINT',
  Solution: 'SOLUTION',
  YouWillLearn: 'LEARN',
  Recap: 'RECAP',
  RSC: 'NOTE',
};

function cleanJsxBlocks(body) {
  const lines = body.split('\n');
  const out = [];
  const stack = [];
  let fence = null;
  const prefix = () => '> '.repeat(stack.length);
  for (const line of lines) {
    const fm = line.match(/^\s*(`{3,}|~{3,})(.*)$/);
    if (fence) {
      out.push(prefix() + line);
      if (fm && fm[1][0] === fence[0] && fm[1].length >= fence.length && !fm[2].trim()) fence = null;
      continue;
    }
    if (fm) {
      fence = fm[1];
      out.push(prefix() + line);
      continue;
    }
    const tag = line.match(/^\s*<(\/)?([A-Z][A-Za-z]*)\b([^>]*?)(\/)?>\s*$/);
    if (tag) {
      const [, closing, name, , selfClosing] = tag;
      if (selfClosing) continue;
      const type = CALLOUTS[name];
      if (closing) {
        if (type && stack.length && stack[stack.length - 1] === name) {
          stack.pop();
          out.push(prefix());
        }
        continue;
      }
      if (type) {
        out.push(prefix());
        out.push(prefix() + `> [!${type}]`);
        stack.push(name);
        out.push(prefix());
      }
      continue; // Intro, Sandpack, Recipes, Challenges, etc: solo se quita la etiqueta
    }
    // etiquetas multilínea (<Diagram ... \n ... >): quitar líneas que empiezan con <Mayúscula y no cierran
    if (/^\s*<[A-Z][A-Za-z]*(\s|$)/.test(line) && !line.includes('>')) continue;
    let l = mapOutsideInlineCode(line, (t) => t.replace(/<\/?[A-Z][A-Za-z]*(\s[^<>]*)?\/?>/g, ''));
    // anchors explícitos de react.dev: ## Título {/*id*/}
    l = l.replace(/^(#{1,6}\s.*?)\s*\{\/\*\s*([\w-]+)\s*\*\/\}\s*$/, '$1 <span id="$2"></span>');
    out.push(prefix() + l);
  }
  return out.join('\n');
}

// --- React Router ---
// --- Común: imágenes, iframes, links ---
function stripMedia(md) {
  return mapOutsideFences(md, (t) =>
    mapOutsideInlineCode(t, (x) =>
      x
        .replace(/!\[([^\]]*)\]\([^)]*\)/g, '')
        .replace(/<img\b[^>]*>/gi, '')
        .replace(/<iframe\b[\s\S]*?<\/iframe>/gi, '')
        .replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, '')
    )
  );
}


const tryIds = (id) => [id, id + '/index', id.replace(/\/index$/, '')].find((x) => idSet.has(x));

/** Página de la API reference generada (expo-api-v58/) para un packageName de <APISection>. */
function expoApiLink(pkg) {
  const id = 'expo-api/' + pkg.replace(/\//g, '-');
  return idSet.has(id) ? `#/doc/${id}` : null;
}

function resolveUrl(url, ctx) {
  url = url.trim().replace(/^<|>$/g, '');
  if (!url) return '#roto';
  if (url.startsWith('#/doc/')) return url; // ya resuelto (p.ej. <APISection>)
  const hashIdx = url.indexOf('#');
  const base = hashIdx >= 0 ? url.slice(0, hashIdx) : url;
  const frag = hashIdx >= 0 ? url.slice(hashIdx + 1) : '';
  const internal = (id) => `#/doc/${id}${frag ? '?h=' + encodeURIComponent(frag) : ''}`;
  if (!base) return frag ? internal(ctx.id) : '#roto';

  // react.dev
  let m = base.match(/^(?:https?:\/\/(?:[\w-]+\.)?react\.dev)?\/((?:learn|reference|blog|community)(?:\/.*)?)$/);
  if (m && (base.startsWith('http') || ctx.section === 'react')) {
    const id = tryIds('react/' + m[1].replace(/\/$/, ''));
    return id ? internal(id) : `https://react.dev/${m[1]}${frag ? '#' + frag : ''}`;
  }
  // reactnative.dev/docs/x  (o /docs/x desde la doc de RN)
  m = base.match(/^(?:https?:\/\/reactnative\.dev)?\/docs\/(?:next\/|\d+\.\d+\/)?([^?]+?)(?:\.md)?\/?$/);
  if (m && (base.startsWith('http') || ctx.section === 'rn')) {
    const id = tryIds('rn/' + m[1]);
    return id ? internal(id) : `https://reactnative.dev/docs/${m[1]}${frag ? '#' + frag : ''}`;
  }
  if (ctx.section === 'rn' && base.startsWith('/')) return `https://reactnative.dev${base}${frag ? '#' + frag : ''}`;
  // docs.expo.dev/… (o /… desde la doc de Expo)
  m = base.match(/^(?:https?:\/\/docs\.expo\.dev)?(\/[^?]*)$/);
  if (m && (base.startsWith('http') || ctx.section.startsWith('expo'))) {
    const p = m[1]
      .replace(/^\/versions\/(?:latest|unversioned|v\d+\.\d+\.\d+)\//, `/versions/${EXPO_VERSION}/`)
      .replace(/^\/|\/$/g, '')
      .replace(/\.mdx?$/, '');
    const id = p ? tryIds('expo/' + p) : null;
    return id ? internal(id) : `https://docs.expo.dev${m[1]}${frag ? '#' + frag : ''}`;
  }
  if (/^(https?:|mailto:)/i.test(base)) return url;
  if (base.startsWith('/')) return '#roto';
  // relativo al archivo
  const dir = path.posix.dirname(ctx.src);
  let target;
  try {
    target = path.posix.normalize(path.posix.join(dir, decodeURIComponent(base)));
  } catch {
    return '#roto';
  }
  for (const cand of [target, target + '.md', target + '.mdx', target.replace(/\/$/, '') + '/index.md', target.replace(/\/$/, '') + '.md']) {
    const id = srcToId(cand);
    if (idSet.has(id)) return internal(id);
  }
  return '#roto';
}

function rewriteLinks(md, ctx) {
  return mapOutsideFences(md, (t) =>
    mapOutsideInlineCode(t, (x) =>
      x
        // links inline [texto](url "título")
        .replace(/\]\(\s*(<[^>]*>|[^()\s]*(?:\([^()\s]*\)[^()\s]*)*)(\s+"[^"]*")?\s*\)/g, (all, url, title) => `](${resolveUrl(url, ctx)}${title || ''})`)
        // definiciones de referencia [x]: url
        .replace(/^(\s*(?:>\s?)*\s*\[[^\]]+\]:\s*)(\S+)(.*)$/gm, (all, pre, url, rest) => `${pre}${resolveUrl(url, ctx)}${rest}`)
    )
  );
}


const MDX_SECTIONS = new Set(['rn', 'expo', 'expo-router', 'async-storage']);

function cleanDoc(s) {
  let md = s.body.replace(/\r\n/g, '\n');
  if (s.section === 'react') md = cleanJsxBlocks(md);
  else if (MDX_SECTIONS.has(s.section)) {
    md = cleanJsx(md, { fm: s.fm, apiLink: expoApiLink });
    md = cleanAdmonitions(md);
    // la descripción del front-matter de Expo/RN como bajada
    if (s.fm.description && !/^#\s/m.test(md.slice(0, 300))) md = `_${s.fm.description.replace(/_/g, '\\_')}_\n\n` + md;
  }
  md = normalizeFenceLangs(md);
  md = stripMedia(md);
  md = rewriteLinks(md, s);
  md = md.replace(/\n{3,}/g, '\n\n').trim() + '\n';
  return md;
}

// ---------------------------------------------------------------------------
// 4. Chunking
// ---------------------------------------------------------------------------
function inlineToPlain(s) {
  return s
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]*)\]\[[^\]]*\]/g, '$1')
    .replace(/`+/g, '')
    .replace(/(\*\*|__)/g, '')
    .replace(/(^|\s)[*_](\S)/g, '$1$2')
    .replace(/(\S)[*_](\s|$|[.,;:])/g, '$1$2');
}

function linesToPlain(lines) {
  const out = [];
  let inFence = false;
  for (let line of lines) {
    line = line.replace(/^(\s*>\s?)+/, '');
    if (/^\s*(`{3,}|~{3,})/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) {
      out.push(line);
      continue;
    }
    if (/^\s*\[![A-Z]+\]\s*$/.test(line)) continue;
    if (/^\s*\|?\s*:?-{3,}/.test(line)) continue;
    if (/^\s*\[[^\]]+\]:\s*\S+/.test(line)) continue; // definiciones de links
    line = line.replace(/^\s*#{1,6}\s+/, '').replace(/^\s*([-*+]|\d+\.)\s+/, '').replace(/\|/g, ' ');
    out.push(inlineToPlain(line));
  }
  return out.join('\n').replace(/[ \t]+/g, ' ').replace(/\n\s*\n+/g, '\n').trim();
}

const wordCount = (s) => (s.match(/\S+/g) || []).length;

function chunkDoc(docIdx, md, title) {
  const lines = md.split('\n');
  const chunks = [];
  const occ = new Map();
  const hStack = []; // [{depth, text}]
  let cur = null;
  let fence = null;

  const start = (heading, anchor, n, hpath) => {
    cur = { heading: hpath, anchor, occ: n, lines: [], words: 0 };
  };
  const finish = () => {
    if (!cur) return;
    const text = linesToPlain(cur.lines);
    if (wordCount(text) >= 5) chunks.push({ d: docIdx, h: cur.heading, a: cur.anchor, n: cur.occ, text });
    cur = null;
  };
  start('', '', 0, '');

  for (const line of lines) {
    const fm = line.match(FENCE_RE);
    if (fence) {
      cur.lines.push(line);
      cur.words += wordCount(line);
      if (fm && fm[2][0] === fence[0] && !fm[3].trim()) fence = null;
      continue;
    }
    if (fm) {
      fence = fm[2];
      cur.lines.push(line);
      continue;
    }
    const h = line.match(/^((?:>\s?)*)\s*(#{1,6})\s+(.+?)\s*#*\s*$/);
    if (h) {
      const text = inlineToPlain(h[3]).replace(/\s+/g, ' ').trim();
      const key = headingKey(text);
      const n = occ.get(key) || 0;
      occ.set(key, n + 1);
      const depth = h[2].length;
      const inQuote = !!h[1];
      if (!inQuote && depth <= 4) {
        while (hStack.length && hStack[hStack.length - 1].depth >= depth) hStack.pop();
        hStack.push({ depth, text });
        const pathTexts = hStack.filter((x) => x.depth >= 2 && x.text !== title).map((x) => x.text);
        const hpath = pathTexts.slice(-2).join(' › ') || (depth === 1 ? '' : text);
        if (depth <= 2 || cur.words >= 80) {
          finish();
          start(text, slugify(text), n, hpath);
        } else if (cur.words < 15) {
          // la sección anterior estaba casi vacía: el fragmento pasa a llevar este heading
          Object.assign(cur, { heading: hpath, anchor: slugify(text), occ: n });
        }
      }
      cur.lines.push(line);
      continue;
    }
    // cortar secciones largas en párrafos
    if (!line.trim() && cur.words >= 350) {
      const { heading, anchor, occ: o } = cur;
      finish();
      start(heading, anchor, o, heading);
      continue;
    }
    cur.lines.push(line);
    cur.words += wordCount(line);
  }
  finish();
  return chunks;
}

// ---------------------------------------------------------------------------
// 5. Procesar todo
// ---------------------------------------------------------------------------
fs.rmSync(path.join(OUT, 'docs'), { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'docs'), { recursive: true });

const docs = [];
const chunks = [];
let broken = 0;
let totalLinks = 0;
for (const s of sources) {
  const md = cleanDoc(s);
  totalLinks += (md.match(/\]\(/g) || []).length;
  broken += (md.match(/\]\(#roto\)/g) || []).length;
  const h1 = md.match(/^#\s+(.+)$/m);
  let title = s.fm.title || (h1 ? inlineToPlain(h1[1]).trim() : path.basename(s.src, '.md'));
  title = title.replace(/`/g, "");
  const idx = docs.length;
  docs.push({ id: s.id, t: title, s: s.section, src: s.src, tree: s.tree ?? '' });
  const dest = path.join(OUT, 'docs', s.id + '.json');
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, JSON.stringify({ id: s.id, title, section: s.section, src: s.src, md }));
  for (const c of chunkDoc(idx, md, title)) chunks.push(c);
}
console.log(`Documentos: ${docs.length}  |  Chunks: ${chunks.length}  |  Links: ${totalLinks} (rotos → texto: ${broken})`);
for (const sec of SECTIONS) {
  const nd = docs.filter((d) => d.s === sec.key).length;
  const nc = chunks.filter((c) => docs[c.d].s === sec.key).length;
  console.log(`  ${sec.label.padEnd(18)} ${String(nd).padStart(5)} docs  ${String(nc).padStart(6)} chunks`);
}

fs.writeFileSync(
  path.join(OUT, 'manifest.json'),
  JSON.stringify({ built: new Date().toISOString(), sections: SECTIONS, docs, chunkCount: chunks.length })
);
fs.writeFileSync(
  path.join(OUT, 'chunks.json'),
  JSON.stringify(chunks.map((c) => [c.d, c.h, c.a, c.n, c.text]))
);

// ---------------------------------------------------------------------------
// 6. Índice MiniSearch
// ---------------------------------------------------------------------------
{
  const ms = new MiniSearch({
    idField: 'i',
    fields: ['title', 'heading', 'text'],
    storeFields: [],
    tokenize: tokenizeIndex,
    processTerm,
  });
  ms.addAll(chunks.map((c, i) => ({ i, title: docs[c.d].t, heading: c.h, text: c.text })));
  fs.writeFileSync(path.join(OUT, 'search-index.json'), JSON.stringify(ms));
  console.log(`Índice MiniSearch listo (${ms.termCount} términos)`);
}

// ---------------------------------------------------------------------------
// 7. Embeddings (e5-small, int8)
// ---------------------------------------------------------------------------
function passageText(title, heading, text) {
  const head = heading ? `${title} — ${heading}` : title;
  return `passage: ${head}\n${text}`.slice(0, 1200);
}

if (!NO_EMBED) {
  const { pipeline, env } = await import('@huggingface/transformers');
  env.allowRemoteModels = false;
  env.allowLocalModels = true;
  env.localModelPath = path.join(ROOT, 'public', 'models') + path.sep;
  const extractor = await pipeline('feature-extraction', MODEL_ID, { dtype: 'q8', device: 'cpu' });
  const DIM = 384;
  const N = chunks.length;
  const q8 = new Int8Array(N * DIM);
  const scales = new Float32Array(N);

  // caché por hash del texto (para no recalcular todo en cada build)
  const cacheDir = path.join(ROOT, 'node_modules', '.cache', 'visor-emb');
  fs.mkdirSync(cacheDir, { recursive: true });
  const cacheFile = path.join(cacheDir, `${MODEL_ID.replace('/', '_')}.bin`);
  const cache = new Map();
  if (fs.existsSync(cacheFile)) {
    const buf = fs.readFileSync(cacheFile);
    const rec = 20 + 4 + DIM;
    for (let off = 0; off + rec <= buf.length; off += rec) {
      cache.set(buf.subarray(off, off + 20).toString('hex'), {
        scale: buf.readFloatLE(off + 20),
        v: new Int8Array(buf.buffer.slice(buf.byteOffset + off + 24, buf.byteOffset + off + 24 + DIM)),
      });
    }
  }
  const newRecs = [];
  const texts = chunks.map((c) => passageText(docs[c.d].t, c.h, c.text));
  const hashes = texts.map((t) => crypto.createHash('sha1').update(t).digest('hex'));
  const todo = [];
  for (let i = 0; i < N; i++) {
    const hit = cache.get(hashes[i]);
    if (hit) {
      q8.set(hit.v, i * DIM);
      scales[i] = hit.scale;
    } else todo.push(i);
  }
  console.log(`Embeddings: ${N - todo.length} desde caché, ${todo.length} por calcular...`);
  todo.sort((a, b) => texts[a].length - texts[b].length);
  const BATCH = 32;
  const te = Date.now();
  const flushCache = () => {
    if (!newRecs.length) return;
    fs.appendFileSync(cacheFile, Buffer.concat(newRecs));
    newRecs.length = 0;
  };
  for (let b = 0; b < todo.length; b += BATCH) {
    const ids = todo.slice(b, b + BATCH);
    const out = await extractor(ids.map((i) => texts[i]), { pooling: 'mean', normalize: true });
    const data = out.data;
    for (let k = 0; k < ids.length; k++) {
      const i = ids[k];
      let max = 1e-9;
      for (let d = 0; d < DIM; d++) max = Math.max(max, Math.abs(data[k * DIM + d]));
      const scale = max / 127;
      const v = new Int8Array(DIM);
      for (let d = 0; d < DIM; d++) v[d] = Math.round(data[k * DIM + d] / scale);
      q8.set(v, i * DIM);
      scales[i] = scale;
      const rec = Buffer.alloc(24 + DIM);
      Buffer.from(hashes[i], 'hex').copy(rec, 0);
      rec.writeFloatLE(scale, 20);
      Buffer.from(v.buffer).copy(rec, 24);
      newRecs.push(rec);
    }
    const done = Math.min(b + BATCH, todo.length);
    if ((b / BATCH) % 20 === 0 || done === todo.length) {
      const el = (Date.now() - te) / 1000;
      const eta = (el / done) * (todo.length - done);
      console.log(`  embeddings ${done}/${todo.length}  (${el.toFixed(0)}s, faltan ~${eta.toFixed(0)}s)`);
      flushCache();
    }
  }
  flushCache();
  fs.writeFileSync(path.join(OUT, 'embeddings.bin'), Buffer.from(q8.buffer));
  fs.writeFileSync(path.join(OUT, 'embeddings-scales.bin'), Buffer.from(scales.buffer));
  fs.writeFileSync(
    path.join(OUT, 'embeddings-meta.json'),
    JSON.stringify({ model: MODEL_ID, dim: DIM, count: N, dtype: 'int8', pooling: 'mean', normalize: true, queryPrefix: 'query: ' })
  );
}

// ---------------------------------------------------------------------------
// 8. Resumen
// ---------------------------------------------------------------------------
const size = (f) => (fs.existsSync(f) ? fs.statSync(f).size : 0);
const dirSize = (d) => walk(d, () => true).reduce((a, f) => a + size(f), 0);
const mb = (b) => (b / 1024 / 1024).toFixed(1) + ' MB';
console.log('\nTamaños:');
console.log(`  docs/              ${mb(dirSize(path.join(OUT, 'docs')))}`);
console.log(`  manifest.json      ${mb(size(path.join(OUT, 'manifest.json')))}`);
console.log(`  chunks.json        ${mb(size(path.join(OUT, 'chunks.json')))}`);
console.log(`  search-index.json  ${mb(size(path.join(OUT, 'search-index.json')))}`);
console.log(`  embeddings.bin     ${mb(size(path.join(OUT, 'embeddings.bin')) + size(path.join(OUT, 'embeddings-scales.bin')))}`);
console.log(`Listo en ${((Date.now() - t0) / 1000).toFixed(0)}s`);
