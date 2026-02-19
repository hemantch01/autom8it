import prismaClient from "@/lib/db";
import {  createTRPCRouter, protectedProcedure } from "../init";
import { inngest } from "@/inngest/client";
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';


export const appRouter = createTRPCRouter({
    // give routes name etc
    aitest :protectedProcedure.mutation(async ()=>{

        const { text } = await generateText({
        model: google('gemini-2.5-flash'),
        prompt: 'Write a vegetarian lasagna recipe for 4 people.',
        });
       
       
        return text;
    }),
    getWorkflows: protectedProcedure.query(async ({ctx})=>{
        return await prismaClient.workflow.findMany();
    }),
    createWorkflows: protectedProcedure.mutation(async ({ctx})=>{

        const inngestReq = inngest.send({
            name:"test/hello.world",data:{
                email:"hemant@mail.com"
            }
        })
        return {message:"job is queued",success:true}
    })
});

export type AppRouter = typeof appRouter;