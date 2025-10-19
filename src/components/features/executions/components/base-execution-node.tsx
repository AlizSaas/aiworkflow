'use client'

import {Position,NodeProps} from '@xyflow/react'
import  type {LucideIcon} from 'lucide-react'
import Image from 'next/image'
import {memo,} from 'react'
import {BaseNode,BaseNodeContent} from '@/components/react-flow/base-node'
import {BaseHandle} from '../../../react-flow/base-handle'
import { WorkflowNode } from '../../../workflow-node'
// import {} from '@/generated/prisma'

interface BaseExecutionNodeProps extends NodeProps {
 
    icon: LucideIcon | string,
    name: string,
    description?: string,
    children?: React.ReactNode,
    // status?:NodeStatus
    onSetting?:()=>void
    onDoubleClick?:()=>void

}


export const BaseExecutionNode= memo(({children,onDoubleClick,onSetting,icon:Icon,name,description,id}:BaseExecutionNodeProps)=>{
    const handleDelete = () => {}
return (
    <WorkflowNode
    name={name}
    description={description}
    onDelete={handleDelete}
    onSettings={onSetting}
    
    
    
    >
        <BaseNode onDoubleClick={onDoubleClick}>
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
        type='target'
        position={Position.Left}
        
        />
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

BaseExecutionNode.displayName='BaseExecutionNode'

// this component is used as a base for all execution nodes in the workflow editor 
// it provides a consistent layout and styling for the nodes
// it also handles common functionality such as displaying the node's name, description, and icon
// it also provides handles for connecting the node to other nodes in the workflow
// additional functionality such as settings and double-click actions can be passed as props