import { useSyncExternalStore } from 'react';

// Router mínimo basado en el hash:  #/doc/<id>?h=<heading>&n=<ocurrencia>  |  #/buscar?q=...
function parse() {
  const raw = window.location.hash.replace(/^#/, '') || '/';
  const qi = raw.indexOf('?');
  const path = decodeURI(qi >= 0 ? raw.slice(0, qi) : raw);
  const params = new URLSearchParams(qi >= 0 ? raw.slice(qi + 1) : '');
  return { path, params, raw };
}

let current = parse();
const listeners = new Set();
window.addEventListener('hashchange', () => {
  current = parse();
  listeners.forEach((l) => l());
});

export function useHashLocation() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => current
  );
}

export function navigate(to, { replace = false } = {}) {
  const url = '#' + to;
  if (replace) {
    history.replaceState(null, '', url);
    current = parse();
    listeners.forEach((l) => l());
  } else window.location.hash = to;
}

export function docHref(id, { h, n, q } = {}) {
  const p = new URLSearchParams();
  if (h) p.set('h', h);
  if (n) p.set('n', String(n));
  if (q) p.set('q', q);
  const qs = p.toString();
  return `#/doc/${id}${qs ? '?' + qs : ''}`;
}
