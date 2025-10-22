'use client'

import {Position,NodeProps, useReactFlow} from '@xyflow/react'
import  type {LucideIcon} from 'lucide-react'
import Image from 'next/image'
import {memo,} from 'react'
import {BaseNode,BaseNodeContent} from '@/components/react-flow/base-node'
import {BaseHandle} from '../../../react-flow/base-handle'
import { WorkflowNode } from '../../../workflow-node'
import { NodeStatus, NodeStatusIndicator } from '@/components/react-flow/node-status-indicator'
// import {} from '@/generated/prisma'

interface BaseExecutionNodeProps extends NodeProps {
 
    icon: LucideIcon | string,
    name: string,
    description?: string,
    children?: React.ReactNode,
    status?:NodeStatus
    onSetting?:()=>void
    onDoubleClick?:()=>void

}


export const BaseExecutionNode= memo(({children,onDoubleClick,onSetting,icon:Icon,name,description,id,status='initial'}:BaseExecutionNodeProps)=>{
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
        variant='border'
         status={status}>
        <BaseNode
        status={status}
        onDoubleClick={onDoubleClick}>
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
        </NodeStatusIndicator>


    </WorkflowNode>
    
)

})

BaseExecutionNode.displayName='BaseExecutionNode'

// this component is used as a base for all execution nodes in the workflow editor 
// it provides a consistent layout and styling for the nodes
// it also handles common functionality such as displaying the node's name, description, and icon
// it also provides handles for connecting the node to other nodes in the workflow
// additional functionality such as settings and double-click actions can be passed as props