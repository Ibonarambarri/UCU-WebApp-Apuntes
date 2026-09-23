import { useCallback, useEffect, useState } from 'react';
import { fetchJSON } from '../utils/fetch.js';

/** Hook genérico para hacer un GET a la API y guardar el resultado.
 *
 * Devuelve lo mismo que los hooks que dan los docentes en las plantillas
 * (`data`, `isLoading`, `error`, `refetch`), así se usa igual en todos lados.
 *
 * - Si cambia `url` (por ejemplo, porque cambió el `:code` de la ruta), el
 *   efecto se vuelve a ejecutar y pide los datos nuevos.
 * - `ignore` evita un bug clásico: si el usuario navega rápido de un país a
 *   otro, una respuesta vieja que llega tarde NO pisa a la nueva.
 * - Si `url` es null no se pide nada (útil para pedidos condicionales).
 */
export function useFetchJSON(url) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(url));
  const [error, setError] = useState(null);
  const [reloadIndex, setReloadIndex] = useState(0);

  useEffect(() => {
    if (!url) {
      return;
    }
    let ignore = false;
    (async () => {
      setIsLoading(true);
      setError(null);
      setData(null); // Para no mostrar el país anterior mientras carga el nuevo.
      try {
        const jsonData = await fetchJSON(url);
        if (!ignore) {
          setData(jsonData);
        }
      } catch (err) {
        if (!ignore) {
          setError(err);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    })();
    // Función de limpieza: se ejecuta antes del próximo efecto o al desmontar.
    return () => {
      ignore = true;
    };
  }, [url, reloadIndex]);

  // Cambiar reloadIndex fuerza a que el efecto vuelva a correr (reintentar).
  const refetch = useCallback(() => setReloadIndex((index) => index + 1), []);

  return { data, isLoading, error, refetch };
}
