// Genera public/data/ a partir de los apuntes y la documentación offline de P2/.
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

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const P2 = path.resolve(ROOT, '..');
const OUT = path.join(ROOT, 'public', 'data');
const NO_EMBED = process.argv.includes('--no-embed');
const MODEL_ID = 'Xenova/multilingual-e5-small';

const t0 = Date.now();
const rel = (abs) => path.relative(P2, abs).split(path.sep).join('/');

// ---------------------------------------------------------------------------
// 1. Descubrir fuentes
// ---------------------------------------------------------------------------
function walk(dir, pred, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, pred, acc);
    else if (pred(p)) acc.push(p);
  }
  return acc;
}

const MDN_BASE = 'docs-offline/mdn/files/en-us/';
const REACT_BASE = 'docs-offline/react.dev/src/content/';
const ROUTER_BASE = 'docs-offline/react-router-v6/docs/';

/** Ruta relativa a P2 → id de documento (idéntico al que usa el visor en la URL). */
function srcToId(src) {
  if (src.startsWith(MDN_BASE)) return 'mdn/' + src.slice(MDN_BASE.length).replace(/\/index\.md$/, '');
  if (src.startsWith(REACT_BASE)) return 'react/' + src.slice(REACT_BASE.length).replace(/\.mdx?$/, '');
  if (src.startsWith(ROUTER_BASE)) return 'router/' + src.slice(ROUTER_BASE.length).replace(/\.md$/, '');
  return 'notas/' + src.replace(/\.md$/, '');
}

const sources = []; // {abs, src, section, tree}

