import { readFileSync, writeFileSync } from 'node:fs';
import nodePath from 'node:path';

const DB_PATH = nodePath.join(process.cwd(), 'data', 'db', 'data.json');

export class ApiError extends Error {
  constructor(message, options = {}) {
    super(message);
    this.name = this.constructor.name;
    this.status = options.status ?? 500;
  }
}

/** Wraps a request handler, turning thrown errors into JSON error responses.
 */
export function apiHandler(handler) {
  return async (request, params) => {
    try {
      return await handler(request, params);
    } catch (error) {
      return Response.json(
        { error: error.message },
        { status: error.status ?? 500 },
      );
    }
  };
}

/** Parses the JSON body of the request, failing with a 400 if it is invalid.
 */
export async function requestBody(request) {
  try {
    return await request.json();
  } catch {
    throw new ApiError('Invalid JSON body', { status: 400 });
  }
}

/** Perform a data operation on the JSON file database. The data is read on
 * every call and passed whole to `dataOp`. It is written back only if
 * `options.write` is true.
 */
export function performDataOp(dataOp, options = {}) {
  const data = JSON.parse(readFileSync(DB_PATH, 'utf-8'));
  const result = dataOp(data);
  if (options.write) {
    writeFileSync(DB_PATH, JSON.stringify(data, null, 2) + '\n');
  }
  return result;
}
