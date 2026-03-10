import { NodeType } from "@/generated/prisma";
import { NodeExecutor } from "../../types";
import { manualTriggerExecutor } from "@/components/features/triggers/components/manual-trigger/executor";
import { httpRequestExecutor } from "../http-request/executor";

export const executersRegistry: Record<NodeType, NodeExecutor> = {
    [NodeType.MANUAL_TRIGGER]:manualTriggerExecutor, // calls the manual trigger executor
    [NodeType.HTTP_REQUEST]: httpRequestExecutor as NodeExecutor, // typed as generic executor
    INITIAL: async ({context}) => context, // placeholder
 

};

export const getExecuter = (type: NodeType): NodeExecutor => {
    const executor = executersRegistry[type];
   if(!executor) {
    throw new Error(`No executor found for node type: ${type}`);
   }
   return executor;
}