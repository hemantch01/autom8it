import prismaClient from "@/lib/db";
import { baseProcedure, createTRPCRouter } from "../init";


export const appRouter = createTRPCRouter({
    // give routes name etc
    getUsers: baseProcedure.query(async()=>{
        return {
            user : await prismaClient.user.findMany()
        }
    })
});

export type AppRouter = typeof appRouter;