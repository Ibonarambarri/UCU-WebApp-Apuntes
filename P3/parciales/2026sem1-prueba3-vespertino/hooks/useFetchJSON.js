import { useCallback, useEffect, useState } from 'react';
import { fetchJSON } from '@/common/fetch';

/** Hook genérico para hacer un GET a la API.
 *
 * Devuelve:
 * - `data`: la respuesta (null hasta que llega).
 * - `setData`: para reemplazar los datos a mano (p. ej. con lo que devolvió
 *   un PATCH, sin volver a pedirlo).
 * - `isLoading`: true mientras se espera la respuesta.
 * - `error`: null, o el Error que tiró `fetchJSON` (tiene `error.status`).
 * - `refetch`: vuelve a pedir los datos (botón "Reintentar").
 */
export function useFetchJSON(url) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // Cada vez que cambia este número el efecto corre otra vez → nuevo GET.
  const [reloadIndex, setReloadIndex] = useState(0);

  useEffect(() => {
    // Si cambia la URL (otro grupo / otro equipo) antes de que llegue la
    // respuesta vieja, la ignoramos para no pisar los datos nuevos.
    let ignore = false;
    (async () => {
      setIsLoading(true);
      setError(null);
      setData(null); // Para no mostrar el equipo anterior mientras carga el nuevo.
      try {
        const json = await fetchJSON(url);
        if (!ignore) {
          setData(json);
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
    // Limpieza: corre antes del próximo efecto o al desmontar la pantalla.
    return () => {
      ignore = true;
    };
  }, [url, reloadIndex]);

  const refetch = useCallback(() => setReloadIndex((index) => index + 1), []);

  return { data, setData, isLoading, error, refetch };
}
