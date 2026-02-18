"use client";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default   function Home () {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const {data} = useQuery(trpc.getWorkflows.queryOptions());
  
  const create = useMutation(trpc.createWorkflows.mutationOptions({
    onSuccess:()=>{
    queryClient.invalidateQueries(trpc.getWorkflows.queryOptions())
    },
    onError:(ctx)=>{
      toast.error(ctx.message)
    }
  }));
  
  return (
    <div >
  <div>
   Protected Route
  </div>
  <div>
    {JSON.stringify(data)}
  </div>
  <Button disabled={create.isPending} onClick={()=>{return create.mutate()}}>
    create Workflows
  </Button>
    </div>
  );
}
