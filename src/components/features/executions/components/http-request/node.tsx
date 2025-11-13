'use client'

import {useReactFlow, type Node,type NodeProps} from '@xyflow/react'

import { GlobeIcon } from 'lucide-react'
import {memo, useEffect, useState} from 'react'
import {BaseExecutionNode} from '../base-execution-node'
import { HttpRequestFormValues, HttpRequestDialog } from './dialog'
import { useNodeStatus } from '../../hooks/use-node-status'
import { channel } from 'diagnostics_channel'
import { fetchHttpRequestRealtimeToken } from './action'
import { HTTP_REQUEST_CHANNEL_Name, httpRequestChannel } from '@/inngest/channels/http-request'



type HttpRequestNodeData = {
 variableName?: string,
    endpoint?: string,
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH', 
    body?: string,
  
}


type HttpRequestNodeType = Node<HttpRequestNodeData>

export const HttpRequestNode= memo((props:NodeProps<HttpRequestNodeType>)=>{
    const [dialogOpen,setDialogOpen]=useState(false)
    const {setNodes} = useReactFlow()   
    const nodeStatus =  useNodeStatus({nodeId:props.id,channel: HTTP_REQUEST_CHANNEL_Name,topic:'status',refreshToken:fetchHttpRequestRealtimeToken}) 
    const nodeData = props.data as HttpRequestNodeData
const description = nodeData?.endpoint ? `${nodeData.method || 'GET'} : ${nodeData.endpoint}` :  'Not configured'
const handleOpenSettings = () => {
    setDialogOpen(true)
}
const handleSubmit =  (values:HttpRequestFormValues )  => {
    setNodes((nodes) => {
        return nodes.map((node) => {
            if(node.id === props.id) {
                return {
                    ...node,
                    data:{
                        ...node.data,
                        ...values

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
 defaultValues={nodeData}
    
    open={dialogOpen} onOpenChange={setDialogOpen} />
    <BaseExecutionNode
    {...props}
    id={props.id}
    icon={GlobeIcon}
    name={'HTTP Request'}
    status={nodeStatus}
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
