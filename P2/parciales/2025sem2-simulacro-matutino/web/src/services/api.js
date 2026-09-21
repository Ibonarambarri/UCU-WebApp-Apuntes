// ==============================================
// Archivo: src/services/api.js
// Qué hace: concentra TODAS las llamadas a la API del backend (el mock que
// sirve Vite en el mismo puerto). Así los componentes no repiten fetch.
// Conceptos: fetch, async/await, try/catch (lo hace quien llama), respuesta.ok.
// ==============================================

// La API vive en el MISMO servidor que la app (Vite monta el mock), por eso
// alcanza con rutas relativas que empiezan con "/api".
const URL_BASE_API = '/api';

// Pide la lista de códigos de país (cca3). Devuelve un array de strings,
// por ejemplo ["ABW", "AFG", "AGO", ...].
export async function obtenerCodigosDePaises() {
  const respuesta = await fetch(URL_BASE_API + '/countries');
  // Siempre comprobamos respuesta.ok: fetch NO lanza error con un 404 o 500.
  if (!respuesta.ok) {
    throw new Error('No se pudo obtener la lista de países (estado ' + respuesta.status + ')');
  }
  const codigos = await respuesta.json();
  return codigos;
}

// Pide el detalle de UN país a partir de su código de 3 letras.
// Devuelve el objeto completo: name, capital, currencies, timezones, flag, map...
export async function obtenerPais(cca3) {
  const respuesta = await fetch(URL_BASE_API + '/countries/' + cca3);
  if (!respuesta.ok) {
    throw new Error('No se pudo obtener el país ' + cca3 + ' (estado ' + respuesta.status + ')');
  }
  const pais = await respuesta.json();
  return pais;
}
