import { ApiError } from './mock-api';

const ROUTES = [
  {
    route: /^GET \/api\/countries\/?$/,
    handler: ({ db }) => {
      return Object.keys(db.data.countries);
    },
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
];

export default ROUTES;
