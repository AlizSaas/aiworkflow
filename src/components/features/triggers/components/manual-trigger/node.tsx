'use client';

import { NodeProps } from "@xyflow/react";
import { memo } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { MousePointerIcon } from "lucide-react";

export const ManualTriggerNode = memo((props:NodeProps) => {

    return (
        <>
        <BaseTriggerNode
        {...props}
        icon={MousePointerIcon}
        // status={nodeStatus}
        name="When clicking 'Execute workflow"
        
        
        />
        
        </>
    )
})

ManualTriggerNode.displayName = 'ManualTriggerNode';