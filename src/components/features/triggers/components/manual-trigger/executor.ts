import type { NodeExecutor } from "@/components/features/executions/types";
type ManualTriggerData  = Record<string, unknown>;

export const manualTriggerExecutor: NodeExecutor<ManualTriggerData> = async ({context,nodeId,step}) => {

const result  = await step.run("Manual-trigger", async () => context)
return result;
}