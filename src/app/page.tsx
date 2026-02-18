import { requireAuth } from "@/lib/auth-utils";
import { trpc } from "@/trpc/server";

export default  async function Home () {
  await requireAuth();
  const caller = await trpc();
  const data = await caller.getUsers();
  return (
    <div >
  <div>
   Protected Route
  </div>
  <div>
    {JSON.stringify(data)}
  </div>
    </div>
  );
}
