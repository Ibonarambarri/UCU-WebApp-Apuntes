import { ApiError } from './mock-db';

/** Respuestas válidas para `POST /api/games/:id/guess`. */
export const GUESSES = ['higher', 'lower'];

/** Tipos de pregunta: se sortea uno en cada ronda. */
const STATS = ['population', 'area'];

/** Cantidad de partidas que devuelve el ranking. */
const RANKING_SIZE = 10;

function findCountry(data, code) {
  const country = data.countries.find((c) => c.code === code);
  if (!country) {
    throw new ApiError(`Country ${code} not found`, { status: 404 });
  }
  return country;
}

/** Lo que se muestra de un país en el juego. La población y la superficie
 * del país siguiente quedan ocultas mientras la partida está en curso, para
 * que no se pueda ver la respuesta en las herramientas de red.
 */
function gameCountry(data, code, withValues) {
  const { name, flag, population, area } = findCountry(data, code);
  const country = { code, name, flag, flagUrl: `/static/flags/${code}.png` };
  return withValues ? { ...country, population, area } : country;
}

export function findGame(data, id) {
  const game = data.games.find((g) => String(g.id) === String(id));
  if (!game) {
    throw new ApiError(`Game ${id} not found`, { status: 404 });
  }
  return game;
}

/** Sortea un país que todavía no salió en la partida, o `null` si no queda
 * ninguno. Los países sin superficie no participan del juego.
 */
function drawCountry(data, used) {
  const pool = data.countries.filter(
    (c) => c.area !== null && !used.includes(c.code),
  );
  if (!pool.length) return null;
  return pool[Math.floor(Math.random() * pool.length)].code;
}

function drawStat() {
  return STATS[Math.floor(Math.random() * STATS.length)];
}

/** Forma pública de una partida: los países se expanden y no se expone la
 * lista interna de países usados.
 */
export function gameView(data, game) {
  const playing = game.status === 'playing';
  return {
    id: game.id,
    player: game.player,
    status: game.status,
    score: game.score,
    stat: game.stat,
    current: gameCountry(data, game.current, true),
    next: game.next ? gameCountry(data, game.next, !playing) : null,
    createdAt: game.createdAt,
    finishedAt: game.finishedAt,
  };
}

export function ranking(data) {
  return data.games
    .filter((g) => g.status !== 'playing')
    .sort((a, b) => b.score - a.score || a.finishedAt.localeCompare(b.finishedAt))
    .slice(0, RANKING_SIZE)
    .map(({ id, player, score, finishedAt }) => ({ id, player, score, finishedAt }));
}

export function createGame(data, body) {
  const player = typeof body?.player === 'string' ? body.player.trim() : '';
  if (!player) {
    throw new ApiError(`Missing player name`, { status: 400 });
  }
  const current = drawCountry(data, []);
  const next = drawCountry(data, [current]);
  const game = {
    id: Math.max(0, ...data.games.map((g) => g.id)) + 1,
    player,
    status: 'playing',
    score: 0,
    stat: drawStat(),
    current,
    next,
    used: [current, next],
    createdAt: new Date().toISOString(),
    finishedAt: null,
  };
  data.games.push(game);
  return gameView(data, game);
}

export function guess(data, id, body) {
  const game = findGame(data, id);
  if (!GUESSES.includes(body?.guess)) {
    throw new ApiError(`Guess must be one of: ${GUESSES.join(', ')}`, { status: 400 });
  }
  if (game.status !== 'playing') {
    throw new ApiError(`Game ${game.id} is already over`, { status: 409 });
  }
  const current = findCountry(data, game.current);
  const next = findCountry(data, game.next);
  const { stat } = game;
  // Si los valores son iguales, cualquier respuesta es correcta.
  const correct = body.guess === 'higher'
    ? next[stat] >= current[stat]
    : next[stat] <= current[stat];
  const revealed = gameCountry(data, next.code, true);
  if (correct) {
    game.score += 1;
    game.current = next.code;
    game.next = drawCountry(data, game.used);
    if (game.next) {
      game.used.push(game.next);
      game.stat = drawStat();
    } else {
      game.status = 'won';
      game.finishedAt = new Date().toISOString();
    }
  } else {
    game.status = 'lost';
    game.finishedAt = new Date().toISOString();
  }
  return { guess: body.guess, stat, correct, revealed, game: gameView(data, game) };
}

export function deleteGame(data, id) {
  const game = findGame(data, id);
  data.games.splice(data.games.indexOf(game), 1);
  return gameView(data, game);
}
