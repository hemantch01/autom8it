import { inngest } from "./client";
import { NonRetriableError } from "inngest";
import prismaClient from "@/lib/db";
import { topologicalSort } from "./utils";
import { NodeType } from "@/generated/prisma/enums";
import { getExecutor } from "@/features/executions/lib/executor_registry";

export const executeWorkflow = inngest.createFunction({
    id:"execute-workflow"
},{event:"workflows/execute.workflow"},async ({
    event,
    step
})=>{
    // it needs to somehow fetch the workflow that's been executed 
    // fetch all of nodes sort them topologocallyy run specific type of request

    const workflowId = event.data.workflowId;
    if(!workflowId){
        throw new NonRetriableError("the workflow id is missing");
    }
    
    const finalSortedNodes = await step.run("prepare-workflow", async ()=>{
        const workflow = await prismaClient.workflow.findUniqueOrThrow({
            where:{
                id:workflowId
            },
            include:{
                nodes:true,
                connections:true,
            }
        });
        const sortedNodes = topologicalSort(workflow.nodes,workflow.connections)
        return sortedNodes;
    });

    // Initialzie the context with any initial data from the trigger like webhooks, google form
    let context = event.data.initialData || {};

    // Execute each node
    for(const node of finalSortedNodes){
        const executor = getExecutor(node.type as NodeType);
        context = await executor({
            data:node.data as Record<string,unknown>,
            nodeId:node.id,
            context,
            step
        })
    }
    return {
        workflowId,
        result:context,
    };
})