// Carpetas de "Mis apuntes" en la barra lateral. El último segmento es la hoja (el documento);
// el orden de las carpetas y de los documentos es el de inserción (no alfabético).
const CLASE_NIVELES = [
  [1, 6, 'Nivel 1 · Cimientos (1-6)'],
  [7, 9, 'Nivel 2 · Estado (7-9)'],
  [10, 12, 'Nivel 3 · Datos (10-12)'],
  [13, 15, 'Nivel 4 · Navegación (13-15)'],
  [16, 17, 'Nivel 5 · Estado compartido (16-17)'],
  [18, 19, 'Nivel 6 · Terminaciones (18-19)'],
];
function notesTree(src) {
  const leaf = src.replace(/\//g, '~');
  if (/^(PLAN-DE-RUTA-EXAMEN|CHULETA-EXAMEN|ESTRATEGIA-EXAMEN)\.md$/.test(src)) return `⭐ Examen/${leaf}`;
  if (src.startsWith('clase/')) {
    const n = Number(src.slice(6, 8));
    if (!n) return `📘 Clase (19 temas)/${leaf}`;
    const nivel = CLASE_NIVELES.find(([a, b]) => n >= a && n <= b);
    return `📘 Clase (19 temas)/${nivel ? nivel[2] : 'Otros'}/${leaf}`;
  }
  if (src.includes('2026sem2')) return `🎯 Simulacros 2026sem2 (resueltos)/${leaf}`;
  if (src.startsWith('parciales/')) return `🗂 Parciales anteriores/${leaf}`;
  return `🧭 Guías e índices/${leaf}`;
}

// Mis apuntes (en el orden pedido)
{
  const seen = new Set();
  const add = (abs) => {
    if (!fs.existsSync(abs) || seen.has(abs)) return;
    seen.add(abs);
    const src = rel(abs);
    sources.push({ abs, src, section: 'notas', tree: notesTree(src) });
  };
  add(path.join(P2, 'README.md'));
  add(path.join(P2, 'PLAN-DE-RUTA-EXAMEN.md'));
  add(path.join(P2, 'CHULETA-EXAMEN.md'));
  add(path.join(P2, 'ESTRATEGIA-EXAMEN.md'));
  add(path.join(P2, 'GUIA-ESTUDIO-TARDE.md'));
  // Apuntes de la clase (un archivo por tema), en orden 00, 01, 02…
  // Solo los .md del primer nivel: las subcarpetas (clase/_insumos/) NO se indexan.
  const claseDir = path.join(P2, 'clase');
  if (fs.existsSync(claseDir)) {
    for (const e of fs.readdirSync(claseDir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      if (e.isFile() && e.name.endsWith('.md')) add(path.join(claseDir, e.name));
    }
  }
  add(path.join(P2, 'parciales/simulacro-prueba2-2026sem2-matutino/APUNTES-PARCIAL.md'));
  add(path.join(P2, 'parciales/simulacro-prueba2-2026sem2-vespertino/APUNTES-PARCIAL.md'));
  const parcDir = path.join(P2, 'parciales');
  for (const d of fs.readdirSync(parcDir).sort().reverse()) add(path.join(parcDir, d, 'APUNTES-PARCIAL.md'));
  // apuntes/ (y apuntes/_archivo/) ya NO se indexan: su contenido vive en clase/ y ESTRATEGIA-EXAMEN.md.
  add(path.join(P2, 'docs-offline/INDICE.md'));
}

// React
for (const sub of ['learn', 'reference']) {
  const base = path.join(P2, REACT_BASE, sub);
  for (const abs of walk(base, (p) => /\.mdx?$/.test(p)).sort()) {
    const src = rel(abs);
    sources.push({ abs, src, section: 'react', tree: src.slice(REACT_BASE.length).replace(/\.mdx?$/, '') });
  }
}
// React Router
for (const abs of walk(path.join(P2, ROUTER_BASE), (p) => p.endsWith('.md')).sort()) {
  const src = rel(abs);
  sources.push({ abs, src, section: 'router', tree: src.slice(ROUTER_BASE.length).replace(/\.md$/, '') });
}
// MDN
const MDN_PARTS = [
  ['mdn-js', 'web/javascript'],
  ['mdn-css', 'web/css'],
  ['mdn-css', 'learn_web_development/core/css_layout'],
  ['mdn-html', 'web/html'],
  ['mdn-api', 'web/api'],
];
for (const [section, sub] of MDN_PARTS) {
  const base = path.join(P2, MDN_BASE, sub);
  for (const abs of walk(base, (p) => p.endsWith('/index.md')).sort()) {
    const src = rel(abs);
    let tree = src.slice(MDN_BASE.length).replace(/\/?index\.md$/, '');
    tree = tree === sub ? '' : tree.slice(sub.length + 1);
    if (sub.startsWith('learn_')) tree = 'css_layout' + (tree ? '/' + tree : '');
    sources.push({ abs, src, section, tree });
  }
}

for (const s of sources) s.id = srcToId(s.src);
const idSet = new Set(sources.map((s) => s.id));
console.log(`Fuentes encontradas: ${sources.length}`);

// ---------------------------------------------------------------------------
// 2. Front-matter + tablas de slugs/redirects de MDN
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

const mdnSlugToId = new Map();
for (const s of sources) if (s.fm.slug) mdnSlugToId.set(s.fm.slug.toLowerCase(), s.id);
const mdnRedirects = new Map();
{
  const f = path.join(P2, MDN_BASE, '_redirects.txt');
  if (fs.existsSync(f)) {
    for (const line of fs.readFileSync(f, 'utf8').split('\n')) {
      if (!line || line.startsWith('#')) continue;
      const [from, to] = line.split('\t');
      if (from && to) mdnRedirects.set(from.toLowerCase(), to);
    }
  }
}
function mdnLookup(slug) {
  let key = decodeURIComponent(slug).replace(/\/$/, '').toLowerCase();
  for (let i = 0; i < 3; i++) {
    if (mdnSlugToId.has(key)) return mdnSlugToId.get(key);
    const r = mdnRedirects.get('/en-us/docs/' + key);
    if (!r) return null;
    key = r.replace(/^\/en-US\/docs\//i, '').toLowerCase();
  }
  return null;
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
    const map = { plain: 'text', sh: 'bash', shell: 'bash', console: 'bash', 'js-interactive-example': 'js' };
    l = map[l] || l;
    // conservar nombre de archivo de Sandpack como meta
    return `${pre}${f}${l}${rest}`;
  });
}

function parseMacroArgs(s) {
  const args = [];
  if (!s) return args;
  const re = /"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)'|([^,\s][^,]*)/g;
  let m;
  while ((m = re.exec(s))) args.push((m[1] ?? m[2] ?? m[3] ?? '').trim());
  return args;
}

const JS_REF_DIRS = /^(global_objects|statements|operators|functions|errors|lexical_grammar|classes|deprecated_and_obsolete_features|iteration_protocols|strict_mode|template_literals|trailing_commas|regular_expressions|data_structures|execution_model)/i;

function mdnLink(text, slugs, code = true) {
  const shown = code ? '`' + text.replace(/`/g, '') + '`' : text;
  for (const slug of slugs) {
    const id = mdnLookup(slug);
    if (id) return `[${shown}](/en-US/docs/${slug})`;
  }
  return shown;
}

function cleanMdnMacros(text) {
  return text.replace(/\{\{\s*([A-Za-z_][\w-]*)\s*(?:\(([\s\S]*?)\))?\s*\}\}/g, (all, name, argStr) => {
    const n = name.toLowerCase();
    const a = parseMacroArgs(argStr);
    const disp = a[1] || a[0] || '';
    switch (n) {
      case 'jsxref': {
        let t = a[0].replace(/\.prototype\./, '/').replace(/\(\)$/, '');
        const slug = 'Web/JavaScript/Reference/' + (JS_REF_DIRS.test(t) ? t : 'Global_Objects/' + t.replace(/\./g, '/'));
        return mdnLink(a[1] || a[0], [slug]);
      }
      case 'cssxref': {
        const t = a[0].replace(/^&lt;|&gt;$/g, '');
        return mdnLink(
          (a[1] || a[0]).replace(/&lt;/g, '<').replace(/&gt;/g, '>'),
          ['Web/CSS/' + t, 'Web/CSS/Reference/Properties/' + t, 'Web/CSS/Reference/Values/' + t, 'Web/CSS/Reference/Selectors/' + t, 'Web/CSS/Reference/At-rules/' + t]
        );
      }
      case 'domxref': {
        const t = a[0].replace(/\(\)$/, '').replace(/\./g, '/');
        return mdnLink(a[1] || a[0], ['Web/API/' + t]);
      }
      case 'htmlelement':
        return mdnLink(a[1] || `<${a[0]}>`, ['Web/HTML/Reference/Elements/' + a[0], 'Web/HTML/Element/' + a[0]]);
      case 'glossary':
        return disp;
      case 'httpheader':
      case 'httpmethod':
      case 'httpstatus':
      case 'svgelement':
      case 'svgattr':
      case 'htmlattrxref':
      case 'jsxref_':
        return disp ? '`' + disp + '`' : '';
      case 'optional_inline':
        return '_(optional)_';
      case 'deprecated_inline':
        return '_(deprecated)_';
      case 'experimental_inline':
        return '_(experimental)_';
      case 'non-standard_inline':
        return '_(non-standard)_';
      case 'readonlyinline':
        return '_(read-only)_';
      default:
        return '';
    }
  });
}

/** Quita secciones completas (## Specifications, ## Browser compatibility). */
function removeSections(md, titles) {
  const lines = md.split('\n');
  const out = [];
  let skipping = false;
  let fence = null;
  for (const line of lines) {
    const fm = line.match(FENCE_RE);
    if (!fence) {
      const h = line.match(/^(#{1,2})\s+(.*)$/);
      if (h) skipping = titles.includes(h[2].trim().toLowerCase());
    }
    if (fm) {
      if (!fence) fence = fm[2];
      else if (fm[2][0] === fence[0] && !fm[3].trim()) fence = null;
    }
    if (!skipping) out.push(line);
  }
  return out.join('\n');
}

function cleanMdn(body) {
  let md = mapOutsideFences(body, (t) =>
    cleanMdnMacros(t)
      .replace(/^(\s*)- : /gm, '$1- ')
      .replace(/^\s*\{\{[^}]*\}\}\s*$/gm, '')
  );
  md = removeSections(md, ['specifications', 'browser compatibility']);
  return md;
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
function cleanRouter(body) {
  return body.replace(/<docs-(info|warning|success|error)>([\s\S]*?)<\/docs-\1>/g, (all, kind, inner) => {
    const type = kind === 'warning' || kind === 'error' ? 'PITFALL' : 'NOTE';
    const lines = inner.trim().split('\n');
    return '\n> [!' + type + ']\n>\n' + lines.map((l) => '> ' + l).join('\n') + '\n';
  });
}

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

function resolveUrl(url, ctx) {
  url = url.trim().replace(/^<|>$/g, '');
  if (!url) return '#roto';
  const hashIdx = url.indexOf('#');
  const base = hashIdx >= 0 ? url.slice(0, hashIdx) : url;
  const frag = hashIdx >= 0 ? url.slice(hashIdx + 1) : '';
  const internal = (id) => `#/doc/${id}${frag ? '?h=' + encodeURIComponent(frag) : ''}`;
  if (!base) return frag ? internal(ctx.id) : '#roto';

  let m = base.match(/^(?:https?:\/\/developer\.mozilla\.org)?\/(?:en-US\/)?docs\/(.+)$/i);
  if (m) {
    const id = mdnLookup(m[1]);
    return id ? internal(id) : `https://developer.mozilla.org/en-US/docs/${m[1]}${frag ? '#' + frag : ''}`;
  }
  m = base.match(/^(?:https?:\/\/(?:[\w-]+\.)?react\.dev)?\/((?:learn|reference|blog|community)(?:\/.*)?)$/);
  if (m && (base.startsWith('http') || ctx.section === 'react')) {
    const id = 'react/' + m[1].replace(/\/$/, '');
    if (idSet.has(id)) return internal(id);
    if (idSet.has(id + '/index')) return internal(id + '/index');
    return `https://react.dev/${m[1]}${frag ? '#' + frag : ''}`;
  }
  if (/^(https?:|mailto:)/i.test(base)) return url;
  if (base.startsWith('/')) return '#roto';
  // relativo al archivo
  const dir = path.posix.dirname(ctx.src);
  const target = path.posix.normalize(path.posix.join(dir, decodeURIComponent(base)));
  for (const cand of [target, target + '.md', target.replace(/\/$/, '') + '/index.md', target.replace(/\/$/, '') + '.md']) {
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

function cleanDoc(s) {
  let md = s.body.replace(/\r\n/g, '\n');
  if (s.section.startsWith('mdn')) md = cleanMdn(md);
  else if (s.section === 'react') md = cleanJsxBlocks(md);
  else if (s.section === 'router') md = cleanRouter(md);
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
