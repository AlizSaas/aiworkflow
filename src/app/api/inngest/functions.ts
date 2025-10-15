import { inngest } from "@/inngest/client";
import { prisma } from "@/lib/db";


export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    await step.sleep("wait-another-moment", "2s");
    await step.sleep("wait-yet-another-moment", "3s");
    await step.run('create work flow',  () => {
     return  prisma.workfloww.create({
        data: {
          name: "My first workflow with inngest lol",
        }
      })

      })
    
    return { message: `Hello ${event.data.email}!` };
  },
);