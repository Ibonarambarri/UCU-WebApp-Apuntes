import { apiHandler, performDataOp } from '@/data/mock-db';
import { ranking } from '@/data/games';

export const GET = apiHandler(() => {
  return Response.json(performDataOp(ranking));
});
