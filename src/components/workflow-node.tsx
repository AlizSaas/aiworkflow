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
/**
 * Renders a workflow node that can show optional top toolbar actions and a bottom caption.
 *
 * @param children - Content to render inside the node.
 * @param showToolbar - When `true`, displays the top toolbar with settings and delete actions.
 * @param onDelete - Callback invoked when the delete action is clicked.
 * @param onSettings - Callback invoked when the settings action is clicked.
 * @param name - Optional caption text displayed in a bottom toolbar.
 * @param description - Optional secondary text shown under the `name`.
 * @returns The rendered workflow node element.
 */
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