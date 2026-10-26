import { apiHandler, performDataOp, requestBody } from '@/data/mock-db';
import { guess } from '@/data/games';

export const POST = apiHandler(async (request, { id }) => {
  const body = await requestBody(request);
  return Response.json(performDataOp((data) => guess(data, id, body), { write: true }));
});
