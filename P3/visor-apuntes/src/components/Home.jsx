import { docHref } from '../hashRouter.js';
import { useSearchStatus } from '../search/client.js';

// Links a una página solo si existe en el índice (las fuentes pueden cambiar al re-indexar).
function DocLink({ manifest, id, children }) {
  if (!manifest.byId.has(id)) return <span className="muted">{children}</span>;
  return <a href={docHref(id)}>{children}</a>;
}

export default function Home({ manifest }) {
  const status = useSearchStatus();
  const notas = manifest.docs.filter((d) => d.s === 'notas');
  const count = (k) => manifest.docs.filter((d) => d.s === k).length;
  const L = (props) => <DocLink manifest={manifest} {...props} />;
  return (
    <div className="home">
      <h1>Parcial 3 — React Native + Expo</h1>
      <p className="lead">
        Apuntes del parcial + documentación oficial offline (React Native, Expo SDK 58, Expo Router, AsyncStorage v2) y lo de
        React del Parcial 2. Todo local, sin internet.
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
          Podés buscar en español: se agregan sinónimos en inglés (<em>lista → FlatList</em>, <em>parámetros de la ruta → useLocalSearchParams</em>,{' '}
          <em>guardar → AsyncStorage</em>, <em>al volver a la pantalla → useFocusEffect</em>…). Tolera errores de tipeo.
        </li>
        <li>Los resultados de <strong>Mis apuntes</strong> pesan el doble; React Native y Expo Router 1,5×.</li>
        <li>
          El modo <strong>Semántico (IA local)</strong> está apagado por defecto. Usa un modelo de embeddings local: confirmá con el docente si está permitido en el examen.
        </li>
      </ul>

      <h2>Mis apuntes</h2>
      {notas.length === 0 && <p className="muted">Todavía no hay apuntes indexados: escribilos en P3/ y corré <code>npm run build-index</code>.</p>}
      <ul className="home-notes">
        {notas.map((d) => (
          <li key={d.id}>
            <a href={docHref(d.id)}>{d.t}</a> <span className="muted small">{d.src}</span>
          </li>
        ))}
      </ul>

      <h2>Documentación</h2>
      <ul className="home-docs">
        <li>
          <strong>React Native</strong> ({count('rn')} págs): <L id="rn/components-and-apis">componentes y APIs</L> ·{' '}
          <L id="rn/flatlist">FlatList</L> · <L id="rn/textinput">TextInput</L> · <L id="rn/pressable">Pressable</L> ·{' '}
          <L id="rn/flexbox">Flexbox</L> · <L id="rn/style">Estilos</L>
        </li>
        <li>
          <strong>Expo Router</strong> ({count('expo-router')} págs): <L id="expo/router/introduction">introducción</L> ·{' '}
          <L id="expo/router/basics/core-concepts">conceptos</L> · <L id="expo/router/basics/navigation">navegar</L> ·{' '}
          <L id="expo/router/reference/url-parameters">parámetros (useLocalSearchParams)</L> · <L id="expo/router/advanced/stack">Stack</L> ·{' '}
          <L id="expo/router/advanced/tabs">Tabs</L> · <L id="expo/router/web/api-routes">API routes</L>
        </li>
        <li>
          <strong>Expo API (SDK 58)</strong> ({count('expo-api')} págs): <L id="expo-api/expo-router">expo-router</L> ·{' '}
          <L id="expo-api/expo-image">expo-image</L> · <L id="expo-api/expo-constants">expo-constants</L>
        </li>
        <li>
          <strong>Expo SDK 58 y guías</strong> ({count('expo')} págs): <L id="expo/versions/v58.0.0/index">SDK 58</L> ·{' '}
          <L id="expo/tutorial/introduction">tutorial</L> · <L id="expo/get-started/create-a-project">crear un proyecto</L>
        </li>
        <li>
          <strong>AsyncStorage v2</strong> ({count('async-storage')} págs): <L id="async-storage/Usage">uso</L> ·{' '}
          <L id="async-storage/API">API</L>
        </li>
        <li>
          <strong>React (P2)</strong>: {count('p2')} apuntes de clase · <L id="react/learn/index">React — Learn</L> ·{' '}
          <L id="react/reference/react/index">Referencia</L> ({count('react')} págs)
        </li>
      </ul>
    </div>
  );
}
