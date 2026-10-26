import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';
import FavoritesProvider from '../../context/FavoritesProvider.jsx';
import Layout from '../Layout/Layout.jsx';
import PageCountryList from '../PageCountryList/PageCountryList.jsx';
import PageCountry from '../PageCountry/PageCountry.jsx';
import PageNotFound from '../PageNotFound/PageNotFound.jsx';

export default function App() {
  return (
    <FavoritesProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          {/* Ruta "layout": no tiene página propia, dibuja la barra + <Outlet />. */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/countries" replace />} />
            <Route path="countries" element={<PageCountryList />} />
            <Route path="countries/random" element={<PageCountry />} />
            <Route path="countries/:code" element={<PageCountry />} />
            {/* Cualquier otra URL (/hola) */}
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </FavoritesProvider>
  );
}
