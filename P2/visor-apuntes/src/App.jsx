import { useEffect, useRef, useState } from 'react';
import { useHashLocation, navigate } from './hashRouter.js';
import { useManifest } from './manifest.js';
import { useSearchStatus, warmSemantic } from './search/client.js';
import Sidebar from './components/Sidebar.jsx';
import DocView from './components/DocView.jsx';
import SearchPage from './components/SearchPage.jsx';
import Home from './components/Home.jsx';

function searchUrl(q, sem) {
  const p = new URLSearchParams();
  if (q) p.set('q', q);
  if (sem) p.set('sem', '1');
  const qs = p.toString();
  return '/buscar' + (qs ? '?' + qs : '');
}

export default function App() {
  const loc = useHashLocation();
  const { manifest, error } = useManifest();
  const status = useSearchStatus();
  const inputRef = useRef(null);
  const [navOpen, setNavOpen] = useState(false);

  const onSearch = loc.path === '/buscar';
  const urlQuery = onSearch ? loc.params.get('q') || '' : '';
  const semantic = loc.params.get('sem') === '1' || (!onSearch && sessionStorage.getItem('visor-sem') === '1');
  const [draft, setDraft] = useState(urlQuery);

  useEffect(() => {
    if (onSearch) setDraft(urlQuery);
  }, [onSearch, urlQuery]);

  useEffect(() => {
    sessionStorage.setItem('visor-sem', semantic ? '1' : '0');
    if (semantic) warmSemantic();
  }, [semantic]);

  // atajos: "/" y Cmd/Ctrl+K enfocan el buscador; Esc lo desenfoca
  useEffect(() => {
    const onKey = (e) => {
      const tag = document.activeElement?.tagName;
      const typing = tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement?.isContentEditable;
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      } else if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        inputRef.current.blur();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    setNavOpen(false);
    if (loc.path === '/' || onSearch) document.title = 'Visor de apuntes';
  }, [loc.raw]);

  const onInput = (v) => {
    setDraft(v);
    navigate(searchUrl(v, semantic), { replace: onSearch });
  };

  const toggleSemantic = () => {
    const next = !semantic;
    sessionStorage.setItem('visor-sem', next ? '1' : '0');
    if (onSearch) navigate(searchUrl(urlQuery, next), { replace: true });
    else if (draft) navigate(searchUrl(draft, next));
    else navigate(searchUrl('', next));
  };

  let main;
  if (error) main = <div className="doc"><h1>Falta el índice</h1><p>{error}</p></div>;
  else if (!manifest) main = <div className="doc loading">Cargando…</div>;
  else if (onSearch) main = <SearchPage query={urlQuery} semantic={semantic} />;
  else if (loc.path.startsWith('/doc/'))
    main = <DocView id={loc.path.slice(5)} h={loc.params.get('h')} n={Number(loc.params.get('n') || 0)} manifest={manifest} />;
  else main = <Home manifest={manifest} />;

  const currentId = loc.path.startsWith('/doc/') ? loc.path.slice(5) : null;

  return (
    <div className={`app${navOpen ? ' nav-open' : ''}`}>
      <header className="topbar">
        <button type="button" className="hamburger" onClick={() => setNavOpen((o) => !o)} aria-label="Mostrar índice">
          ☰
        </button>
        <a href="#/" className="brand">
          <span className="logo">V</span> Visor de apuntes
        </a>
        <div className="searchbox">
          <input
            id="search-input"
            ref={inputRef}
            type="search"
            autoComplete="off"
            spellCheck={false}
            placeholder={semantic ? 'Preguntá con tus palabras…  ( / o ⌘K )' : 'Buscar en apuntes y docs…  ( / o ⌘K )'}
            value={draft}
            onChange={(e) => onInput(e.target.value)}
            onFocus={() => {
              if (!onSearch && draft) navigate(searchUrl(draft, semantic));
            }}
          />
          {!status.ready && <span className="idx-loading">índice…</span>}
        </div>
        <div className="mode">
          <label className={`switch${semantic ? ' on' : ''}`} title="Usa un modelo de embeddings local. Confirmá con el docente si está permitido en el examen.">
            <input type="checkbox" checked={semantic} onChange={toggleSemantic} />
            <span className="track"><span className="thumb" /></span>
            <span className="mode-label">Semántico (IA local)</span>
          </label>
          <span className="mode-note">
            {semantic
              ? status.sem.status === 'ready'
                ? '✓ modelo local cargado · '
                : status.sem.status === 'loading'
                ? status.sem.detail + ' · '
                : ''
              : 'Modo: palabras clave · '}
            Usa un modelo de embeddings local. Confirmá con el docente si está permitido en el examen.
          </span>
        </div>
      </header>
      <div className="body">
        {manifest && <Sidebar manifest={manifest} currentId={currentId} />}
        <main className="main">{main}</main>
      </div>
    </div>
  );
}
