// ==============================================
// Archivo: src/services/api.js
// Qué hace: agrupa TODAS las llamadas fetch a la API del parcial en un solo
//   lugar. Así los componentes solo llaman a una función y no repiten
//   fetch + comprobar respuesta.ok + json() por todos lados.
// Conceptos: fetch, async/await, try/catch (lo hace quien llama),
//   query string, encodeURIComponent.
// ==============================================

// Función auxiliar: hace un GET a la url que le pasan y devuelve el JSON.
// Si el servidor responde con error (respuesta.ok es false) lanzamos un Error
// para que el componente que llamó lo capture en su try/catch.
async function obtenerJson(url) {
  const respuesta = await fetch(url);
  if (!respuesta.ok) {
    throw new Error('Error al pedir ' + url + ' (status ' + respuesta.status + ')');
  }
  const datos = await respuesta.json();
  return datos;
}

// Devuelve la lista de monedas: [{ code, name, symbol }, ...]
async function obtenerMonedas() {
  return await obtenerJson('/api/currencies');
}

// Devuelve la lista de lenguajes: [{ code, name }, ...]
async function obtenerLenguajes() {
  return await obtenerJson('/api/languages');
}

// Devuelve la lista de zonas horarias: ["UTC-04:00", "UTC+01:00", ...]
async function obtenerZonasHorarias() {
  return await obtenerJson('/api/timezones');
}

// Devuelve la lista de países filtrada. OJO: la API devuelve SOLO un array de
// códigos cca3, por ejemplo ["ARG", "BRA", "URY"], NO los objetos completos.
// Los tres parámetros pueden venir como string vacío "" cuando el usuario
// eligió "Todas" en el select; en ese caso NO se agrega el filtro a la URL.
async function obtenerPaises(moneda, lenguaje, zonaHoraria) {
  // Construimos el query string "a mano" concatenando strings.
  // Empezamos con la ruta base y vamos agregando "&clave=valor" por cada
  // filtro que no esté vacío. Usamos encodeURIComponent porque las zonas
  // horarias tienen un "+" (UTC+01:00) y en una URL el "+" significa espacio;
  // encodeURIComponent lo convierte en "%2B" que el servidor sí entiende.
  let url = '/api/countries';
  const partesDelQuery = [];

  if (moneda !== '') {
    partesDelQuery.push('currency=' + encodeURIComponent(moneda));
  }
  if (lenguaje !== '') {
    partesDelQuery.push('language=' + encodeURIComponent(lenguaje));
  }
  if (zonaHoraria !== '') {
    partesDelQuery.push('timezone=' + encodeURIComponent(zonaHoraria));
  }

  // Si hay al menos un filtro, unimos las partes con "&" y las pegamos con "?".
  // Ejemplo: /api/countries?currency=EUR&language=fra
  if (partesDelQuery.length > 0) {
    url = url + '?' + partesDelQuery.join('&');
  }

  return await obtenerJson(url);
}

// Devuelve el objeto completo de UN país a partir de su código cca3.
async function obtenerPais(cca3) {
  return await obtenerJson('/api/countries/' + cca3);
}

export {
  obtenerMonedas,
  obtenerLenguajes,
  obtenerZonasHorarias,
  obtenerPaises,
  obtenerPais,
};
