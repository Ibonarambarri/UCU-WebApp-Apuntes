import { Link, Outlet } from 'react-router-dom';
import { useFavorites } from '../../context/FavoritesContext.js';
import styles from './Layout.module.css';

/** Barra superior común a todas las páginas + <Outlet /> donde React Router
 * dibuja la página de la ruta hija (/countries o /countries/:code).
 */
export default function Layout() {
  const { favorites } = useFavorites();

  return (
    <>
      <nav className={styles.bar}>
        <Link to="/countries" className={styles.brand}>
          🌎 Country Explorer
        </Link>
        <Link to="/countries?fav=1" className={styles.favorites}>
          ★ Favoritos ({favorites.length})
        </Link>
      </nav>
      <main className={styles.main}>
        <Outlet />
      </main>
    </>
  );
}
