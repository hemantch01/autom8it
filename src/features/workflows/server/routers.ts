import { PAGINATION } from "@/config/constants";
import { NodeType } from "@/generated/prisma/enums";
import prismaClient from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { Edge, Node } from "@xyflow/react";
import {generateSlug} from "random-word-slugs";
import z from "zod";
export const workFlowRouter = createTRPCRouter({
    create: protectedProcedure.mutation(async (tobj)=>{
            return await prismaClient.workflow.create({
                data:{
                    name:generateSlug(3),
                    userId: tobj.ctx.auth.user.id,
                    nodes:{
                        create:{
                            type: NodeType.INITIAL,
                            name: NodeType.INITIAL,
                            position: {x:0, y:0}
                        }
                    }
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

    getMany: protectedProcedure
    .input(
        z.object({
            page:z.number().default(PAGINATION.DEFAULT_PAGE),
            pageSize:z.
            number()
            .min(PAGINATION.MIN_PAGE_SIZE)
            .max(PAGINATION.MAX_PAGE_SIZE)
            .default(PAGINATION.DEFAULT_PAGE_SIZE),
            search:z.string().default("")
        })
    )
    .query(async ({ctx,input})=>{
            const [items,totalCount] = await Promise.all([
                 prismaClient.workflow.findMany({
                    skip: (input.page-1)*input.pageSize,
                    take: input.pageSize,
                    where:{
                        userId:ctx.auth.user.id,
                        name:{
                            contains:input.search,
                            mode:"insensitive"
                        },
                    },
                    orderBy:{
                        updatedAt:"desc"
                    }
                }),
                 prismaClient.workflow.count({
                    where:{
                        userId: ctx.auth.user.id,
                        name:{
                            contains:input.search,
                            mode:"insensitive"
                        },
                    }
                    
                })
            ]);

            const totalPages = Math.ceil(totalCount/input.pageSize);
            const hasNextPage = input.page<totalPages;
            const hasPreviousPage = input.page>1;
            return {
                items,
                page:input.page,
                pageSize:input.pageSize,
                totalCount,
                totalPages,
                hasNextPage,
                hasPreviousPage,
            }
    }),
    
    getOne: protectedProcedure
    .input(z.object({id:z.string()}))
    .query(async ({ctx , input})=>{
        const workflow =  await prismaClient.workflow.findUniqueOrThrow({
            where:{
                id:input.id,
                userId:ctx.auth.user.id
            },
            include:{
                nodes:true,
                connections:true,
            }
        });
        
        // Transform server nodes to reaact-flow compatible nodes
        const nodes:Node[] = workflow.nodes.map((node)=>(
            {
                id:node.id,
                type:node.type,
                position:node.position as {x:number, y:number},
                data:(node.data as Record<string,unknown> ||{})
            }
        ));

        // Transform server connection to react-flow compatible edges

        const edges:Edge[] = workflow.connections.map((connection)=>(
            {
                id:connection.id,
                source: connection.fromNodeId,
                target: connection.toNodeId,
                sourceHandle: connection.fromNodeId,
                targetHandle: connection.toInput,
            }
        ))

        return {
            id:workflow.id,
            name:workflow.name,
            nodes,
            edges
        }

    })
});