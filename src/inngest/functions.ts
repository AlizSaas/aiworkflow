import { inngest } from "@/inngest/client";
import { prisma } from "@/lib/db";


import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { NonRetriableError } from "inngest";
import { topologicalSort } from "./utils";
import { NodeType } from "@/generated/prisma";
import { getExecuter } from "@/components/features/executions/components/lib/executor-registry";
import { httpRequestChannel, } from "./channels/http-request";
import { manualTriggerChannel } from "./channels/manual-trigger";

export const executeWorkFlow = inngest.createFunction(
  { id: "execute-workflow",retries:1 },
  { event: "workflow/execute.workflow", channel:[httpRequestChannel(),manualTriggerChannel()] },
  
  async ({ event, step,publish,}) => {
    const workflowId = event.data.workflowId;

    if(!workflowId) {
      throw new NonRetriableError("No workflow ID provided");
    }






const sortedNodes  = await step.run('prepare-workflow' , async () => {
  const workflow = await prisma.workflow.findUniqueOrThrow({
    where:{
      id: workflowId},
      include:{
        nodes:true,
        connections:true
      }
  })
  return topologicalSort(workflow.nodes,workflow.connections);


})


//initialize context 
let context  = event.data.initialData || {}

// execute each node 

for(const node of sortedNodes) {
  const executer  = getExecuter(node.type as NodeType) // gets the type of node\
   console.log("🚀 Running node:", node.name, "with data:", node.data);

   context  = await executer({
    data:node.data as Record<string, unknown>,
    nodeId: node.id,
    context,
    step,
    publish
  })
}

return {
  workflowId,
  result:context
} // why return as object? 




   


  
  },
);