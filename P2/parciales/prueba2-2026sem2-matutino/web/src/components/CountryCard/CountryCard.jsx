import { Link, useLocation } from 'react-router-dom';
import FavoriteButton from '../FavoriteButton/FavoriteButton.jsx';
import { formatNumber, formatText } from '../../utils/format.js';
import styles from './CountryCard.module.css';

/** Una fila del listado: bandera, nombre, capital, región, población,
 * estrella de favorito y link al detalle.
 */
export default function CountryCard({ country }) {
  const location = useLocation();
  // Mandamos los query params actuales (?q=…&sort=…) al detalle en el `state`
  // del Link, para que "Volver al listado" vuelva a la misma búsqueda.
  const linkState = { listSearch: location.search };

  return (
    <li className={styles.card}>
      <span className={styles.flag}>{country.flag}</span>
      <div className={styles.info}>
        <Link to={`/countries/${country.code}`} state={linkState} className={styles.name}>
          {country.name}
        </Link>
        <span>{formatText(country.capital)}</span>
        <span className={styles.region}>{formatText(country.region)}</span>
      </div>
      <div className={styles.population}>
        <span className={styles.label}>Población</span>
        <span>{formatNumber(country.population)}</span>
      </div>
      <div className={styles.actions}>
        <FavoriteButton code={country.code} />
        <Link to={`/countries/${country.code}`} state={linkState}>Ver →</Link>
      </div>
    </li>
  );
}
