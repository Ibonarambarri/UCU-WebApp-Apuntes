import { useEffect, useState } from 'react';

let manifestPromise = null;
let manifestCache = null;

export function loadManifest() {
  if (!manifestPromise) {
    manifestPromise = fetch('/data/manifest.json')
      .then((r) => {
        if (!r.ok) throw new Error('Falta public/data/manifest.json — corré "npm run build-index"');
        return r.json();
      })
      .then((m) => {
        m.byId = new Map(m.docs.map((d) => [d.id, d]));
        manifestCache = m;
        return m;
      });
  }
  return manifestPromise;
}

export function useManifest() {
  const [m, setM] = useState(manifestCache);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (!m) loadManifest().then(setM, (e) => setError(e.message));
  }, [m]);
  return { manifest: m, error };
}
