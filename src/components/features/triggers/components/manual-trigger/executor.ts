import type { NodeExecutor } from "@/components/features/executions/types";
import { manualTriggerChannel } from "@/inngest/channels/manual-trigger";
type ManualTriggerData  = Record<string, unknown>;

export const manualTriggerExecutor: NodeExecutor<ManualTriggerData> = async ({context,nodeId,step,publish}) => {

    await publish(
        manualTriggerChannel().status({
            nodeId,
            status: 'loading'
        })
    )

const result  = await step.run("Manual-trigger", async () => context)
await publish(
    manualTriggerChannel().status({
        nodeId,
        status: 'success'
    })
)
return result;
}