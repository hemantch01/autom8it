import prismaClient from "@/lib/db";
import {  createTRPCRouter, protectedProcedure } from "../init";


export const appRouter = createTRPCRouter({
    // give routes name etc
    getUsers: protectedProcedure.query(async ({ctx})=>{
        const userId = ctx.auth.user.id;
        return {
            user : await prismaClient.user.findMany({
                where: {
                    id: userId
                },
            })
        }
    })
});

export type AppRouter = typeof appRouter;