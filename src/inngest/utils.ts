import { Connections,Node } from "@/generated/prisma/client";
import toposort from "toposort";

export const topologicalSort = (
    nodes:Node[],
    connections:Connections[]
):Node[]=>{
    if(connections.length===0){
        return nodes;
    }
    
    // create edges array for toposort

    const edges:[string, string][] = connections.map((conn)=>[conn.fromNodeId, conn.toNodeId]);
    
    // Add nodes with no connections as self-edges to ensure thry are included
    const connectedNodesId = new Set<string>();
    for(const conn of connections){
        connectedNodesId.add(conn.fromNodeId);
        connectedNodesId.add(conn.toNodeId);
    }

    for(const node of nodes){
        if(!connectedNodesId.has(node.id)){
            edges.push([node.id, node.id]);
        }
    }

    // perform topological sort
    let sortedNodeIds: string[];
    try{
        sortedNodeIds = toposort(edges);
        // Remove duplicated from self-edges
        sortedNodeIds= [...new Set(sortedNodeIds)];
    } catch(error){
        if(error instanceof Error && error.message.includes("Cyclic")){
            throw new Error("Workflow contains a cycle");
        }
        throw error;
    }

    // Map sorted Ids back to node objects
    const nodeMap = new Map(nodes.map((n)=> [n.id,n]));
    return sortedNodeIds.map((id)=> nodeMap.get(id)!).filter(Boolean)

}