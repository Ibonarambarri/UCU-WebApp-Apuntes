import { docHref } from '../hashRouter.js';
import { useSearchStatus } from '../search/client.js';

export default function Home({ manifest }) {
  const status = useSearchStatus();
  const notas = manifest.docs.filter((d) => d.s === 'notas');
  const count = (k) => manifest.docs.filter((d) => d.s === k).length;
  return (
    <div className="home">
      <h1>Visor de apuntes</h1>
      <p className="lead">
        Apuntes del parcial + documentación oficial offline (React, React Router v6 y MDN). Todo local, sin internet.
      </p>
      <div className="stats">
        <div><strong>{manifest.docs.length.toLocaleString('es')}</strong> documentos</div>
        <div><strong>{(manifest.chunkCount || status.chunks).toLocaleString('es')}</strong> fragmentos indexados</div>
        <div>{status.ready ? <>Índice listo en <strong>{status.loadMs} ms</strong></> : 'Cargando índice…'}</div>
      </div>

      <h2>Cómo buscar</h2>
      <ul>
        <li>
          Tocá <kbd>/</kbd> o <kbd>⌘</kbd>+<kbd>K</kbd> y escribí. Los resultados aparecen mientras escribís. <kbd>↑</kbd>/<kbd>↓</kbd> y <kbd>Enter</kbd> para abrir.
        </li>
        <li>
          Podés buscar en español: se agregan sinónimos en inglés (<em>ordenar → sort</em>, <em>ruta → route</em>, <em>parámetros de la url → searchParams</em>…). Tolera errores de tipeo.
        </li>
        <li>Los resultados de <strong>Mis apuntes</strong> pesan el doble; React y Router 1,5×.</li>
        <li>
          El modo <strong>Semántico (IA local)</strong> está apagado por defecto. Usa un modelo de embeddings local: confirmá con el docente si está permitido en el examen.
        </li>
      </ul>

      <h2>Mis apuntes</h2>
      <ul className="home-notes">
        {notas.map((d) => (
          <li key={d.id}>
            <a href={docHref(d.id)}>{d.t}</a> <span className="muted small">{d.src}</span>
          </li>
        ))}
      </ul>

      <h2>Documentación</h2>
      <ul className="home-docs">
        <li><a href={docHref('react/learn/index')}>React — Learn</a> · <a href={docHref('react/reference/react/index')}>Referencia</a> ({count('react')} págs)</li>
        <li><a href={docHref('router/start/overview')}>React Router v6</a> ({count('router')} págs)</li>
        <li><a href={docHref('mdn/web/javascript')}>MDN JavaScript</a> ({count('mdn-js')})</li>
        <li><a href={docHref('mdn/web/css')}>MDN CSS</a> ({count('mdn-css')})</li>
        <li><a href={docHref('mdn/web/html')}>MDN HTML</a> ({count('mdn-html')})</li>
        <li><a href={docHref('mdn/web/api')}>MDN Web APIs</a> ({count('mdn-api')})</li>
      </ul>
    </div>
  );
}
