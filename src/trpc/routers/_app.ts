
import { inngest } from '@/inngest/client';
import {  createTRPCRouter, premiumProcedure, protectedProcedure } from '../init';
import { prisma } from '@/lib/db';
import { TRPCError } from '@trpc/server';
import { workflowsRouter } from '@/components/features/workflows/server/router';


export const appRouter = createTRPCRouter({
  workflows: workflowsRouter,


});
// export type definition of API
export type AppRouter = typeof appRouter;