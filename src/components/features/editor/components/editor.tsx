'use client'

import { ErrorView, LoadingView } from "@/components/entity-components"
import { useSuspenseWorkflow } from "../../workflows/hooks/use-workflows"
import { useState, useCallback } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, type Node, type Edge,  type NodeChange,  type EdgeChange, type Connection, Background, Controls, MiniMap, Panel } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { nodeComponents } from "@/config/node-components";
import { AddNodeButton } from "./add-node-button";

export const EditorLoading = () => {
    return <LoadingView message="Loading Editor..." />
}
export const EditorError = () => {
    return <ErrorView message="Error loading Editor" />
}



export const Editor = ({ workflowId }: { workflowId: string }) => {
    const { data: workflow } = useSuspenseWorkflow(workflowId)
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
    )

    // React Flow requires the parent container to have an explicit height.
    // If you still don't see anything, adjust the height value below or your global CSS.
    return (
        <div style={{ width: '100%', height: '80vh' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeComponents}
                fitView
                proOptions={{hideAttribution:true}}
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