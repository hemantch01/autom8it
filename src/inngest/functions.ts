import prismaClient from "@/lib/db";
import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
    {id:"hello-words-async"},
    {event:"test/hello.world"},

    async({event,step})=>{
        await step.sleep("wait-a-moment",'5s');

        await step.sleep("wait_again","5s");

        await step.run("creating workFlow",async ()=>{
            await prismaClient.workflow.create({
            data:{
                name:"this is queued by inngest function"
            }
        })
        })
        

        return {message:`hello ${event.data.email}!`};
    }
);