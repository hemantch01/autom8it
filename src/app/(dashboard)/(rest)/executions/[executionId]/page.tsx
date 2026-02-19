const Page = async ({params}:{
    params: Promise<{
        executionId:String
    }>
})=>{
    const {executionId} = await params;
    return <div>
    execution Id :{executionId}
    </div>
}

export default Page;