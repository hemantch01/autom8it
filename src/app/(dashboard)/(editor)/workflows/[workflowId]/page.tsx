import { requireAuth } from "@/lib/auth-utils";

const Page = async ({ params }: {
    params: Promise<{
        workflowId: String
    }>
}) => {
    await requireAuth();
    const { workflowId } = await params;
    return <div>
        workflowId : { }
    </div>
}

export default Page;