"use client"
import { EntityContainer, EntityHeader } from "@/components/byMe/entity-component";
import { useSuspenseWorkflows } from "../hooks/use-workflows"
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
    return (
    <>
        <EntityHeader
        title="WorkFlows"
        description="Create and manage your WorkFlows"
        onNew={()=>{}}
        newButtonLabel="New workflow"
        disabled= {disabled}
        isCreating = {false}
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