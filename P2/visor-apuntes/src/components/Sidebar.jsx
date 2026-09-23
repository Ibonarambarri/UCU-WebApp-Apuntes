import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { docHref } from '../hashRouter.js';
import { normalize } from '../search/text.js';

// Orden fijo de las carpetas de "Mis apuntes" (por su emoji inicial); dentro de cada carpeta se
// respeta el orden en que el build-index agregó los documentos (Tema 1, 2, 3…, no alfabético).
const NOTES_ORDER = ['⭐', '📘', '🎯', '🗂', '🧭'];
const notesRank = (label) => {
  const i = NOTES_ORDER.findIndex((e) => label.startsWith(e));
  return i < 0 ? NOTES_ORDER.length : i;
};

// Carpetas abiertas/cerradas: se recuerdan entre visitas (solo comodidad; si falla, se ignora).
const STORAGE_KEY = 'visor.sidebar.expanded';
function loadExpanded() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved)) return new Set(saved);
  } catch {
    // sin localStorage: valores por defecto
  }
  return new Set(['sec:notas', 'notas/⭐ Examen', 'notas/📘 Clase (19 temas)']);
}
function saveExpanded(set) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
  } catch {
    // ignorar
  }
}

function buildNotesTree(docs) {
  const root = { key: 'notas', children: new Map(), doc: null };
  for (const d of docs) {
    const segs = d.tree.split('/');
    let node = root;
    let key = 'notas';
    for (const seg of segs) {
      key += '/' + seg;
      if (!node.children.has(seg)) node.children.set(seg, { key, name: seg, children: new Map(), doc: null });
      node = node.children.get(seg);
    }
    node.doc = d;
  }
  const finalize = (node) => ({
    key: node.key,
    doc: node.doc,
    label: node.doc?.t || node.name,
    kids: [...node.children.values()].map(finalize),
  });
  const tree = finalize(root);
  tree.kids.sort((a, b) => notesRank(a.label) - notesRank(b.label));
  return tree;
}

function buildTree(docs) {
  const root = { key: '', name: '', children: new Map(), doc: null };
  for (const d of docs) {
    const segs = d.tree ? d.tree.split('/') : [];
    let node = root;
    let key = d.s;
    for (const seg of segs) {
      key += '/' + seg;
      if (!node.children.has(seg)) node.children.set(seg, { key, name: seg, children: new Map(), doc: null });
      node = node.children.get(seg);
    }
    node.doc = d;
  }
  const finalize = (node, depth) => {
    const kids = [...node.children.values()].map((c) => finalize(c, depth + 1));
    kids.sort((a, b) => {
      if (depth === 0) {
        const order = ['learn', 'reference'];
        const ia = order.indexOf(a.name);
        const ib = order.indexOf(b.name);
        if (ia !== ib && ia >= 0 && ib >= 0) return ia - ib;
      }
      return a.label.localeCompare(b.label, 'es', { sensitivity: 'base' });
    });
    return { key: node.key, name: node.name, doc: node.doc, label: node.doc?.t || node.name.replace(/[_-]/g, ' '), kids };
  };
  return finalize(root, 0);
}

function TreeNode({ node, depth, expanded, toggle, currentId }) {
  const hasKids = node.kids.length > 0;
  const open = expanded.has(node.key);
  const active = node.doc && node.doc.id === currentId;
  return (
    <li>
      <div className={`tree-row${active ? ' active' : ''}`} style={{ paddingLeft: 8 + depth * 12 }}>
        {hasKids ? (
          <button type="button" className="twisty" onClick={() => toggle(node.key)} aria-label={open ? 'Colapsar' : 'Expandir'} aria-expanded={open}>
            {open ? '▾' : '▸'}
          </button>
        ) : (
          <span className="twisty-spacer" />
        )}
        {node.doc ? (
          <a href={docHref(node.doc.id)} title={node.label} data-doc={node.doc.id}>
            {node.label}
          </a>
        ) : (
          <button type="button" className="folder" onClick={() => toggle(node.key)}>
            {node.label}
          </button>
        )}
      </div>
      {hasKids && open && (
        <ul>
          {node.kids.map((k) => (
            <TreeNode key={k.key} node={k} depth={depth + 1} expanded={expanded} toggle={toggle} currentId={currentId} />
          ))}
        </ul>
      )}
    </li>
  );
}

function Sidebar({ manifest, currentId }) {
  const trees = useMemo(() => {
    const out = {};
    for (const sec of manifest.sections) {
      const docs = manifest.docs.filter((d) => d.s === sec.key);
      out[sec.key] = sec.key === 'notas' ? buildNotesTree(docs) : buildTree(docs);
    }
    return out;
  }, [manifest]);

  const [expanded, setExpanded] = useState(loadExpanded);
  useEffect(() => saveExpanded(expanded), [expanded]);
  const [filter, setFilter] = useState('');
  const ref = useRef(null);

  // expandir los ancestros del documento actual
  useEffect(() => {
    const d = currentId && manifest.byId.get(currentId);
    if (!d) return;
    setExpanded((prev) => {
      const next = new Set(prev);
      next.add('sec:' + d.s);
      if (d.tree) {
        const segs = d.tree.split('/');
        let key = d.s;
        for (const seg of segs.slice(0, -1)) {
          key += '/' + seg;
          next.add(key);
        }
        next.add(key + '/' + segs[segs.length - 1]);
      }
      return next;
    });
    requestAnimationFrame(() => {
      const el = ref.current?.querySelector(`a[data-doc="${CSS.escape(currentId)}"]`);
      if (el) el.scrollIntoView({ block: 'nearest' });
    });
  }, [currentId, manifest]);

  const toggle = (key) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  const filtered = useMemo(() => {
    const f = normalize(filter.trim());
    if (f.length < 2) return null;
    return manifest.docs.filter((d) => normalize(d.t).includes(f)).slice(0, 200);
  }, [filter, manifest]);

  return (
    <nav className="sidebar" ref={ref} aria-label="Documentos">
      <div className="tree-tools">
        <input
          className="tree-filter"
          type="search"
          placeholder="Filtrar por título…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <button type="button" className="collapse-all" onClick={() => setExpanded(new Set(['sec:notas']))} title="Colapsar todas las carpetas">
          ⊟
        </button>
      </div>
      {filtered ? (
        <ul className="tree flat">
          {filtered.length === 0 && <li className="muted small pad">Sin coincidencias</li>}
          {filtered.map((d) => (
            <li key={d.id}>
              <div className={`tree-row${d.id === currentId ? ' active' : ''}`}>
                <span className={`dot dot-${d.s}`} />
                <a href={docHref(d.id)} title={d.src}>{d.t}</a>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        manifest.sections.map((sec) => {
          const open = expanded.has('sec:' + sec.key);
          const count = manifest.docs.filter((d) => d.s === sec.key).length;
          return (
            <section key={sec.key} className="tree-section">
              <button type="button" className="section-head" onClick={() => toggle('sec:' + sec.key)} aria-expanded={open}>
                <span className="twisty-s">{open ? '▾' : '▸'}</span>
                <span className={`dot dot-${sec.key}`} />
                {sec.label}
                <span className="count">{count}</span>
              </button>
              {open && (
                <ul className="tree">
                  {trees[sec.key].kids.map((k) => (
                    <TreeNode key={k.key} node={k} depth={0} expanded={expanded} toggle={toggle} currentId={currentId} />
                  ))}
                </ul>
              )}
            </section>
          );
        })
      )}
    </nav>
  );
}

export default memo(Sidebar);
