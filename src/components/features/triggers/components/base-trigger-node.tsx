'use client'

import {Position,NodeProps, useReactFlow} from '@xyflow/react'
import  type {LucideIcon} from 'lucide-react'
import Image from 'next/image'
import {memo,} from 'react'
import {BaseNode,BaseNodeContent} from '@/components/react-flow/base-node'
import { BaseHandle } from '@/components/react-flow/base-handle'
import { WorkflowNode } from '@/components/workflow-node'
import { NodeStatus, NodeStatusIndicator } from '@/components/react-flow/node-status-indicator'



// import {} from '@/generated/prisma'

interface BaseTriggerNodeProps extends NodeProps {
 
    icon: LucideIcon | string,
    name: string,
    description?: string,
    children?: React.ReactNode,
    status?:NodeStatus
    onSetting?:()=>void
    onDoubleClick?:()=>void

}


export const BaseTriggerNode= memo(({children,onDoubleClick,onSetting,icon:Icon,name,description,id,status='initial'}:BaseTriggerNodeProps)=>{
    const {setNodes,setEdges} = useReactFlow()

    const handleDelete = () => {
        setNodes((currentNodes) => {
            const updatedNotes = currentNodes.filter((node) => node.id !== id) // Remove the node with the matching id
            return updatedNotes
        })
        setEdges((currentEdges) => {
            const updatedEdges = currentEdges.filter((edge) => edge.source !== id && edge.target !== id) // Remove edges connected to the node
            return updatedEdges
        })

    }
return (
    <WorkflowNode
    name={name}
    description={description}
    onDelete={handleDelete}
    onSettings={onSetting}

    
    
    
    >
        <NodeStatusIndicator
        status={status}
        variant='border'
        className='rounded-l-2xl'
        

        
        > 
        <BaseNode 
        status={status}
        
        
        onDoubleClick={onDoubleClick} className='rounded-l-2xl relative group'>
        <BaseNodeContent className=''>
        {
            typeof Icon === 'string' ? (
                <Image src={Icon} alt={`${name}-icon`} width={16} height={16}/>
            ):(
                <Icon className='size-5 text-muted-foreground'/>
            )
        }
        {children}
     
        <BaseHandle 
        id={'target-1'}
        type='source'
        position={Position.Right}
        
        />
        </BaseNodeContent>
        
        </BaseNode>
        </NodeStatusIndicator>


    </WorkflowNode>
)
})

BaseTriggerNode.displayName='BaseTriggerNode'

// this component is for execution nodes

