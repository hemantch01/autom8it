

// hook to fetch all workflows using suspense

import { useTRPC } from "@/trpc/client"
import {  useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { error } from "console";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useSuspenseWorkflows = ()=>{
    const trpc = useTRPC();

    return useSuspenseQuery(trpc.workflow.getMany.queryOptions());
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
            queryClient.invalidateQueries(trpc.workflow.getMany.queryOptions());
        },
        onError:(err)=>{
            toast.error(`failed to create workflows ${err.message}`);
        },
    }))
}