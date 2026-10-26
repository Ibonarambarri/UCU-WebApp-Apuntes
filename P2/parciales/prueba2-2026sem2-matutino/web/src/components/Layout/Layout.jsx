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

        <a href="/countries/random" className={styles.favorites}>
          Al azar
        </a>
      </nav>
      <main className={styles.main}>
        <Outlet />
      </main>
    </>
  );
}
