"use client"
import { EmptyView, EntityContainer, EntityHeader, EntityPagination, EntitySearchComponent, ErrorView, LoadingView } from "@/components/byMe/entity-component";
import { useCreateWorkflow, useSuspenseWorkflows } from "../hooks/use-workflows"
import React from "react";
import { useWorkflowsParams } from "../hooks/use-workflows-params";
import { useEntitySearch } from "../hooks/use-entity-search";
import { toast } from "sonner";

export const WorkflowsSearch = ()=>{
    const [params,setParams] = useWorkflowsParams();
     
    const {searchValue,onSearchChange} = useEntitySearch({
        params,
        setParams
    });
    return (
        <EntitySearchComponent
        value={searchValue}
        onChange={onSearchChange}
        placeholder="Search workflows"
        />
    )
}
export const WorkFlowsList = ()=>{
  const workflows = useSuspenseWorkflows();
        
  if(workflows.data.items.length===0){
    return (
        <WorkflowsEmpty/>
    )
  }
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

export const WorkflowPagination = ()=>{
    const workflows = useSuspenseWorkflows();
    const [params , setParams] = useWorkflowsParams();
    return (
        <EntityPagination 
        disabled={workflows.isFetching}
        totalPages={workflows.data.totalPages}
        page={workflows.data.page}
        onPageChange={(page)=> setParams({...params, page} )}
        />
    )
} 

export const WorkFlowsContainer = ({children}:{children:React.ReactNode;})=>{

    return (
        <EntityContainer
            header= {<WorkflowsHeader/>}
            search= {<WorkflowsSearch/>}
            pagination= {<WorkflowPagination/>}
        >
            {children}
        </EntityContainer>
    )
}


export const WorkflowsLoading = ()=>{
    return <LoadingView message="Loading workflows..."/>
}

export const WorkflowsError = ()=>{
    return <ErrorView message="Error Loading workflows"/>
}

export const WorkflowsEmpty =()=>{
    const createWorkflow = useCreateWorkflow();
    
    const handleCreate = ()=>{
        createWorkflow.mutate(undefined,{
            onError:(error)=>{
                toast.error(error.message);
            }
        })
    }
    return (
        <>
        <EmptyView onNew={handleCreate} message="You haven't create any workflow yet. Get started by creting you first workflow"/>
        </>
    )
}


