// ==============================================
// Archivo: src/servicios/api.js
// Qué hace: junta en un solo lugar todas las llamadas a la API de
// countries.dev. Así las páginas no repiten la URL ni el fetch.
// Conceptos: fetch, async/await, respuesta.ok, respuesta.json().
// ==============================================

// URL base de la API. No requiere clave ni tiene problemas de CORS.
const URL_BASE = 'https://countries.dev';

// Devuelve la lista de TODOS los países, pidiendo solo los campos que
// necesitamos (nombre, código de 2 letras y banderas) para que sea liviana.
// Es async: quien la llame tiene que usar await (y try/catch).
async function obtenerListaDePaises() {
  const respuesta = await fetch(URL_BASE + '/countries?fields=name,alpha2Code,flags');

  // Siempre comprobar ok: fetch NO lanza error con un 404 o 500,
  // solo con problemas de red. Lo lanzamos nosotros a mano.
  if (!respuesta.ok) {
    throw new Error('Error al pedir la lista de países (código ' + respuesta.status + ')');
  }

  // Convertimos el cuerpo de la respuesta (texto JSON) en un array de objetos.
  const lista = await respuesta.json();
  return lista;
}

// Devuelve el detalle de UN país a partir de su código alpha2 (ej: "UY").
// Si el código no existe, la API responde 404 y lanzamos un error
// con un mensaje especial para que la página lo distinga.
async function obtenerPaisPorCodigo(codigo) {
  const respuesta = await fetch(URL_BASE + '/alpha/' + codigo);

  // Caso especial: el país no existe.
  if (respuesta.status === 404) {
    throw new Error('País no encontrado');
  }

  // Cualquier otro error del servidor.
  if (!respuesta.ok) {
    throw new Error('Error al pedir el país (código ' + respuesta.status + ')');
  }

  const pais = await respuesta.json();
  return pais;
}

export { obtenerListaDePaises, obtenerPaisPorCodigo };
