import { Editor, EditorError, EditorLoading } from "@/features/editor/components/editor";
import { EditorHeader } from "@/features/editor/components/editorHeader";
import { prefetchWorkFlow } from "@/features/workflows/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const Page = async ({ params }: {
    params: Promise<{
        workflowId: string
    }>
}) => {
    await requireAuth();
    const { workflowId } = await params ;
    console.log(workflowId);
     prefetchWorkFlow(workflowId);
    return (
         <HydrateClient>
                <ErrorBoundary fallback={<EditorError/>}>
                    <Suspense fallback={<EditorLoading/>}>
                    <EditorHeader workflowId={workflowId}/>
                    <main className="flex-1">
                         <Editor workflowId={workflowId}/>
                    </main>
                    </Suspense>
                </ErrorBoundary>
                </HydrateClient>
    )
}

export default Page;