import { StatusError } from 'expo-server';
import worldcup from '../worldcup.json';

export async function GET(req, { group }) {
  let team;
  if (/[A-Za-z]/.test(group)) {
    team = worldcup.data.filter((t) => t.group === group.toUpperCase());
  }
  if (!team || team.length === 0) {
    throw new StatusError(404, `Group ${group} not found!`);
  }
  return Response.json(team);
}
