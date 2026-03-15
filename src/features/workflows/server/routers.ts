import { PAGINATION } from "@/config/constants";
import { NodeType } from "@/generated/prisma/enums";
import { inngest } from "@/inngest/client";
import prismaClient from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { Edge, Node } from "@xyflow/react";
import {generateSlug} from "random-word-slugs";
import z from "zod";
export const workFlowRouter = createTRPCRouter({
    execute: protectedProcedure
    .input(z.object({id:z.string()}))
    .mutation(async({input , ctx})=>{
        const workflow = await prismaClient.workflow.findFirstOrThrow({
            where:{
                id:input.id,
                userId:ctx.auth.user.id
            }
        });
        // now i want the 
        
        await inngest.send({
            name:"workflows/execute.workflow",
            data:{
                workflowId:input.id,
                
            }
        });

        return workflow;


    }),

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
    update: protectedProcedure
    .input(z.object({
        // this id is workflow id
        id:z.string(),
        nodes:z.array(
            z.object({
                id:z.string(),
                type:z.string().nullish(),
                position:z.object({x:z.number(),y:z.number()}),
                data:z.record(z.string(),z.any().optional())
            })
        ),
        edges: z.array(
            z.object({
                source:z.string(),
                target:z.string(),
                sourceHandle:z.string().nullish(),
                targetHandle:z.string().nullish()
            }),
        ),
    }))
    .mutation(async ({ctx,input})=>{
        const {id, nodes,edges} = input;
        const workflow = await prismaClient.workflow.findUniqueOrThrow({
            where:{
                id,
                userId:ctx.auth.user.id,
            }
        });
        // transaction for acid
        return await prismaClient.$transaction(async (tx)=>{
            // deleting existing nodes and connections {cascade deletes connections}

            await tx.node.deleteMany({
                where: {workflowId:id}
            })
            // create new nodes

            await tx.node.createMany({
                data: nodes.map((node)=>({
                    id:node.id,
                    workflowId:id,
                    name:node.type|| "unknown",
                    type:node.type as NodeType,
                    position:node.position,
                    data:node.data||{},
                }))
            })
            // create connections
            await tx.connections.createMany({
                data: edges.map((edge)=>({
                    workflowId:id,
                    fromNodeId:edge.source,
                    toNodeId:edge.target,
                    fromOutput:edge.sourceHandle||"main",
                    toInput:edge.targetHandle || "main",
                }))
            });
                // this transaction doesnot modify workflow directly just it's conneciton so updatedAt will not updated

            // update workflow's updateAt timestamp for user expericne
            await tx.workflow.update({
                where:{
                    id
                },
                data:{
                    updatedAt:new Date()
                }
            })
            return workflow;
        })
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
                sourceHandle: connection.fromOutput,
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