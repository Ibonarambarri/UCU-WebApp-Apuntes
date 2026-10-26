import worldcup from './worldcup.json';

export function GET(_request) {
  const teams = worldcup.data;
  return Response.json(teams);
}
