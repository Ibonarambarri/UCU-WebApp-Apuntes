import { StatusError } from 'expo-server';
import data from '../data.json';

export async function GET(req, { cca3 }) {
  let country;
  if (/[a-zA-Z]{3}/.test(cca3)) {
    country = data.countries[cca3.toUpperCase()];
  }
  if (cca3 === 'random') {
    const n = new URL(req.url).searchParams.get('n') || 4;
    country = Object.keys(data.countries)
      .sort(() => Math.random() - 0.5)
      .slice(0, n);
  }
  if (!country) {
    throw new StatusError(404, `Country ${cca3} not found!`);
  }
  return Response.json(country);
}
