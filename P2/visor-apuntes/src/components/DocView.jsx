import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Markdown from './Markdown.jsx';
import { headingKey } from '../search/text.js';
import { SECTION_BY_KEY } from '../search/text.js';

const docCache = new Map();

function fetchDoc(id) {
  if (!docCache.has(id)) {
    docCache.set(
      id,
      fetch(`/data/docs/${encodeURI(id)}.json`).then((r) => {
        if (!r.ok) throw new Error('No se encontró el documento');
        return r.json();
      })
    );
    docCache.get(id).catch(() => docCache.delete(id));
  }
  return docCache.get(id);
}

function scrollToHeading(container, h, n) {
  if (!container) return;
  if (!h) {
    window.scrollTo({ top: 0 });
    return;
  }
  let target = null;
  try {
    target = container.querySelector(`[id="${CSS.escape(h)}"]`);
  } catch {
    /* id raro */
  }
  if (!target || n) {
    const key = headingKey(h);
    const matches = [...container.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter((el) => headingKey(el.textContent) === key);
    target = matches[Math.min(n || 0, matches.length - 1)] || target;
  }
  if (target) {
    const heading = target.matches('h1,h2,h3,h4,h5,h6') ? target : target.closest('h1,h2,h3,h4,h5,h6') || target;
    heading.scrollIntoView({ block: 'start' });
    heading.classList.remove('flash');
    void heading.offsetWidth;
    heading.classList.add('flash');
  }
}

export default function DocView({ id, h, n, manifest }) {
  const [state, setState] = useState({ id: null, doc: null, error: null });
  const ref = useRef(null);

  useEffect(() => {
    let alive = true;
    fetchDoc(id).then(
      (doc) => alive && setState({ id, doc, error: null }),
      (err) => alive && setState({ id, doc: null, error: err.message })
    );
    return () => {
      alive = false;
    };
  }, [id]);

  const ready = state.id === id && state.doc;
  useLayoutEffect(() => {
    if (ready) scrollToHeading(ref.current, h, n);
  }, [ready, id, h, n]);

  useEffect(() => {
    if (ready) document.title = `${state.doc.title} · Visor de apuntes`;
  }, [ready, state.doc]);

  if (state.id === id && state.error)
    return (
      <div className="doc">
        <h1>Documento no encontrado</h1>
        <p className="muted">{id}</p>
      </div>
    );
  if (!ready) return <div className="doc loading">Cargando…</div>;

  const { doc } = state;
  const hasH1 = /^#\s/m.test(doc.md.slice(0, 400)) && /^\s*#\s/.test(doc.md);
  const sec = SECTION_BY_KEY[doc.section];
  return (
    <article className="doc">
      <div className="doc-meta">
        <span className={`badge badge-${doc.section}`}>{sec?.short}</span>
        <code className="doc-src" title="Archivo original">{doc.src}</code>
      </div>
      {!hasH1 && <h1 className="doc-title">{doc.title}</h1>}
      <div ref={ref} className="md">
        <Markdown md={doc.md} />
      </div>
    </article>
  );
}
