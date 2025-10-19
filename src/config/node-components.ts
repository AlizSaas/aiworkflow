import { HttpRequestNode } from "@/components/features/executions/components/http-request/node";
import { ManualTriggerNode } from "@/components/features/triggers/components/manual-trigger/node";
import { InitialNode } from "@/components/initial-node";
import { NodeType } from "@/generated/prisma";
import type  { NodeTypes } from "@xyflow/react";

export const nodeComponents = {
    [NodeType.INITIAL]: InitialNode,   // Placeholder for other node types
  
    [NodeType.HTTP_REQUEST]: HttpRequestNode,
      [NodeType.MANUAL_TRIGGER]: ManualTriggerNode,

} as const satisfies NodeTypes

export type RegisteredNodeType = keyof typeof nodeComponents