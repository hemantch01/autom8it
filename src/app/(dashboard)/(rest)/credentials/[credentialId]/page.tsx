
interface paramProps{
    params: Promise<{
        credentialId:String
    }>
}
const Page = async ({params}:paramProps)=>{
    const {credentialId} = await params;
    return <div>
        credential id: {credentialId}
    </div>
}

export default Page;