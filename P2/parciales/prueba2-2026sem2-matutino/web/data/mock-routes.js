import { ApiError } from './mock-api';

/** Campos que se devuelven en el listado de países. El detalle de cada país
 * incluye además husos horarios, dominio de primer nivel y demás.
 */
const LIST_FIELDS = [
  'code', 'name', 'flag', 'capital', 'region', 'subregion', 'population', 'area',
  'languages', 'currencies',
];

/** Busca un país por su código alpha-3 (`URY`, `ARG`, …), sin distinguir
 * mayúsculas de minúsculas.
 */
function findCountry(db, code) {
  const country = db.data.countries.find(
    (c) => c.code === String(code).toUpperCase(),
  );
  if (!country) {
    throw new ApiError(`Country ${code} not found`, { status: 404 });
  }
  return country;
}

/** Agrupa los idiomas (o las monedas) de todos los países por su código, con
 * la cantidad de países que los usan. El dataset tiene variantes del mismo
 * código (`français` y `Français`), así que gana la primera aparición.
 */
function groupByCode(db, field) {
  const byCode = new Map();
  for (const country of db.data.countries) {
    for (const value of country[field]) {
      const group = byCode.get(value.code);
      if (group) {
        group.countries += 1;
      } else {
        byCode.set(value.code, { ...value, countries: 1 });
      }
    }
  }
  return byCode;
}

// Each route matches `<METHOD> <pathname>` with a regex; named capture
// groups are passed to the handler as `params`. See mock-api.js.
const ROUTES = [
  {
    route: /^GET \/api\/countries\/?$/,
    handler: ({ db }) => db.data.countries.map(
      (country) => Object.fromEntries(LIST_FIELDS.map((field) => [field, country[field]])),
    ),
  },
  {
    // Antes de `/api/countries/:code`, porque `random` no es un código de país.
    route: /^GET \/api\/countries\/random\/?$/,
    handler: ({ db }) => db.data.countries[
      Math.floor(Math.random() * db.data.countries.length)
    ],
  },
  {
    route: /^GET \/api\/countries\/(?<code>[^/]+)\/?$/,
    handler: ({ db, params }) => findCountry(db, params.code),
  },
  {
    route: /^GET \/api\/regions\/?$/,
    handler: ({ db }) => [
      ...new Set(db.data.countries.map(({ region }) => region).filter(Boolean)),
    ].sort(),
  },
  {
    route: /^GET \/api\/languages\/?$/,
    handler: ({ db }) => [...groupByCode(db, 'languages').values()]
      .sort((a, b) => a.name.localeCompare(b.name)),
  },
  {
    route: /^GET \/api\/currencies\/?$/,
    handler: ({ db }) => [...groupByCode(db, 'currencies').values()]
      .sort((a, b) => a.code.localeCompare(b.code)),
  },
  {
    route: /^GET \/api\/favorites\/?$/,
    handler: ({ db }) => db.data.favorites,
  },
  {
    route: /^PUT \/api\/favorites\/?$/,
    handler: ({ db, body }) => {
      if (typeof body?.code !== 'string') {
        throw new ApiError(`Missing country code`, { status: 400 });
      }
      const { code } = findCountry(db, body.code);
      const existing = db.data.favorites.find((f) => f.code === code);
      if (existing) {
        return existing;
      }
      const favorite = { code, date: new Date().toISOString() };
      db.data.favorites.push(favorite);
      db.write();
      return favorite;
    },
  },
  {
    route: /^DELETE \/api\/favorites\/(?<code>[^/]+)\/?$/,
    handler: ({ db, params }) => {
      const code = String(params.code).toUpperCase();
      const favorite = db.data.favorites.find((f) => f.code === code);
      if (!favorite) {
        throw new ApiError(`Favorite ${params.code} not found`, { status: 404 });
      }
      db.data.favorites.splice(db.data.favorites.indexOf(favorite), 1);
      db.write();
      return favorite;
    },
  },
];

export default ROUTES;
