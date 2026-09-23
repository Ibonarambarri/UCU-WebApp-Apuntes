import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from 'react-router-dom';
import PageCountryList from '../PageCountryList/PageCountryList.jsx';
import PageCountry from '../PageCountry/PageCountry.jsx';
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
          <Route index element={<Navigate to="/countries" replace />} />
          <Route path="countries" element={<PageCountryList />} />
          <Route path="countries/:code" element={<PageCountry />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
