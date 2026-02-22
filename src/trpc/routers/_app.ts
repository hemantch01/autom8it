import {  createTRPCRouter, protectedProcedure } from "../init";
import { workFlowRouter } from "@/features/workflows/server/routers";

export const appRouter = createTRPCRouter({
    // give routes name etc
    workflow: workFlowRouter,
});

export type AppRouter = typeof appRouter;