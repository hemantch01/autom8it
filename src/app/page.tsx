import prismaClient from "@/lib/db"

export default async function Home () {
  const thisb = await prismaClient.user.findFirst({
    where:{
      email:"hsemant@gmail.com"
    }
  })
 
  return (
    <div >
  <div>
    {JSON.stringify(thisb)}
  </div>
      
    </div>
  );
}
