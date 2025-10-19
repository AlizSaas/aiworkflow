'use client'

import {Position,NodeProps} from '@xyflow/react'
import  type {LucideIcon} from 'lucide-react'
import Image from 'next/image'
import {memo,} from 'react'
import {BaseNode,BaseNodeContent} from '@/components/react-flow/base-node'
import { BaseHandle } from '@/components/react-flow/base-handle'
import { WorkflowNode } from '@/components/workflow-node'

// import {} from '@/generated/prisma'

interface BaseTriggerNodeProps extends NodeProps {
 
    icon: LucideIcon | string,
    name: string,
    description?: string,
    children?: React.ReactNode,
    // status?:NodeStatus
    onSetting?:()=>void
    onDoubleClick?:()=>void

}


export const BaseTriggerNode= memo(({children,onDoubleClick,onSetting,icon:Icon,name,description,id}:BaseTriggerNodeProps)=>{
    const handleDelete = () => {}
return (
    <WorkflowNode
    name={name}
    description={description}
    onDelete={handleDelete}
    onSettings={onSetting}
    
    
    
    >
        <BaseNode onDoubleClick={onDoubleClick} className='rounded-l-2xl relative group'>
        <BaseNodeContent>
        {
            typeof Icon === 'string' ? (
                <Image src={Icon} alt={`${name}-icon`} width={16} height={16}/>
            ):(
                <Icon className='size-4 text-muted-foreground'/>
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


    </WorkflowNode>
)
})

BaseTriggerNode.displayName='BaseTriggerNode'

// this component is for execution nodes

