import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchJSON } from '../utils/fetch.js';
import { FavoritesContext } from './FavoritesContext.js';

/** Guarda los favoritos para TODA la app (listado, detalle y header).
 *
 * Los favoritos viven en la API (sobreviven a un refresh). Acá tenemos una copia
 * en memoria para no pedirlos en cada pantalla, y la actualizamos cada vez que
 * la API confirma un PUT o un DELETE.
 */
export default function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]); // [{ code, date }]
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // Códigos que tienen un PUT/DELETE en curso (para deshabilitar la estrella).
  const [pendingCodes, setPendingCodes] = useState([]);

  // Carga inicial: GET /api/favorites (una sola vez, al montar la app).
  useEffect(() => {
    (async () => {
      try {
        setFavorites(await fetchJSON('/api/favorites'));
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const isFavorite = useCallback(
    (code) => favorites.some((favorite) => favorite.code === code),
    [favorites],
  );

  const toggleFavorite = useCallback(async (code) => {
    const wasFavorite = favorites.some((favorite) => favorite.code === code);
    setPendingCodes((codes) => [...codes, code]);
    setError(null);
    try {
      if (wasFavorite) {
        // DELETE /api/favorites/:code
        await fetchJSON(`/api/favorites/${code}`, { method: 'DELETE' });
        setFavorites((list) => list.filter((favorite) => favorite.code !== code));
      } else {
        // PUT /api/favorites con body { code }. OJO: fetchJSON ya hace el
        // JSON.stringify del body, no hay que hacerlo a mano.
        const favorite = await fetchJSON('/api/favorites', { method: 'PUT', body: { code } });
        setFavorites((list) => [...list, favorite]);
      }
    } catch (err) {
      setError(err);
    } finally {
      setPendingCodes((codes) => codes.filter((pending) => pending !== code));
    }
  }, [favorites]);

  const isPending = useCallback((code) => pendingCodes.includes(code), [pendingCodes]);

  // useMemo: el objeto `value` solo cambia cuando cambia algo de adentro.
  const value = useMemo(() => ({
    favorites, isLoading, error, isFavorite, isPending, toggleFavorite,
  }), [favorites, isLoading, error, isFavorite, isPending, toggleFavorite]);

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}
