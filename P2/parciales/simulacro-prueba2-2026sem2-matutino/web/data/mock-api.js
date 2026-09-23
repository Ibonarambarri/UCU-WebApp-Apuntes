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
        const url = new URL(req.url, `http://${req.headers.host}`);
        for (const { route, handler } of routes) {
          const routeMatch = route.exec(`${req.method} ${url.pathname}`);
          if (!routeMatch) continue;
          const params = routeMatch.groups || {};
          const query = Object.fromEntries(url.searchParams.entries());
          req.setEncoding('utf8');
          const chunks = [];
          req.on('data', (chunk) => chunks.push(chunk));
          req.on('end', () => {
            res.setHeader('Content-Type', 'application/json');
            let body;
            if (chunks.length) {
              try {
                body = JSON.parse(chunks.join(''));
              } catch {
                res.statusCode = 400;
                return res.end(JSON.stringify({ error: 'Invalid JSON body' }));
              }
            }
            try {
              const result = handler({ db, params, query, body });
              return res.end(JSON.stringify(result ?? null));
            } catch (error) {
              res.statusCode = error.status ?? 500;
              return res.end(JSON.stringify(error.payload ?? { error: error.message }));
            }
          });
          return;
        }
        next();
      });
    },
  };
}
