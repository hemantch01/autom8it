
const Page = async ({ params }: {
    params: Promise<{
        workflowId: String
    }>
}) => {
    const { workflowId } = await params;
    return <div>
        workflowId : { }
    </div>
}

export default Page;