import { useCallback, useEffect, useState } from 'react';
import { fetchJSON } from '@/common/fetch';

const OPTION_COUNT = 9;

/** Arma UNA jugada de la trivia pidiéndole datos a la API.
 *
 * 1. `GET /api/countries/random?n=9` → 9 códigos al azar (ya vienen en orden
 *    aleatorio, así que las posiciones de las banderas también son al azar).
 * 2. `GET /api/countries/:cca3` de los 9 a la vez con `Promise.all` → nombre
 *    y capital de cada uno (los necesitamos para el mensaje "no es capital de X").
 * 3. Elegimos al azar cuál es la respuesta correcta, pero SOLO entre los que
 *    tienen capital (ATA, BVT, HMD y MAC vienen con `capital: []`).
 *
 * Cada vez que cambia `roundNumber` se arma una jugada nueva.
 * Devuelve { data: { options, answer, capital }, isLoading, error, refetch }.
 */
export function useTriviaRound(roundNumber) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadIndex, setReloadIndex] = useState(0);

  useEffect(() => {
    let ignore = false;
    (async () => {
      setIsLoading(true);
      setError(null);
      setData(null);
      try {
        const codes = await fetchJSON(`/api/countries/random?n=${OPTION_COUNT}`);
        // Promise.all espera a que terminen TODOS los pedidos (van en paralelo).
        const countries = await Promise.all(
          codes.map((code) => fetchJSON(`/api/countries/${encodeURIComponent(code)}`)),
        );
        // Nos quedamos sólo con lo que usamos de cada país.
        const options = countries.map((country) => ({
          cca3: country.cca3,
          name: country.name.common,
          capitals: country.capital ?? [],
        }));
        const withCapital = options.filter((option) => option.capitals.length > 0);
        if (withCapital.length === 0) {
          // Rarísimo (los 9 sin capital), pero mejor contemplarlo.
          throw new Error('Ningún país de la jugada tiene capital');
        }
        const answer = withCapital[Math.floor(Math.random() * withCapital.length)];
        if (!ignore) {
          // Si tiene varias capitales (ej. Sudáfrica) mostramos la primera.
          setData({ options, answer, capital: answer.capitals[0] });
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
    return () => {
      ignore = true;
    };
  }, [roundNumber, reloadIndex]);

  const refetch = useCallback(() => setReloadIndex((index) => index + 1), []);

  return { data, isLoading, error, refetch };
}
