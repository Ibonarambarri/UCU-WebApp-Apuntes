import worldcup from './worldcup.json';

export function GET(_request) {
  const groups = [...new Set(worldcup.data.map((t) => t.group))].sort();
  return Response.json(groups);
}

