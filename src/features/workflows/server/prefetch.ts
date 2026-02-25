import type { inferInput } from "@trpc/tanstack-react-query";
import {prefetch, trpc } from "@/trpc/server";


type Input = inferInput<typeof trpc.workflow.getMany>;

// prefetch all workflows

export const prefetchWorkFlows  = (params:Input)=>{
    return prefetch(trpc.workflow.getMany.queryOptions(params));
}

export const prefetchWorkFlow = (id:string)=>{
    return prefetch(trpc.workflow.getOne.queryOptions({id}));
}