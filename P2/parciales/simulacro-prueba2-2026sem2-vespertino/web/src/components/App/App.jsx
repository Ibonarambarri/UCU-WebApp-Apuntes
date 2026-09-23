import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from 'react-router-dom';
import PageHome from '../../pages/PageHome/PageHome.jsx';
import PagePlay from '../../pages/PagePlay/PagePlay.jsx';
import PagePlayers from '../../pages/PagePlayers/PagePlayers.jsx';
import styles from './App.module.css';

export default function App() {
  // Flags "future" de v6: solo silencian los warnings de migración a v7.
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        {/* Ruta "layout": el <Outlet /> renderiza la página hija que matchea. */}
        <Route
          path="/"
          element={(
            <div className={styles.app}>
              <Outlet />
            </div>
          )}
        >
          {/* index = la ruta exacta "/" (antes redirigía a /play). */}
          <Route index element={<PageHome />} />
          <Route path="play" element={<PagePlay />} />
          <Route path="players" element={<PagePlayers />} />
          {/* Cualquier otra URL vuelve al inicio en vez de mostrar una página vacía. */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
