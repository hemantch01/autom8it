"use client"
import { EmptyView, EntityContainer, EntityHeader, EntityItem, EntityList, EntityPagination, EntitySearchComponent, ErrorView, LoadingView } from "@/components/byMe/entity-component";
import { useCreateWorkflow, useRemoveWorkflow, useSuspenseWorkflows } from "../hooks/use-workflows"
import React from "react";
import { useWorkflowsParams } from "../hooks/use-workflows-params";
import { useEntitySearch } from "../hooks/use-entity-search";
import { toast } from "sonner";
import type {Workflow as workflowType} from "@/generated/prisma/client"
import { WorkflowIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
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
        
    return (
    <EntityList
    items={workflows.data.items}
    getKey={(workflows)=>workflows.id}
    renderItem={(workflow)=> <WorkflowItem data={workflow}/>}
    emptyView = {<WorkflowsEmpty/>}
    />
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
        <EmptyView onNew={handleCreate} message="You haven't create any workflow yet. Get started by creating a workflow"/>
        </>
    )
}


export const WorkflowItem = ({
    data
}:{data:workflowType})=>{
        
    const removeWorkflow = useRemoveWorkflow();

    const handleRemove = ()=>{
        removeWorkflow.mutate({id:data.id})
    }
    
    return (
        <EntityItem
        href={`/workflows/${data.id}`}
        title={data.name}
        subtitle={
            <>
            updated {formatDistanceToNow(data.updatedAt,{addSuffix:true})}{" "}
            &bull; created {formatDistanceToNow(data.createdAt,{addSuffix:true})}{" "}
            </>
        }
        image={
            <div className="size-8 flex items-center justify-center">
                <WorkflowIcon className="size-5 text-muted-foreground"/>
            </div>
        }
        onRemove={handleRemove}
        isRemoving= {removeWorkflow.isPending}
        />
    )
}


