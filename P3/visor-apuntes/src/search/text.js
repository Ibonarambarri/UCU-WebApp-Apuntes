// Utilidades de texto compartidas entre el build (Node) y el Web Worker del buscador.
// IMPORTANTE: el índice se construye con estas mismas funciones, así que si se cambian
// hay que volver a correr `npm run build-index`.

export function stripAccents(s) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '');
}

export function normalize(s) {
  return stripAccents(String(s).toLowerCase());
}

/** Clave para comparar headings: minúsculas, sin tildes, solo letras y números. */
export function headingKey(s) {
  return normalize(s).replace(/[^a-z0-9]+/g, '');
}

/** Slug estilo GitHub para ids de headings. */
export function slugify(s) {
  return normalize(s)
    .replace(/[^a-z0-9\s_-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

const STOP = new Set(
  (
    // inglés
    'a an and are as at be but by for from has have if in into is it its of on or that the their then there these this to was were will with ' +
    // español
    'al algo como con cual cuando de del el ella en entre era es esa ese eso esta este esto hace hacer hago la las le lo los mas me mi muy no o otra otro para pero por porque que se si sin sobre su sus tambien te tiene todo tu un una uno unos unas y ya yo quiero puedo hay cosa cosas'
  ).split(/\s+/)
);

export function isStopWord(t) {
  return STOP.has(t);
}

const WORD_RE = /[\p{L}\p{N}_$]+/gu;

/** Separa un identificador camelCase en partes: useSearchParams → [use, Search, Params]. */
function camelParts(tok) {
  return tok
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .split(/[\s_]+/)
    .filter(Boolean);
}

/**
 * Tokenizador del ÍNDICE: además del token completo agrega las partes camelCase y los
 * "sufijos" (useSearchParams → usesearchparams, searchparams, params, use, search).
 */
export function tokenizeIndex(text) {
  const out = [];
  const words = String(text).match(WORD_RE) || [];
  for (const w of words) {
    out.push(w);
    const parts = camelParts(w);
    if (parts.length > 1) {
      for (let i = 0; i < parts.length; i++) {
        out.push(parts[i]);
        if (i > 0 && i < parts.length - 1) out.push(parts.slice(i).join(''));
      }
    }
  }
  return out;
}

/** Tokenizador de CONSULTAS: solo tokens completos. */
export function tokenizeQuery(text) {
  return String(text).match(WORD_RE) || [];
}

/** processTerm común: minúsculas, sin tildes, descarta stopwords y tokens de 1 letra. */
export function processTerm(term) {
  const t = normalize(term);
  if (t.length < 2 || t.length > 40) return null;
  if (STOP.has(t)) return null;
  return t;
}

export const SECTIONS = [
  { key: 'notas', label: 'Mis apuntes (P3)', short: 'Mis apuntes', boost: 2 },
  { key: 'rn', label: 'React Native', short: 'RN', boost: 1.5 },
  { key: 'expo-router', label: 'Expo Router', short: 'Expo Router', boost: 1.5 },
  { key: 'expo-api', label: 'Expo API (SDK 58)', short: 'Expo API', boost: 1.3 },
  { key: 'expo', label: 'Expo (SDK 58 y guías)', short: 'Expo', boost: 1.1 },
  { key: 'async-storage', label: 'AsyncStorage v2', short: 'AsyncStorage', boost: 1.3 },
  { key: 'p2', label: 'React (P2) · apuntes', short: 'Apuntes P2', boost: 1.3 },
  { key: 'react', label: 'React (P2) · docs', short: 'React', boost: 1 },
];

export const SECTION_BY_KEY = Object.fromEntries(SECTIONS.map((s) => [s.key, s]));
