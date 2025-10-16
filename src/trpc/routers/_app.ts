
import { inngest } from '@/inngest/client';
import {  createTRPCRouter, premiumProcedure, protectedProcedure } from '../init';
import { prisma } from '@/lib/db';
import { TRPCError } from '@trpc/server';


export const appRouter = createTRPCRouter({
  testAi: premiumProcedure.mutation( async () => {
 

await inngest.send({
  name: 'execute/ai',
});

return { success:true, message: 'AI executed successfully' }



  }),



  getUser: protectedProcedure.query(({ctx}) => {
    console.log(ctx.auth.user.name)
      return prisma.user.findMany({
        where:{
          id: ctx.auth.user.id
        }
      });
    }),
    getWorkFlows: protectedProcedure.query(({ctx}) => {
      return prisma.workfloww.findMany()
    }),
    createWorkflow: protectedProcedure.mutation( async ({ctx}) => {

      await inngest.send({
        name: 'test/hello.world',
        data:{
          email: ctx.auth.user.email
        }
      })
      return {
        success:true,
        message: 'Workflow created successfully'
      }
    })

});
// export type definition of API
export type AppRouter = typeof appRouter;