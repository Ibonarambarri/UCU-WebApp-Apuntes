import { ApiError } from './mock-api';

const ROUTES = [
  {
    route: /^GET \/api\/countries\/?$/,
    handler: ({ db, query }) => {
      const countries = Object.entries(db.data.countries)
        .filter(([, country]) => {
          return (!query.currency || country.currencies[query.currency])
            && (!query.language || country.languages[query.language])
            && (!query.timezone || country.timezones.includes(query.timezone));
        })
        .map(([cca3]) => cca3);
      return countries.sort((a, b) => a.localeCompare(b));
    }
  },
  {
    route: /^GET \/api\/countries\/(?<cca3>[A-Z]{3})$/,
    handler: ({ db, params: { cca3 } }) => {
      const country = db.data.countries[cca3];
      if (!country) {
        throw new ApiError(`Country ${cca3} not found!`, { status: 404 });
      }
      return country;
    }
  },
  {
    route: /^GET \/api\/currencies\/?$/,
    handler: ({ db }) => {
      const countries = Object.values(db.data.countries);
      const currencyMap = new Map();
      countries.forEach(country => {
        Object.entries(country.currencies).forEach(([code, currency]) => {
          currencyMap.set(code, { code, ...currency });
        });
      });
      return Array.from(currencyMap.values()).sort((a, b) => a.code.localeCompare(b.code));
    },
  },
  {
    route: /^GET \/api\/languages\/?$/,
    handler: ({ db }) => {
      const countries = Object.values(db.data.countries);
      const languageMap = new Map();
      countries.forEach(country => {
        Object.entries(country.languages).forEach(([code, name]) => {
          languageMap.set(code, { code, name });
        });
      });
      return Array.from(languageMap.values()).sort((a, b) => a.code.localeCompare(b.code));
    },
  },
  {
    route: /^GET \/api\/timezones\/?$/,
    handler: ({ db }) => {
      const countries = Object.values(db.data.countries);
      const timezoneMap = new Set(countries.flatMap(country => country.timezones));
      return Array.from(timezoneMap).sort((a, b) => a.localeCompare(b));
    },
  },
];

export default ROUTES;
