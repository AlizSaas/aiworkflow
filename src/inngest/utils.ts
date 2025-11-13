import { Connection, Node } from "@/generated/prisma";
import toposort from "toposort";

export const topologicalSort = (nodes:Node[],connections:Connection[]):Node[] => {
    // if no connectiions, return nodes as is
    if(connections.length === 0) {
        return nodes;
    }
    // create edges for toposort
    const edges = connections.map((conn) => [conn.fromNodeId, conn.toNodeId] as [string, string]);

    // add nodes with no connections as self-edges to ensure tey are included
    const connectedNodeIds = new Set<string>();

    for (const conn of connections) {
        connectedNodeIds.add(conn.fromNodeId);
        connectedNodeIds.add(conn.toNodeId);
    }
    for (const node of nodes) {
        if (!connectedNodeIds.has(node.id)) {
            edges.push([node.id, node.id]);
        }
    }
    // perform toposort
   let sortedNodeIds: string[];

   try {
    sortedNodeIds = toposort(edges); 

    //remove self-edges
    sortedNodeIds =  [...new Set(sortedNodeIds)]; // ensure uniqueness
    
   } catch (error) {
    if(error instanceof Error && error.message.includes('Cyclic')) {
        throw new Error(`workflow contains a cycle`);
    }
    throw error;
    
   }

   // Map sorted IDs back to nodes
    const nodeMap = new Map(nodes.map((node) => [node.id, node]));

    return sortedNodeIds.map((id) => nodeMap.get(id)!).filter(Boolean)



}