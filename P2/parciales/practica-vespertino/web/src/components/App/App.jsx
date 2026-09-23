import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from 'react-router-dom';
import PagePlay from '../../pages/PagePlay/PagePlay.jsx';
import styles from './App.module.css';

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true }}>
      <Routes>
        <Route
          path="/"
          element={(
            <div className={styles.app}>
              <Outlet />
            </div>
          )}
        >
          <Route index element={<Navigate to="/play" replace />} />
          <Route path="play" element={<PagePlay />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
