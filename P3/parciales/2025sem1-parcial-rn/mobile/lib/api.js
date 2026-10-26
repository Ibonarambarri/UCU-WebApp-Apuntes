import { useCallback, useEffect, useState } from 'react';

/* Cliente de la API (json-server).
 *
 * OJO: este archivo venía en `app/api.js`. Lo movimos a `lib/` porque
 * Expo Router trata TODO archivo dentro de `app/` como una pantalla (ruta) y
 * se queja de que `api.js` no tiene `export default`.
 */

/** Arma la URL completa a partir de la variable de entorno.
 * `EXPO_PUBLIC_API_URL` se define en `mobile/.env`. Las variables que empiezan
 * con `EXPO_PUBLIC_` Expo las "pega" en el código al compilar (por eso hay que
 * reiniciar `expo start` si la cambiás).
 */
export function getAPIURL(path) {
  try {
    return new URL(path, new URL(process.env.EXPO_PUBLIC_API_URL).origin);
  } catch {
    throw new Error(`Could not get API URL for ${path} (process.env.EXPO_PUBLIC_API_URL=${process.env.EXPO_PUBLIC_API_URL})!`);
  }
}

/** fetch + chequeo de `response.ok` + JSON. Si algo sale mal tira un Error
 * (así el que llama lo agarra con try/catch).
 * `body` se pasa como objeto y acá lo convertimos a texto JSON.
 */
export async function fetchAPI(path, method = 'GET', body = undefined) {
  const url = getAPIURL(path);
  const options = { method };
  if (body !== undefined) {
    options.headers = { 'Content-Type': 'application/json' };
    options.body = JSON.stringify(body);
  }
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`${method} <${url}> failed with ${response.status} ${response.statusText}!`);
  }
  return await response.json();
}

/** Hook genérico para hacer un GET al montar la pantalla.
 * Devuelve `{ data, error, isLoading, reload }`.
 * `reload` sirve para volver a pedir los datos (por ejemplo al volver a la
 * pantalla, ver `useFocusEffect` en `app/index.jsx`).
 */
export function useFetch(path) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // useCallback para que `reload` sea siempre la misma función mientras no
  // cambie `path` (si no, el useEffect de abajo se ejecutaría en cada render).
  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const responseData = await fetchAPI(path);
      setData(responseData);
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

// --- Hooks y funciones concretas de esta app ---

/** GET /tasks */
export function useFetchTasks() {
  return useFetch('/tasks');
}

/** GET /tasks/:id */
export function useFetchTask(id) {
  return useFetch(`/tasks/${id}`);
}

/** GET /icons */
export function useFetchIcons() {
  return useFetch('/icons');
}

/** Crear tarea.
 * El PLANTEO dice `PUT /tasks/:task_id`, pero json-server 1.x devuelve 404 si
 * hacés PUT a un id que no existe. Para crear se usa POST /tasks (json-server
 * genera el id solo).
 */
export function createTask(task) {
  return fetchAPI('/tasks', 'POST', task);
}

/** PATCH /tasks/:id — cambia solo los campos que mandamos. */
export function updateTask(id, changes) {
  return fetchAPI(`/tasks/${id}`, 'PATCH', changes);
}
