import { requireAuth } from "@/lib/get-session"
import { caller } from "@/trpc/server"




export default async  function page() {
  await requireAuth()
  const data = await caller.getUser()





  return (
    <div>
 {JSON.stringify(data)}
   
      
    </div>
  )
}
