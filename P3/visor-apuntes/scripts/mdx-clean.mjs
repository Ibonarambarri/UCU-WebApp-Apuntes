// Limpieza de MDX (docs de Expo y de React Native / Docusaurus) a Markdown legible.
//   - quita `import ... from '...'` y comentarios {/* ... */}
//   - convierte los componentes JSX conocidos (<Terminal>, <FileTree>, <BoxLink>, <Step>,
//     <Collapsible>, <Tabs>/<Tab>, <TabItem>, <APISection>, <APIInstallSection>…) en Markdown
//   - a los desconocidos les quita la etiqueta y conserva el contenido (des-indentado)
//   - convierte las admoniciones de Docusaurus (:::note … :::) en callouts > [!NOTE]
// Los bloques de código (``` / ~~~) y el `código inline` NO se tocan.

const FENCE_LINE = /^[ \t]*(`{3,}|~{3,})(.*)$/;

/** Rangos [inicio, fin) de los bloques de código cercados, para no tocarlos. */
function fenceRanges(src) {
  const ranges = [];
  let pos = 0;
  let open = null; // {start, ch, len}
  for (const line of src.split('\n')) {
    const m = line.match(FENCE_LINE);
    if (open) {
      if (m && m[1][0] === open.ch && m[1].length >= open.len && !m[2].trim()) {
        ranges.push([open.start, pos + line.length]);
        open = null;
      }
    } else if (m) open = { start: pos, ch: m[1][0], len: m[1].length };
    pos += line.length + 1;
  }
  if (open) ranges.push([open.start, src.length]);
  return ranges;
}

/** Salta una expresión JS entre llaves balanceadas a partir de src[i] === '{'. Devuelve el índice tras '}'. */
function skipBraces(src, i) {
  let depth = 0;
  for (; i < src.length; i++) {
    const c = src[i];
    if (c === '{') depth++;
    else if (c === '}') {
      depth--;
      if (depth === 0) return i + 1;
    } else if (c === '"' || c === "'") {
      // solo cuenta como string si cierra en la misma línea (evita apóstrofes de texto JSX: "don't")
      const nl = src.indexOf('\n', i + 1);
      const lineEnd = nl < 0 ? src.length : nl;
      let j = i + 1;
      while (j < lineEnd && src[j] !== c) j += src[j] === '\\' ? 2 : 1;
      if (j < lineEnd) i = j;
    } else if (c === '`') {
      const j = src.indexOf('`', i + 1);
      if (j > 0) i = j;
    }
  }
  return -1;
}

/** Parsea los atributos de una etiqueta JSX desde src[i] (justo después del nombre). */
function parseAttrs(src, i) {
  const attrs = {};
  const limit = Math.min(src.length, i + 20000);
  while (i < limit) {
    while (/\s/.test(src[i])) i++;
    if (src.startsWith('/>', i)) return { attrs, selfClosing: true, end: i + 2 };
    if (src[i] === '>') return { attrs, selfClosing: false, end: i + 1 };
    if (src[i] === '{') {
      const j = skipBraces(src, i);
      if (j < 0) return null;
      i = j;
      continue;
    }
    const m = src.slice(i, i + 200).match(/^[A-Za-z_][\w:.-]*/);
    if (!m) return null;
    const name = m[0];
    i += name.length;
    while (src[i] === ' ' || src[i] === '\t') i++;
    if (src[i] !== '=') {
      attrs[name] = true;
      continue;
    }
    i++;
    while (/\s/.test(src[i])) i++;
    const q = src[i];
    if (q === '"' || q === "'") {
      const j = src.indexOf(q, i + 1);
      if (j < 0) return null;
      attrs[name] = { str: src.slice(i + 1, j) };
      i = j + 1;
    } else if (q === '{') {
      const j = skipBraces(src, i);
      if (j < 0) return null;
      attrs[name] = { expr: src.slice(i + 1, j - 1) };
      i = j;
    } else return null;
  }
  return null;
}

