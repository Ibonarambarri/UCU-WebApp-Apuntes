import { useEffect, useState } from "react";

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
            options,
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

export const useFetchCountries = makeFetchJSONHook("/api/countries");

export const useFetchCountryByCode = makeFetchJSONHook(
  (cca3) => `/api/countries/${encodeURIComponent(cca3)}`,
);

export const useFetchRandomCountries = makeFetchJSONHook(
  (n) => `/api/countries/random?n=${encodeURIComponent(+n)}`,
);