import prismaClient from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { Input } from "@base-ui/react";
import {generateSlug} from "random-word-slugs";
import z from "zod";
export const workFlowRouter = createTRPCRouter({
    create: protectedProcedure.mutation(async (tobj)=>{
            return await prismaClient.workflow.create({
                data:{
                    name:generateSlug(5),
                    userId: tobj.ctx.auth.user.id
                }
            })
    }),
    remove: protectedProcedure
    .input(z.object({id:z.string()}))
    .mutation(({ctx,input})=>{
        return prismaClient.workflow.delete({
            where:{
                userId:ctx.auth.user.id,
                id:input.id
            }
        })
    }),
    updateName: protectedProcedure
    .input(z.object({id:z.string(),name:z.string().min(1)}))
    .mutation(async ({ctx,input})=>{
        return await prismaClient.workflow.update({
            where:{
                id:input.id,
                userId:ctx.auth.user.id
            },
            data:{
                name:input.name
            }
        });
    }),
    getOne: protectedProcedure
    .query(async ({ctx})=>{
        return await prismaClient.workflow.findMany({
            where:{
                userId:ctx.auth.user.id
            }
        })
    })
});