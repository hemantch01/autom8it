import { ja } from "date-fns/locale";
import { inngest } from "./client";
import { NonRetriableError } from "inngest";
import prismaClient from "@/lib/db";

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
    
    const nodes = await step.run("prepare-workflow", async ()=>{
        const workflow = await prismaClient.workflow.findUniqueOrThrow({
            where:{
                id:workflowId
            },
            include:{
                nodes:true,
                connections:true,
            }
        });
        
        return workflow.nodes;
    });
    return {nodes};
})