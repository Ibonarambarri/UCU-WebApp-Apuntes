/** Hace un pedido HTTP y devuelve la respuesta ya convertida de JSON.
 *
 * `fetch` sólo tira error si falla la red; un 404 o un 500 NO tiran error
 * solos. Por eso revisamos `response.ok` y, si no está bien, tiramos un Error
 * nosotros (con el status guardado, para poder distinguir un 404).
 */
export async function fetchJSON(url, options = undefined) {
  const response = await fetch(url, options);
  if (!response.ok) {
    const error = new Error(`${options?.method ?? 'GET'} ${url} falló con ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return response.json();
}
