import prismaClient from "@/lib/db";
import {  createTRPCRouter, protectedProcedure } from "../init";


export const appRouter = createTRPCRouter({
    // give routes name etc
    getWorkflows: protectedProcedure.query(async ({ctx})=>{
        return await prismaClient.workflow.findMany();
    }),
    createWorkflows: protectedProcedure.mutation(async ({ctx})=>{
        return (await prismaClient.workflow.create({
            data:{
                name:"test-workflow"
            }
        }))
    })
});

export type AppRouter = typeof appRouter;