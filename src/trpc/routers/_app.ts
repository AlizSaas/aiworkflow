
import { baseProcedure, createTRPCRouter } from '../init';
import { prisma } from '@/lib/db';
export const appRouter = createTRPCRouter({
  getTest: baseProcedure // This is a procedure for the test endpoint
   
    .query(() => {
      return prisma.test.findMany();
    }), // A query procedure that fetches all records from the 'test' table
});
// export type definition of API
export type AppRouter = typeof appRouter;