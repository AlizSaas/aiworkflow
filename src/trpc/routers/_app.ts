
import { createTRPCRouter } from '../init';
import { workflowsRouter } from '@/components/features/workflows/server/router';
import { executionsRouter } from '@/components/features/executions/server/router';
import { credentialsRouter } from '@/components/features/credentials/server/router';
import { webhooksRouter } from '@/components/features/webhooks/server/router';


export const appRouter = createTRPCRouter({
  workflows: workflowsRouter,
  executions: executionsRouter,
  credentials: credentialsRouter,
  webhooks: webhooksRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;