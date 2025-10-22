'use client'

import { ErrorView, LoadingView } from "@/components/entity-components"
import { useSuspenseWorkflow } from "../../workflows/hooks/use-workflows"
import { useState, useCallback } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, type Node, type Edge,  type NodeChange,  type EdgeChange, type Connection, Background, Controls, MiniMap, Panel } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { nodeComponents } from "@/config/node-components";
import { AddNodeButton } from "./add-node-button";
import { useSetAtom } from "jotai";
import { editorAtom } from "../store/atoms";

export const EditorLoading = () => {
    return <LoadingView message="Loading Editor..." />
}
export const EditorError = () => {
    return <ErrorView message="Error loading Editor" />
}



export const Editor = ({ workflowId }: { workflowId: string }) => {
    const { data: workflow } = useSuspenseWorkflow(workflowId)
    const setEditor = useSetAtom(editorAtom)
    const [nodes, setNodes] = useState<Node[]>(workflow.nodes)
    const [edges, setEdges] = useState<Edge[]>(workflow.edges)

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
        [],
    )
    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
        [],
    )
    const onConnect = useCallback(
        (params: Connection) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
        [],
    ) // onConnect callback to handle new connections between nodes 

    // React Flow requires the parent container to have an explicit height.
    // If you still don't see anything, adjust the height value below or your global CSS.
    return (
        <div style={{height:'80vh',width:'100%'}}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeComponents}
                fitView
                onInit={setEditor}
               panOnScroll
            
             
          
              
        
            >
                <Background />
                <Controls />
                <MiniMap />
                <Panel position="top-right">
                    <AddNodeButton  />
                </Panel>


            </ReactFlow>
        </div>
    )
}