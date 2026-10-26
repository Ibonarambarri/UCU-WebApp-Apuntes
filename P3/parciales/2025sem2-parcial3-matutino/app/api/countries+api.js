import data from './data.json';

export function GET(_request) {
  return Response.json(Object.keys(data.countries));
}
