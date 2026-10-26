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

export const useFetchGroups = makeFetchJSONHook("/api/groups");

export const useFetchGroupByLetter = makeFetchJSONHook(
  (letter) => `/api/groups/${encodeURIComponent(letter)}`,
);

export const useFetchTeams = makeFetchJSONHook("/api/teams");

export const useFetchTeamByCode = makeFetchJSONHook(
  (code) => `/api/teams/${encodeURIComponent(code)}`,
);

