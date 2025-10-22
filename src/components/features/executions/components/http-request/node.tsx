'use client'

import {useReactFlow, type Node,type NodeProps} from '@xyflow/react'

import { GlobeIcon } from 'lucide-react'
import {memo, useEffect, useState} from 'react'
import {BaseExecutionNode} from '../base-execution-node'
import { FormType, HttpRequestDialog } from './dialog'


type HttpRequestNodeData = {
    endPoint?: string,
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH', 
    body?: string,
    [key: string]: unknown
}


type HttpRequestNodeType = Node<HttpRequestNodeData>

export const HttpRequestNode= memo((props:NodeProps<HttpRequestNodeType>)=>{
    const [dialogOpen,setDialogOpen]=useState(false)
    const {setNodes} = useReactFlow()   
    const status = 'initial'   
    const nodeData = props.data as HttpRequestNodeData
const description = nodeData?.endPoint ? `${nodeData.method || 'GET'} : ${nodeData.endPoint}` :  'Not configured'
const handleOpenSettings = () => {
    setDialogOpen(true)
}
const handleSubmit =  (values:FormType )  => {
    setNodes((nodes) => {
        return nodes.map((node) => {
            if(node.id === props.id) {
                return {
                    ...node,
                    data:{
                        ...node.data,
                        endPoint: values.endPoint,
                        method: values.method,
                        body: values.body,

                    }
                }

            }
            return node

        })
    

    })

    console.log('HTTP Request Node updated with values:', values);



} // render the HTTP Request node

return (
    <>
    <HttpRequestDialog
    onSubmit={handleSubmit}
    defaultEndpoint={nodeData.endPoint}
    defaultBody={nodeData.body}
    defaultMethod={nodeData.method}
    
    open={dialogOpen} onOpenChange={setDialogOpen} />
    <BaseExecutionNode
    {...props}
    id={props.id}
    icon={GlobeIcon}
    name={'HTTP Request'}
    status={status}
    description={description}
    onSetting={handleOpenSettings}
    onDoubleClick={handleOpenSettings}
    
    />
    
    
    </>
)

})

HttpRequestNode.displayName='HttpRequestNode'

// this component is used to render the HTTP Request node in the workflow editor
// it extends the BaseExecutionNode component and provides specific details for the HTTP Request node
// such as the icon, name, and description based on the node's data.
// The component is memoized to prevent unnecessary re-renders.
