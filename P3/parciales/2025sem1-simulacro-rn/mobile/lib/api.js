import { useCallback, useEffect, useState } from 'react';

/* Cliente de la API (json-server).
 * Va en `lib/` y NO en `app/`: todo lo que está en `app/` Expo Router lo
 * toma como una pantalla.
 */

/** Arma la URL completa usando `EXPO_PUBLIC_API_URL` (de `mobile/.env`).
 * Las variables `EXPO_PUBLIC_*` se pegan en el código al compilar: si la
 * cambiás, reiniciá `expo start`.
 */
export function getAPIURL(path) {
  try {
    return new URL(path, new URL(process.env.EXPO_PUBLIC_API_URL).origin);
  } catch {
    throw new Error(`Could not get API URL for ${path} (process.env.EXPO_PUBLIC_API_URL=${process.env.EXPO_PUBLIC_API_URL})!`);
  }
}

/** GET + chequeo de `response.ok` + JSON. Tira Error si algo falla. */
export async function fetchAPI(path) {
  const url = getAPIURL(path);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`GET <${url}> failed with ${response.status} ${response.statusText}!`);
  }
  return await response.json();
}

/** Hook genérico: hace el GET al montar y devuelve
 * `{ data, error, isLoading, reload }`.
 */
export function useFetch(path) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // useCallback: `reload` cambia solo si cambia `path` (si no, el useEffect
  // de abajo se ejecutaría en cada render → bucle infinito de fetch).
  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setData(await fetchAPI(path));
    } catch (fetchError) {
      setError(fetchError);
    } finally {
      setIsLoading(false);
    }
  }, [path]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, error, isLoading, reload };
}

/** GET /foods */
export function useFetchFoods() {
  return useFetch('/foods');
}

/** GET /foods/:id */
export function useFetchFood(id) {
  return useFetch(`/foods/${id}`);
}

/** GET /orders (todas) o GET /orders?food=:id (las de una comida). */
export function useFetchOrders(foodId = undefined) {
  return useFetch(foodId === undefined ? '/orders' : `/orders?food=${foodId}`);
}
