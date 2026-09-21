import nodePath from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSONFileSyncPreset } from 'lowdb/node';

const __dirname = nodePath.dirname(fileURLToPath(import.meta.url));

export class ApiError extends Error {
  constructor(message, options = {}) {
    super(message);
    if (Error.captureStackTrace) Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.status = options.status ?? 500;
    this.payload = options.payload ?? null;
  }
}

export default function mockApi(config) {
  const { routes, dbPath } = {
    dbPath: './db/data.json',
    ...config
  };
  return {
    name: 'mock-api',
    configureServer(server) {
      const db = JSONFileSyncPreset(nodePath.join(__dirname, dbPath), {});

      server.middlewares.use((req, res, next) => {
        for (const { route, handler } of routes) {
          const routeMatch = route.exec(`${req.method} ${req.url}`);
          if (routeMatch) {
            res.setHeader('Content-Type', 'application/json');
            const params = routeMatch.groups || {};
            try {
              const result = handler({ db, params });              
              return res.end(JSON.stringify(result));
            } catch (error) {
              res.statusCode = error.status ?? 500;
              return res.end(JSON.stringify(error.payload ?? { error: error.message }));
            }
          }
        }
        next();
      });
    },
  };
}