const STR_LIT = /'((?:[^'\\\n]|\\.)*)'|"((?:[^"\\\n]|\\.)*)"|`([^`]*)`/g;
const unescape = (s) => s.replace(/\\(['"`\\])/g, '$1').replace(/\\n/g, '\n');

/** Todos los literales de string de una expresión JS (para cmd={[...]}, files={[...]}). */
function strings(attr) {
  if (!attr || attr === true) return [];
  if (attr.str != null) return [attr.str];
  const out = [];
  let m;
  STR_LIT.lastIndex = 0;
  while ((m = STR_LIT.exec(attr.expr))) out.push(unescape(m[1] ?? m[2] ?? m[3] ?? ''));
  return out;
}

/** Texto de un atributo: string, primer literal, o la expresión JSX sin etiquetas. */
function text(attr) {
  if (!attr || attr === true) return '';
  if (attr.str != null) return attr.str;
  const e = attr.expr.trim();
  if (/^</.test(e)) return e.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  const s = strings(attr);
  return s.length ? s.join(' ') : '';
}

function dedent(s) {
  const lines = s.split('\n');
  let min = Infinity;
  for (const l of lines) if (l.trim()) min = Math.min(min, l.match(/^[ \t]*/)[0].length);
  if (!isFinite(min) || min === 0) return s;
  return lines.map((l) => l.slice(Math.min(min, l.match(/^[ \t]*/)[0].length))).join('\n');
}

const block = (s) => '\n\n' + s.trim() + '\n\n';
const quote = (s) =>
  s
    .trim()
    .split('\n')
    .map((l) => (l.trim() ? '> ' + l : '>'))
    .join('\n');
const callout = (type, title, body) => block(`> [!${type}]\n${title ? `> **${title}**\n>\n` : ''}${quote(body || '')}`);

const PLATFORM = { android: 'Android', ios: 'iOS', web: 'Web', macos: 'macOS', tvos: 'tvOS' };
// Componentes que solo muestran imágenes/videos/diagramas: se quitan con todo su contenido.
const DROP = new Set(['ContentSpotlight', 'ImageViewer', 'DiffBlock', 'ProgressTracker', 'Video', 'VideoPlayer', 'Diagram', 'RedirectNotification', 'TemplateFeature', 'SocialGrid', 'ExpoGoLogo']);

function render(name, attrs, children, isBlock, ctx) {
  const kids = children == null ? '' : dedent(children.replace(/^\n+/, ''));
  switch (name) {
    case 'Terminal': {
      const cmds = strings(attrs.cmd);
      return cmds.length ? block('```bash\n' + cmds.join('\n') + '\n```') : '';
    }
    case 'FileTree': {
      const files = strings(attrs.files);
      return files.length ? block('```text\n' + files.join('\n') + '\n```') : '';
    }
    case 'BoxLink':
    case 'VideoBoxLink': {
      const title = text(attrs.title) || 'Link';
      const href = text(attrs.href) || (attrs.videoId ? `https://www.youtube.com/watch?v=${text(attrs.videoId)}` : '');
      const desc = text(attrs.description);
      const link = href ? `[${title}](${href})` : title;
      return block(`- **${link}**${desc ? ' — ' + desc : ''}`);
    }
    case 'APISection': {
      const pkg = strings(attrs.packageName)[0] || '';
      const link = pkg && ctx.apiLink ? ctx.apiLink(pkg) : null;
      return link ? block(`> [!NOTE]\n> **Referencia de la API** (props, hooks, métodos): [${pkg}](${link})`) : '';
    }
    case 'APIInstallSection': {
      const pkg = ctx.fm?.packageName;
      const href = text(attrs.href);
      let s = '';
      if (pkg) s += '```bash\nnpx expo install ' + pkg + '\n```\n';
      if (href) s += `\nInstrucciones: [${href}](${href})\n`;
      return s ? block('**Instalación**\n\n' + s) : '';
    }
    case 'Collapsible':
      return callout('DEEPDIVE', text(attrs.summary), kids);
    case 'Step': {
      const label = text(attrs.label);
      return block(`**Paso ${label}.**\n\n${kids.trim()}`);
    }
    case 'Tab':
    case 'TabItem': {
      const label = text(attrs.label) || text(attrs.value);
      return block((label ? `**${label}:**\n\n` : '') + kids.trim());
    }
    case 'Requirement':
      return block((text(attrs.title) ? `**${text(attrs.title)}**\n\n` : '') + kids.trim());
    case 'Prerequisites':
      return callout('NOTE', 'Requisitos', kids);
    case 'ConfigPluginProperties': {
      // properties={[{ name: '…', description: '…', default: '…' }, …]}
      const expr = attrs.properties?.expr || '';
      const rows = [];
      for (const seg of expr.split(/\{\s*(?=name\s*:)/).slice(1)) {
        const get = (k) => {
          const m = seg.match(new RegExp(k + "\\s*:\\s*(?:'((?:[^'\\\\]|\\\\.)*)'|\"((?:[^\"\\\\]|\\\\.)*)\"|`([^`]*)`)"));
          return m ? unescape(m[1] ?? m[2] ?? m[3] ?? '').replace(/\s*\n\s*/g, ' ').replace(/\|/g, '\\|') : '';
        };
        rows.push(`| \`${get('name')}\` | ${get('default') ? '`' + get('default') + '`' : '-'} | ${get('description')} |`);
      }
      return rows.length ? block('| Propiedad | Por defecto | Descripción |\n| --- | --- | --- |\n' + rows.join('\n')) : '';
    }
    case 'AndroidPermissions':
    case 'IOSPermissions': {
      const ps = strings(attrs.permissions);
      return ps.length ? block(`**Permisos ${name === 'IOSPermissions' ? 'iOS' : 'Android'}:** ` + ps.map((p) => '`' + p + '`').join(', ')) : '';
    }
    case 'TableRow': {
      const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const n = text(attrs.name);
      const url = text(attrs.url);
      return `<tr><td>${url ? `<a href="${url}">${esc(n)}</a>` : esc(n)}</td><td><code>${esc(text(attrs.code))}</code></td></tr>`;
    }
    case 'YesIcon':
      return '✅';
    case 'NoIcon':
      return '❌';
    case 'PlatformTags':
    case 'PlatformTag': {
      const ps = strings(attrs.platforms || attrs.platform).map((p) => PLATFORM[p.toLowerCase()] || p);
      return ps.length ? ` _(${ps.join(', ')})_ ` : '';
    }
    case 'CODE':
    case 'InlineCode':
      return '`' + kids.replace(/`/g, '').trim() + '`';
    case 'Kbd':
      return '<kbd>' + kids.trim() + '</kbd>';
    default:
      if (DROP.has(name)) return '';
      if (children == null) return '';
      return isBlock ? block(kids) : kids;
  }
}

/** Convierte los componentes JSX de un MDX en Markdown. */
export function cleanJsx(src, ctx = {}) {
  const fences = fenceRanges(src);
  let fi = 0;
  const fenceAt = (i) => {
    while (fi < fences.length && fences[fi][1] <= i) fi++;
    return fi < fences.length && fences[fi][0] <= i ? fences[fi] : null;
  };

  function parse(i, stop) {
    let out = '';
    while (i < src.length) {
      const f = fenceAt(i);
      if (f) {
        out += src.slice(i, f[1]);
        i = f[1];
        continue;
      }
      const c = src[i];
      const lineStart = i === 0 || src[i - 1] === '\n';
      if (c === '`') {
        const run = src.slice(i).match(/^`+/)[0];
        const j = src.indexOf(run, i + run.length);
        const nextFence = fences[fi] ? fences[fi][0] : Infinity;
        if (j > 0 && j < nextFence && !src.slice(i, j).includes('\n\n')) {
          out += src.slice(i, j + run.length);
          i = j + run.length;
        } else {
          out += run;
          i += run.length;
        }
        continue;
      }
      if (c === '{' && src.startsWith('{/*', i)) {
        const j = src.indexOf('*/}', i);
        if (j > 0) {
          i = j + 3;
          continue;
        }
      }
      if (lineStart && (c === 'i' || c === 'e')) {
        const m = src.slice(i, i + 2000).match(/^(?:import\s[\s\S]*?from\s+['"][^'"\n]+['"];?|import\s+['"][^'"\n]+['"];?|export\s+const\s+\w+\s*=\s*['"{[][^\n]*;?)[ \t]*(?=\n|$)/);
        if (m) {
          i += m[0].length;
          continue;
        }
      }
      if (c === '<') {
        const rest = src.slice(i, i + 200);
        let m = rest.match(/^<\/([A-Z][\w.]*)?\s*>/);
        if (m) {
          i += m[0].length;
          if (stop !== undefined) return { out, i };
          continue; // cierre suelto
        }
        m = rest.match(/^<>/);
        if (m) {
          i += 2;
          continue;
        }
        m = rest.match(/^<([A-Z][\w.]*)/);
        if (m) {
          const name = m[1];
          const a = parseAttrs(src, i + m[0].length);
          if (a) {
            const before = src.slice(src.lastIndexOf('\n', i - 1) + 1, i);
            const isBlock = !before.trim();
            let children = null;
            let end = a.end;
            if (!a.selfClosing) {
              const r = parse(a.end, name);
              children = r.out;
              end = r.i;
            }
            out += render(name, a.attrs, children, isBlock, ctx);
            i = end;
            continue;
          }
        }
      }
      out += c;
      i++;
    }
    return { out, i };
  }

  return parse(0).out;
}

const ADMONITION = { note: 'NOTE', info: 'NOTE', tip: 'TIP', warning: 'WARNING', caution: 'CAUTION', danger: 'CAUTION', important: 'IMPORTANT', experimental: 'NOTE' };

/** :::note Título … ::: (Docusaurus) → > [!NOTE] */
export function cleanAdmonitions(md) {
  const out = [];
  let depth = 0;
  let fence = null;
  for (const line of md.split('\n')) {
    const fm = line.match(FENCE_LINE);
    const prefix = '> '.repeat(depth);
    if (fence) {
      out.push(prefix + line);
      if (fm && fm[1][0] === fence[0] && fm[1].length >= fence.length && !fm[2].trim()) fence = null;
      continue;
    }
    if (fm) {
      fence = fm[1];
      out.push(prefix + line);
      continue;
    }
    const open = line.match(/^\s*:::+\s*([a-z]+)\s*(.*)$/i);
    if (open && ADMONITION[open[1].toLowerCase()]) {
      out.push(prefix);
      out.push(prefix + `> [!${ADMONITION[open[1].toLowerCase()]}]`);
      const title = open[2].replace(/^\[|\]$/g, '').trim();
      if (title) out.push(prefix + `> **${title}**`);
      out.push(prefix + '>');
      depth++;
      continue;
    }
    if (depth && /^\s*:::+\s*$/.test(line)) {
      depth--;
      out.push('> '.repeat(depth));
      continue;
    }
    out.push(prefix + line);
  }
  return out.join('\n');
}
