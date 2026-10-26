import { useFavorites } from '../../context/FavoritesContext.js';
import styles from './FavoriteButton.module.css';

/** Estrella para marcar/desmarcar un país como favorito.
 * Lee y modifica los favoritos desde el contexto, así sirve igual en el
 * listado y en el detalle (y el contador del header se actualiza solo).
 */
export default function FavoriteButton({ code }) {
  const { isFavorite, isPending, toggleFavorite } = useFavorites();
  const active = isFavorite(code);

  return (
    <button
      type="button"
      className={`${styles.star} ${active ? styles.active : ''}`}
      onClick={() => toggleFavorite(code)}
      disabled={isPending(code)}
      aria-pressed={active}
      title={active ? 'Quitar de favoritos' : 'Agregar a favoritos'}
    >
      {active ? '★' : '☆'}
    </button>
  );
}
