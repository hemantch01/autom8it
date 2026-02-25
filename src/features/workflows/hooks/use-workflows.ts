

// hook to fetch all workflows using suspense

import { useTRPC } from "@/trpc/client"
import {  useMutation,  useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useWorkflowsParams } from "./use-workflows-params";

export const useSuspenseWorkflows = ()=>{
    const trpc = useTRPC();
    const [params] = useWorkflowsParams();
    return useSuspenseQuery(trpc.workflow.getMany.queryOptions(params));
}

/**
 * Hook to create a new workflow
 */

export const useCreateWorkflow  =()=>{
   const router = useRouter();
   const queryClient = useQueryClient();
   const trpc = useTRPC();
   return useMutation(
    trpc.workflow.create.mutationOptions({
        onSuccess:(data)=>{
            toast.success(`Workflow "${data.name}" created`);
            router.push(`/workflows/${data.id}`);
            queryClient.invalidateQueries(trpc.workflow.getMany.queryOptions({}));
        },
        onError:(err)=>{
            toast.error(`failed to create workflows ${err.message}`);
        },
    }))
}

// hook to remove a workflow

export const useRemoveWorkflow = ()=> {
    const trpc = useTRPC();
const queryClient  = useQueryClient();
    
    return useMutation(trpc.workflow.remove.mutationOptions({
        onSuccess: (data)=>{
            toast.success(`workflow "${data.name}" removed`);
            
            queryClient.invalidateQueries(trpc.workflow.getMany.queryOptions({}));
            
            // below  is a good practice but above approach is not that bad as it will only fetch at max
            // page size== 5 queries from db 

            // queryClient.invalidateQueries(
            //     trpc.workflow.getOne.queryFilter({id:data.id})
            // )
        }
    }))
}