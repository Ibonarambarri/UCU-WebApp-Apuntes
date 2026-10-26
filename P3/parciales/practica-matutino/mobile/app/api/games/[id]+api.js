import { apiHandler, performDataOp } from '@/data/mock-db';
import { deleteGame, findGame, gameView } from '@/data/games';

export const GET = apiHandler((_request, { id }) => {
  return Response.json(performDataOp((data) => gameView(data, findGame(data, id))));
});

export const DELETE = apiHandler((_request, { id }) => {
  return Response.json(performDataOp((data) => deleteGame(data, id), { write: true }));
});
