
import { inngest } from '@/inngest/client';
import {  createTRPCRouter, protectedProcedure } from '../init';
import { prisma } from '@/lib/db';
<<<<<<< Updated upstream

=======
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
>>>>>>> Stashed changes
export const appRouter = createTRPCRouter({
  testAi: protectedProcedure.mutation( async () => {

const { text } = await generateText({
  model: openai('gpt-4.1'),
  prompt: 'Write a short describtion about  cbr honda bikes.',
});

return text;

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