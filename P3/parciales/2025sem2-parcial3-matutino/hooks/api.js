import { expoDevServerUri } from '@/components/utils';
import { useEffect, useState } from 'react';

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

// ---- Hooks que venían en la plantilla (no los usamos en la solución, pero
// los dejamos por si sirven para alguna variante) ----

function makeFetchJSONHook(resource, options = undefined) {
  return function (...args) {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
      (async () => {
        setIsLoading(true);
        try {
          const res = await fetch(
            typeof resource === 'function' ? resource(...args) : resource,
            options
          );
          if (res.ok) {
            setData(await res.json());
          } else {
            setError(new Error(`Fetch error ${res.status}!`));
          }
        } catch (fetchError) {
          setError(fetchError);
        }
        setIsLoading(false);
      })();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...args]);

    return { data, error, isLoading };
  };
}

export const useFetchCountries = makeFetchJSONHook('/api/countries');

export const useFetchCountryByCode = makeFetchJSONHook(
  (cca3) => `/api/countries/${encodeURIComponent(cca3)}`
);

export const useFetchRandomCountries = makeFetchJSONHook(
  (n) => `/api/countries/random?n=${encodeURIComponent(+n)}`
);
