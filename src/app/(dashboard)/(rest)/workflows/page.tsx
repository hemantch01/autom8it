import { WorkFlowsContainer, WorkflowsError, WorkFlowsList, WorkflowsLoading } from "@/features/workflows/components/workflows";
import { workflowsParamsLoader } from "@/features/workflows/hooks/useParamsServer";
import { prefetchWorkFlows } from "@/features/workflows/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

type Props = {
    searchParams: Promise<SearchParams>;
}

const Page = async ({searchParams}:Props)=>{
    await requireAuth();
    const params = await workflowsParamsLoader(searchParams);
    prefetchWorkFlows(params);
    return (
    <WorkFlowsContainer>
        <HydrateClient>
            <ErrorBoundary fallback={<WorkflowsError/>}>
                <Suspense fallback={<WorkflowsLoading/>}>
                <WorkFlowsList/>
                </Suspense>
            </ErrorBoundary>
        </HydrateClient>
    </WorkFlowsContainer>
    )
}

export default Page;