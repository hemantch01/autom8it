"use client"

import { ErrorView, LoadingView } from "@/components/byMe/entity-component";
import { useSuspenseWorkflow } from "@/features/workflows/hooks/use-workflows";
import {
    ReactFlow,
    applyNodeChanges,
    applyEdgeChanges,
    addEdge,
    type Node,
    type Edge,
    NodeChange,
    EdgeChange,
    Connection,
    Background,
    Controls
} from "@xyflow/react";
import "@xyflow/react/dist/style.css"
import { useCallback, useState } from "react";

export const EditorLoading = ()=>{
    return <LoadingView message="Loading editor..."/>
}
export const EditorError = ()=>{
    return <ErrorView message="Error Loading editor"/>
}

const initialNodes = [
    {
        id:"n1",
        position:{x:0,y:0},
        data: {
            label:"Node 1"
        }
    },
    {
      id:'n2',
      position:{ x:0,y:100},
      data:{
        label:"Node 2"
      }  
    }
];

const initialEdges = [
    {
        id:"n1-n2",
        source:"n1",
        target:"n2",
    }
];

export const Editor = ({workflowId}:{workflowId:string})=>{
    const { data: workflow} = useSuspenseWorkflow(workflowId);
    
    const [nodes, setNodes]  = useState<Node[]>(workflow.nodes);
    const [edges, setEdges] = useState<Edge[]>(workflow.edges);
   const onNodesChange = useCallback(
        (changes:NodeChange[])=> setNodes(
            (nodeSnapShot)=> applyNodeChanges(changes,nodeSnapShot)
        )
        ,[]);
    const onEdgesChange = useCallback(
        (changes:EdgeChange[])=> setEdges(
            (edgesSnapShot)=> applyEdgeChanges(changes,edgesSnapShot)
        )
        ,[]);

    const onConnect = useCallback(
        (params:Connection)=> setEdges(
            (edgesSnapShot)=> addEdge(params,edgesSnapShot)
        )
        ,[]);
    return (
        <div className="size-full">
            <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            >
                <Background/>
                <Controls/>
            </ReactFlow>
        </div>
    )
}