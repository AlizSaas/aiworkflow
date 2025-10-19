'use client'

import {createId} from '@paralleldrive/cuid2'
import {useReactFlow} from '@xyflow/react'
import { GlobeIcon,MousePointerIcon,WebhookIcon} from 'lucide-react'
import { useCallback } from 'react'
import { toast } from 'sonner'
import { Sheet,SheetClose,SheetContent,SheetDescription,SheetFooter,SheetHeader,SheetTitle,SheetTrigger } from './ui/sheet'
import { NodeType } from '@/generated/prisma'
import { Separator } from './ui/separator'


export type NodeTypeOption = {
    type: NodeType
    label: string
    desciription: string
    Icon: React.ComponentType<{className?: string}> | string

}

const triggerNodes: NodeTypeOption[] = [
    {
        type: NodeType.MANUAL_TRIGGER,
        label:'Trigger Manually',
        desciription:'Runs the flow on clicking a button. Good for getting started.',
        Icon: MousePointerIcon
    }
]

const executionNodes: NodeTypeOption[] = [
    {
        type: NodeType.HTTP_REQUEST,
        label:'HTTP Request',
        desciription:'Makes an HTTP request to a specified URL.',
        Icon: GlobeIcon
    }
]

interface NodeSelectorProps {
    open: boolean,
    onOpenChange: (open: boolean) => void,
    children: React.ReactNode
}

export function NodeSelector({open,onOpenChange,children}:NodeSelectorProps) {
    const {setNodes,screenToFlowPosition,getNodes} = useReactFlow()
    const handleNodeSelect =  useCallback((selection:NodeTypeOption) => {
        if(selection.type === NodeType.MANUAL_TRIGGER) {
            const nodes = getNodes() // get current nodes
            const hasManultrigger = nodes.some((node) => node.type === NodeType.MANUAL_TRIGGER) // only one manual trigger allowed
            if(hasManultrigger) {
                toast.error(' only one manual trigger node is allowed per workflow')
                return
            } // if manual trigger already exists, show error

        }

        setNodes((nodes) => {
            const hasInitialNode = nodes.some((node) => node.type === NodeType.INITIAL) // only one initial node allowed
            const centerX = window.innerWidth / 2 // get center of screen
            const centerY = window.innerHeight / 2 // get center of screen

            const flowPosition = screenToFlowPosition({x: centerX + (Math.random() - 0.5) * 200,y: centerY + (Math.random() - 0.5) * 200}) // add some randomness to avoid overlap
            const newNode = {
                id: createId(),
                data:{

                },
                position: flowPosition,
                type: selection.type,

            }

            if(hasInitialNode) {
                return [newNode]
            } // if no initial node, just add the new node
            
            return [...nodes,newNode] // add the new node
  



        })
        onOpenChange(false) // close the selector

    },[setNodes,screenToFlowPosition,getNodes,onOpenChange])
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent side='right' className='w-full sm:max-w-md overflow-y-auto'>
                <SheetHeader>
                    <SheetTitle>What triggers this workflow</SheetTitle>
                    <SheetDescription>
                        A trigger starts the workflow. 
                    </SheetDescription>
                </SheetHeader>
                <div>
                    {triggerNodes.map((nodeType) => {
                        const Icon = nodeType.Icon
                        return (
                            <div 
                            onClick={() =>{handleNodeSelect(nodeType)}}
                            className='w-full justify-start h-auto py-5 px-4 rounded-none cursor-pointer border-l-2  border border-transparent  hover:border-l-primary' 
                            key={nodeType.type}>
                                <div className='flex items-center gap-6 w-full'>
                                    {typeof Icon === 'string' ? (
                                        <img src={Icon} alt={nodeType.label} className='size-5 object-contain rounded-sm' />
                                    ) : (
                                        <Icon className='size-5' />
                                    )}
                                    <div className='flex flex-col items-start text-left'>
                                        <span className='font-medium'>{nodeType.label}</span>
                                        <span className='text-sm text-muted-foreground'>{nodeType.desciription}</span>
                                    </div>
                                </div>

                            </div>
                        )
                    })}
                </div>
                <Separator className='my-4' />
                   <div>
                    {executionNodes.map((nodeType) => {
                        const Icon = nodeType.Icon
                        return (
                            <div 
                            onClick={() =>{handleNodeSelect(nodeType)}}
                            className='w-full justify-start h-auto py-5 px-4 rounded-none cursor-pointer border-l-2  border border-transparent  hover:border-l-primary' 
                            key={nodeType.type}>
                                <div className='flex items-center gap-6 w-full'>
                                    {typeof Icon === 'string' ? (
                                        <img src={Icon} alt={nodeType.label} className='size-5 object-contain rounded-sm' />
                                    ) : (
                                        <Icon className='size-5' />
                                    )}
                                    <div className='flex flex-col items-start text-left'>
                                        <span className='font-medium'>{nodeType.label}</span>
                                        <span className='text-sm text-muted-foreground'>{nodeType.desciription}</span>
                                    </div>
                                </div>

                            </div>
                        )
                    })}
                </div>

            </SheetContent>
            
            
             </Sheet> 

    )

}
