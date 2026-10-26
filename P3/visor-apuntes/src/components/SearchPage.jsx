import { useEffect, useRef, useState } from 'react';
import { search, useSearchStatus } from '../search/client.js';
import { docHref, navigate } from '../hashRouter.js';
import { SECTIONS, SECTION_BY_KEY } from '../search/text.js';

const LS_KEY = 'visor-fuentes';
function loadSources() {
  try {
    const v = JSON.parse(localStorage.getItem(LS_KEY));
    if (Array.isArray(v) && v.length) return v;
  } catch {
    /* nada */
  }
  return SECTIONS.map((s) => s.key);
}

export default function SearchPage({ query, semantic }) {
  const status = useSearchStatus();
  const [sources, setSources] = useState(loadSources);
  const [res, setRes] = useState(null);
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);
  const [sel, setSel] = useState(0);
  const latest = useRef(0);

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(sources));
  }, [sources]);

  useEffect(() => {
    if (!status.ready) return;
    const q = query.trim();
    if (!q) {
      setRes(null);
      return;
    }
    const my = ++latest.current;
    const delay = semantic ? 250 : 150;
    const t = setTimeout(() => {
      setBusy(true);
      search(q, { mode: semantic ? 'semantic' : 'keyword', sources: sources.length === SECTIONS.length ? [] : sources }).then(
        (r) => {
          if (my !== latest.current) return;
          setRes(r);
          setErr(null);
          setSel(0);
          setBusy(false);
        },
        (e) => {
          if (my !== latest.current) return;
          setErr(e.message);
          setBusy(false);
        }
      );
    }, delay);
    return () => clearTimeout(t);
  }, [query, semantic, sources, status.ready]);

  // navegación con teclado por los resultados
  useEffect(() => {
    const onKey = (e) => {
      if (!res?.results.length) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSel((s) => Math.min(s + 1, res.results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSel((s) => Math.max(s - 1, 0));
      } else if (e.key === 'Enter' && document.activeElement?.id === 'search-input') {
        const r = res.results[sel];
        if (r) navigate(docHref(r.docId, { h: r.anchor, n: r.occ }).slice(1));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [res, sel]);

  useEffect(() => {
    document.querySelector('.result.sel')?.scrollIntoView({ block: 'nearest' });
  }, [sel]);

  const toggleSource = (k) => setSources((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]));

  return (
    <div className="search-page">
      <div className="filters">
        <span className="filters-label">Fuentes:</span>
        {SECTIONS.map((s) => (
          <label key={s.key} className={`chip chip-${s.key}${sources.includes(s.key) ? ' on' : ''}`}>
            <input type="checkbox" checked={sources.includes(s.key)} onChange={() => toggleSource(s.key)} />
            {s.short}
          </label>
        ))}
        <button type="button" className="link-btn" onClick={() => setSources(SECTIONS.map((s) => s.key))}>
          todas
        </button>
        <button type="button" className="link-btn" onClick={() => setSources(['notas'])}>
          solo apuntes
        </button>
      </div>

      {!status.ready && <p className="muted">Cargando índice de búsqueda…</p>}
      {semantic && status.sem.status === 'loading' && <p className="sem-loading">⏳ {status.sem.detail}</p>}
      {semantic && status.sem.status === 'error' && <p className="error">Modo semántico no disponible: {status.sem.detail}</p>}
      {err && <p className="error">{err}</p>}

      {!query.trim() && status.ready && (
        <p className="muted">Escribí algo en el buscador. Podés buscar en español: “ordenar array”, “parámetros de la url”, “centrar con flexbox”…</p>
      )}

      {res && query.trim() && (
        <>
          <div className="res-meta">
            {res.results.length ? `${res.total.toLocaleString('es')} fragmentos` : 'Sin resultados'} · {res.ms} ms
            {res.mode === 'semantic' ? ` (semántico: ${res.semMs} ms, fusión RRF)` : ''}
            {busy && ' · buscando…'}
            {res.matchedKeys.length > 0 && (
              <span className="syn" title={res.expanded.join(', ')}>
                {' '}· sinónimos: {res.matchedKeys.join(', ')}
              </span>
            )}
          </div>
          <ol className="results">
            {res.results.map((r, i) => (
              <li key={r.chunk} className={`result${i === sel ? ' sel' : ''}`} onMouseEnter={() => setSel(i)}>
                <a href={docHref(r.docId, { h: r.anchor, n: r.occ })}>
                  <div className="r-head">
                    <span className={`badge badge-${r.section}`}>{SECTION_BY_KEY[r.section]?.short}</span>
                    <span className="r-title">{r.title}</span>
                    {r.heading && <span className="r-heading">› {r.heading}</span>}
                    {res.mode === 'semantic' && (
                      <span className="via" title="k = palabras clave, s = semántico">
                        {r.via}
                      </span>
                    )}
                  </div>
                  <p className="snippet">
                    {r.snippet.map(([t, m], j) => (m ? <mark key={j}>{t}</mark> : <span key={j}>{t}</span>))}
                  </p>
                </a>
              </li>
            ))}
          </ol>
        </>
      )}
    </div>
  );
}
