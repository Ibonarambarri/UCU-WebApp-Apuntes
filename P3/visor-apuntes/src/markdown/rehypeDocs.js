// Plugin rehype: callouts (> [!NOTE] …), ids en headings y limpieza de nodos peligrosos.
import { slugify } from '../search/text.js';

const CALLOUT_TITLES = {
  NOTE: 'Nota',
  PITFALL: 'Cuidado',
  WARNING: 'Cuidado',
  DEEPDIVE: 'En profundidad',
  HINT: 'Pista',
  SOLUTION: 'Solución',
  LEARN: 'Vas a aprender',
  RECAP: 'Resumen',
  TIP: 'Consejo',
  IMPORTANT: 'Importante',
  CAUTION: 'Cuidado',
};

function textOf(node) {
  if (node.type === 'text') return node.value;
  return (node.children || []).map(textOf).join('');
}

function firstElement(node) {
  return (node.children || []).find((c) => c.type === 'element');
}

// Nada que pueda pedir recursos externos (modo offline).
const BLOCKED = ['script', 'style', 'iframe', 'img', 'link', 'meta', 'video', 'audio', 'source', 'track', 'object', 'embed', 'picture', 'image', 'use', 'base', 'form'];

function transform(node) {
  if (!node.children) return;
  node.children = node.children.filter(
    (c) => !(c.type === 'element' && BLOCKED.includes(c.tagName))
  );
  for (let i = 0; i < node.children.length; i++) {
    const c = node.children[i];
    if (c.type !== 'element') continue;
    if (c.properties?.style && /url\(/i.test(String(c.properties.style))) delete c.properties.style;
    if (/^h[1-6]$/.test(c.tagName)) {
      c.properties = c.properties || {};
      if (!c.properties.id) c.properties.id = slugify(textOf(c)) || undefined;
    }
    if (c.tagName === 'blockquote') {
      const p = firstElement(c);
      const first = p && p.tagName === 'p' ? p.children?.[0] : null;
      const m = first && first.type === 'text' ? first.value.match(/^\s*\[!([A-Z]+)\]\s*/) : null;
      if (m) {
        const type = m[1];
        first.value = first.value.slice(m[0].length);
        if (!textOf(p).trim()) c.children = c.children.filter((x) => x !== p);
        const title = CALLOUT_TITLES[type] || type;
        if (type === 'SOLUTION' || type === 'HINT') {
          node.children[i] = {
            type: 'element',
            tagName: 'details',
            properties: { className: ['callout', 'callout-' + type.toLowerCase()] },
            children: [
              { type: 'element', tagName: 'summary', properties: {}, children: [{ type: 'text', value: title }] },
              ...c.children,
            ],
          };
        } else {
          c.tagName = 'div';
          c.properties = { className: ['callout', 'callout-' + type.toLowerCase()] };
          c.children.unshift({
            type: 'element',
            tagName: 'div',
            properties: { className: ['callout-title'] },
            children: [{ type: 'text', value: title }],
          });
        }
        transform(node.children[i]);
        continue;
      }
    }
    transform(c);
  }
}

export default function rehypeDocs() {
  return (tree) => transform(tree);
}
