import { requireAuth } from "@/lib/auth-utils";

interface paramProps{
    params: Promise<{
        credentialId:String
    }>
}
const Page = async ({params}:paramProps)=>{
    await requireAuth();
    const {credentialId} = await params;
    return <div>
        credential id: {credentialId}
    </div>
}

export default Page;