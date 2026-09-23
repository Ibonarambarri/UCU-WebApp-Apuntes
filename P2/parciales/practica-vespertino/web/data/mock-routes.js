import { ApiError } from './mock-api';

/** Perform a data operation.
 */
function performDataOp(db, entity, id, dataOp) {
  const list = db.data[entity];
  if (!list) {
    throw new ApiError(`${entity} not found`, { status: 404 });
  }
  const item = id ? list.find((i) => i.id === id) : undefined;
  if (id && !item) {
    throw new ApiError(`${entity} item not found`, { status: 404 });
  }
  if (typeof dataOp === 'function') {
    const result = dataOp(
      list, item, id ?? `${list.reduce((newId, { id }) => Math.max(newId, +id), 0) + 1}`,
    );
    if (result) {
      db.write();
    }
    return result;
  } else if (dataOp === undefined) {
    return item ?? list;
  }
  throw new ApiError(`Unknown data operation`, { status: 500 });
}

// Each route matches `<METHOD> <pathname>` with a regex; named capture
// groups are passed to the handler as `params`. See mock-api.js.
const ROUTES = [
  {
    route: /^GET \/api\/players\/?$/,
    handler: ({ db }) => performDataOp(db, 'players'),
  },
  {
    route: /^GET \/api\/players\/(?<id>[^/]+)\/matches\/?$/,
    handler: ({ db, params }) => {
      performDataOp(db, 'players', params.id);
      return db.data.matches.filter(
        (match) => match.playerX === params.id || match.playerO === params.id,
      );
    },
  },
  {
    route: /^GET \/api\/players\/(?<id>[^/]+)\/?$/,
    handler: ({ db, params }) => performDataOp(db, 'players', params.id),
  },
  {
    route: /^PUT \/api\/players\/?$/,
    handler: ({ db, body }) => {
      return performDataOp(db, 'players', undefined, (list, _item, id) => {
        if (typeof body?.name !== 'string' || !body.name.trim()) {
          throw new ApiError(`Invalid player`, { status: 400 });
        }
        const item = { id, name: body.name };
        list.push(item);
        return item;
      });
    },
  },
  {
    route: /^GET \/api\/matches\/?$/,
    handler: ({ db }) => performDataOp(db, 'matches'),
  },
  {
    route: /^PUT \/api\/matches\/?$/,
    handler: ({ db, body }) => {
      return performDataOp(db, 'matches', undefined, (list, _item, id) => {
        const players = db.data.players;
        if (
          !players.some((player) => player.id === body?.playerX)
          || !players.some((player) => player.id === body?.playerO)
          || !Array.isArray(body?.history)
          || !['X', 'O', null].includes(body?.winner ?? null)
        ) {
          throw new ApiError(`Invalid match`, { status: 400 });
        }
        const item = {
          id, playerX: body.playerX, playerO: body.playerO, history: body.history, winner: body.winner ?? null,
        };
        list.push(item);
        return item;
      });
    },
  },
];

export default ROUTES;
