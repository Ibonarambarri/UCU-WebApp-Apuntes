import { StatusError } from 'expo-server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const DB_PATH = join(process.cwd(), 'app/api/worldcup.json');

function readDB() {
  return JSON.parse(readFileSync(DB_PATH, 'utf-8'));
}

function writeDB(db) {
  writeFileSync(DB_PATH, JSON.stringify(db, null, 4));
}

export async function GET(_req, { code }) {
  const db = readDB();
  let team;
  if (/[a-zA-Z]{3}/.test(code)) {
    team = db.data.find((t) => t.code === code.toUpperCase());
  }
  if (!team) {
    throw new StatusError(404, `Team ${code} not found!`);
  }
  return Response.json({ stickers: Array(20).fill(false), ...team });
}

export async function PATCH(req, { code }) {
  const db = readDB();
  let teamIndex = -1;
  if (/[a-zA-Z]{3}/.test(code)) {
    teamIndex = db.data.findIndex((t) => t.code === code.toUpperCase());
  }
  if (teamIndex === -1) {
    throw new StatusError(404, `Team ${code} not found!`);
  }
  const { stickers, ...others } = await req.json();
  if (Object.keys(others).length > 0) {
    throw new StatusError(400, 'Only stickers can be updated!');
  }
  if (!Array.isArray(stickers)
    || stickers.length !== 20
    || stickers.some((s) => typeof s !== 'boolean')
  ) {
    throw new StatusError(400, 'Stickers must be an array of 20 booleans!');
  }
  db.data[teamIndex] = { ...db.data[teamIndex], stickers };
  writeDB(db);
  return Response.json(db.data[teamIndex]);
}
