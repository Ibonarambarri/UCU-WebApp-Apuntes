// ==============================================
// Archivo: src/services/api.js
// Qué hace: una única función para hacer GET a la API y devolver el JSON.
//   En este parcial casi todas las vistas reciben la URL a pedir por props,
//   así que con una función genérica alcanza. Además hay una función para
//   pedir un país por su código, que la usan ItemPais y PaginaPais.
// Conceptos: fetch, async/await, comprobar respuesta.ok, lanzar Error.
// ==============================================

// Hace un GET a la url y devuelve el JSON. Si el servidor responde con error
// (por ejemplo 404) lanzamos un Error para que el try/catch del componente
// que llamó lo capture y muestre un mensaje.
async function obtenerJson(url) {
  const respuesta = await fetch(url);
  if (!respuesta.ok) {
    throw new Error('Error al pedir ' + url + ' (status ' + respuesta.status + ')');
  }
  const datos = await respuesta.json();
  return datos;
}

// Devuelve el objeto completo de UN país a partir de su código cca3.
async function obtenerPais(cca3) {
  return await obtenerJson('/api/countries/' + cca3);
}

export { obtenerJson, obtenerPais };
