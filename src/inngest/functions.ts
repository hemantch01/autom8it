import prismaClient from "@/lib/db";
import { inngest } from "./client";
import {generateText} from "ai";
import { google } from "@ai-sdk/google";
export const execute = inngest.createFunction(
    {id:"execute-aiFlow"},
    {event:"exectue/ai"},

    async({event,step})=>{
      //  await step.sleep("wait-a-moment",'5s');
        console.log("hit")
       const response =  await step.ai.wrap("gemini-generate-text",generateText,{
            model:google("gemini-2.5-flash"),
            system:"yoii are a helpfull assistant",
            prompt:"what is 2+2?"
        })
        
        return response.steps;
    }
);