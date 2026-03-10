import { inngest } from "@/inngest/client";
import { prisma } from "@/lib/db";
import { ExecutionStatus, Prisma } from "@/generated/prisma";
import { NonRetriableError } from "inngest";
import { topologicalSort } from "./utils";
import { NodeType } from "@/generated/prisma";
import { getExecuter } from "@/components/features/executions/components/lib/executor-registry";
import { httpRequestChannel, } from "./channels/http-request";
import { manualTriggerChannel } from "./channels/manual-trigger";

export const executeWorkFlow = inngest.createFunction(
  { id: "execute-workflow",retries:1 },
  { event: "workflow/execute.workflow", channel:[httpRequestChannel(),manualTriggerChannel()] },
  
  async ({ event, step, publish }) => {
    const workflowId = event.data.workflowId;

    if(!workflowId) {
      throw new NonRetriableError("No workflow ID provided");
    }

    const sortedNodes = await step.run('prepare-workflow', async () => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: { id: workflowId },
        include: { nodes: true, connections: true },
      });
      return topologicalSort(workflow.nodes, workflow.connections);
    });

    // Create an execution record
    const execution = await step.run('create-execution', async () => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: { id: workflowId },
        select: { userId: true },
      });
      return prisma.workflowExecution.create({
        data: {
          workflowId,
          userId: workflow.userId,
          status: ExecutionStatus.RUNNING,
        },
      });
    });

    // initialize context
    let context = event.data.initialData || {};

    // execute each node
    for(const node of sortedNodes) {
      const executer = getExecuter(node.type as NodeType);
      console.log("🚀 Running node:", node.name, "with data:", node.data);

      const logStartedAt = new Date();
      let nodeStatus: ExecutionStatus = ExecutionStatus.COMPLETED;
      let nodeOutput: unknown = undefined;

      try {
        context = await executer({
          data: node.data as Record<string, unknown>,
          nodeId: node.id,
          context,
          step,
          publish,
        });
        nodeOutput = context;
      } catch (error) {
        nodeStatus = ExecutionStatus.FAILED;
        await step.run(`log-node-error-${node.id}`, async () => {
          await prisma.executionLog.create({
            data: {
              executionId: execution.id,
              nodeId: node.id,
              nodeName: node.name,
              status: nodeStatus,
              startedAt: logStartedAt,
              completedAt: new Date(),
            },
          });
          await prisma.workflowExecution.update({
            where: { id: execution.id },
            data: { status: ExecutionStatus.FAILED, completedAt: new Date() },
          });
        });
        throw error;
      }

      await step.run(`log-node-${node.id}`, async () => {
        await prisma.executionLog.create({
          data: {
            executionId: execution.id,
            nodeId: node.id,
            nodeName: node.name,
            status: nodeStatus,
            startedAt: logStartedAt,
            completedAt: new Date(),
            output: nodeOutput as Prisma.InputJsonValue,
          },
        });
      });
    }

    await step.run('complete-execution', async () => {
      await prisma.workflowExecution.update({
        where: { id: execution.id },
        data: {
          status: ExecutionStatus.COMPLETED,
          completedAt: new Date(),
          result: context as Prisma.InputJsonValue,
        },
      });
    });

    return {
      workflowId,
      executionId: execution.id,
      result: context,
    };
  },
);
