import { WorkFlowsContainer, WorkFlowsList } from "@/features/workflows/components/workflows";
import { prefetchWorkFlows } from "@/features/workflows/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
const Page = async ()=>{
    await requireAuth();
    prefetchWorkFlows();
    return (
    <WorkFlowsContainer>
        <HydrateClient>
            <ErrorBoundary fallback={<p>Error</p>}>
                <Suspense fallback={<>loading....</>}>
                <WorkFlowsList/>
                </Suspense>
            </ErrorBoundary>
        </HydrateClient>
    </WorkFlowsContainer>
    )
}

export default Page;