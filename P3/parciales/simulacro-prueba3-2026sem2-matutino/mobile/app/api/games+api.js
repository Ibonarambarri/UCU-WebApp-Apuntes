import { apiHandler, performDataOp, requestBody } from '@/data/mock-db';
import { createGame } from '@/data/games';

export const POST = apiHandler(async (request) => {
  const body = await requestBody(request);
  return Response.json(performDataOp((data) => createGame(data, body), { write: true }));
});
