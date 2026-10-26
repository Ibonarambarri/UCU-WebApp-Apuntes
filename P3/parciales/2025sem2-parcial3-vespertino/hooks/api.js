import { expoDevServerUri } from '@/components/utils';
import useFetch from './useFetch';

// Función común (no es un hook) para pedir JSON a la API mock.
// - expoDevServerUri arma la URL completa (http://IP:puerto/api/...).
//   En la web una ruta relativa ('/api/...') ya funciona, pero en el celular
//   NO: el teléfono no sabe cuál es "el servidor", hay que darle la URL entera.
// - Si la respuesta no es 2xx (por ejemplo un 404) tiramos un Error para que
//   el que llama lo agarre con try/catch y muestre el mensaje.
export async function obtenerJson(ruta) {
  const respuesta = await fetch(expoDevServerUri(ruta));
  if (!respuesta.ok) {
    throw new Error(`Error ${respuesta.status} al pedir ${ruta}`);
  }
  return respuesta.json();
}

// URL de la imagen de la bandera / mapa de un país (cca3 = 'URY', 'ARG'...).
export function urlBandera(cca3) {
  return expoDevServerUri(`/static/flags/${cca3}.svg`);
}

export function urlMapa(cca3) {
  return expoDevServerUri(`/static/maps/${cca3}.svg`);
}

// ---- Hooks que venían en la plantilla (no los usamos en la solución).
// OJO: useFetch devuelve `loading`, no `isLoading` (la plantilla de la
// pantalla trivia leía `isLoading` y por eso nunca mostraba "Loading...").

export const useFetchCountries = () => {
  return useFetch('/api/countries');
};

export const useFetchCountryByCode = (cca3) => {
  const url = cca3 ? `/api/countries/${encodeURIComponent(cca3)}` : null;
  return useFetch(url);
};

export const useFetchRandomCountries = (n) => {
  const url = n ? `/api/countries/random?n=${encodeURIComponent(+n)}` : null;
  return useFetch(url);
};
