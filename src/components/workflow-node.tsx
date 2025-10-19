'use client'
import { NodeToolbar,Position } from "@xyflow/react"
import { SettingsIcon,TrashIcon } from "lucide-react"

import { ReactNode } from "react"
import { Button } from "./ui/button"

interface WorkflowNodeProps {
    children: ReactNode,
    showToolbar?: boolean,
    onDelete?: () => void,
    onSettings?: () => void,
    name?: string,
    description?: string,
}
export function WorkflowNode({ children, showToolbar=true, onDelete, onSettings, name, description }: WorkflowNodeProps) {
    return (
        <>
        {showToolbar && (
            <NodeToolbar>
                <Button size={'icon'} variant={'ghost'} onClick={onSettings} >
                    <SettingsIcon className="size-4" />

                </Button>
                <Button size={'icon'} variant={'ghost'} onClick={onDelete} >
                    <TrashIcon className="size-4" />

                </Button>


            </NodeToolbar>
        )}
        {children}
        {name && (
            <NodeToolbar position={Position.Bottom } isVisible className="max-w-[200px] text-center">
                <p className="font-medium">
                    {name}
                </p>
                {
                    description && (
                        <p className="text-xs text-muted-foreground truncate">
                            {description}
                        </p>
                    )
                }

            </NodeToolbar>
        )}
        
        </>

    )
}

// this component is used to wrap workflow nodes and provide a consistent toolbar UI