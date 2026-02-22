"use client"
import { EntityContainer, EntityHeader } from "@/components/byMe/entity-component";
import { useCreateWorkflow, useSuspenseWorkflows } from "../hooks/use-workflows"
import React from "react";

export const WorkFlowsList = ()=>{
    const workflows = useSuspenseWorkflows();

    return (
        <p>
            {JSON.stringify(workflows.data,null,2)}
        </p>
    )
}

export const WorkflowsHeader = ({disabled}:{disabled?:boolean})=>{
   const createWorkflow = useCreateWorkflow();

   const handleCreate = ()=>{
    createWorkflow.mutate(undefined,{
        onError:(error)=>{
            // TODO: open upgrade model
            console.error(error);
        },

    })
   }
    return (
    <>
        <EntityHeader
        title="WorkFlows"
        description="Create and manage your WorkFlows"
        onNew={handleCreate}
        newButtonLabel="New workflow"
        disabled= {disabled}
        isCreating = {createWorkflow.isPending}
        />
    </>)
};

export const WorkFlowsContainer = ({children}:{children:React.ReactNode;})=>{

    return (
        <EntityContainer
            header= {<WorkflowsHeader/>}
            search= {<></>}
            pagination= {<></>}
        >
            {children}
        </EntityContainer>
    )
}