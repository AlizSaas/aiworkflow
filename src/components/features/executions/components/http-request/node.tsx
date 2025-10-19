'use client'

import type {Node,NodeProps} from '@xyflow/react'

import { GlobeIcon } from 'lucide-react'
import {memo} from 'react'
import {BaseExecutionNode} from '../base-execution-node'

type HttpRequestNodeData = {
    endPoint?: string,
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH', 
    body?: string,
    [key: string]: unknown
}


type HttpRequestNodeType = Node<HttpRequestNodeData>

export const HttpRequestNode= memo((props:NodeProps<HttpRequestNodeType>)=>{
    const nodeData = props.data as HttpRequestNodeData
const description = nodeData?.endPoint ? `${nodeData.method || 'GET'} : ${nodeData.endPoint}` :  'Not configured'

return (
    <>
    <BaseExecutionNode
    {...props}
    id={props.id}
    icon={GlobeIcon}
    name={'HTTP Request'}
    description={description}
    onSetting={() =>{}}
    onDoubleClick={() => {}}
    
    />
    
    
    </>
)

})

HttpRequestNode.displayName='HttpRequestNode'

// this component is used to render the HTTP Request node in the workflow editor
// it extends the BaseExecutionNode component and provides specific details for the HTTP Request node
// such as the icon, name, and description based on the node's data.
// The component is memoized to prevent unnecessary re-renders.
