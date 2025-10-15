'use client'

import { Button } from "@/components/ui/button"
import { useTRPC } from "@/trpc/client"

import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query"
import { toast } from "sonner"









export default function Page() {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  
  const {data} = useQuery(trpc.getWorkFlows.queryOptions())
  const create = useMutation(trpc.createWorkflow.mutationOptions({
    onSuccess:() => {
      queryClient.invalidateQueries(trpc.getWorkFlows.queryOptions())
    }
  }))

  const testAi = useMutation(trpc.testAi.mutationOptions({
    onSuccess:(data) => {
      toast.success('AI Generated Text: ' + data.success)
    }
  }))

  return (
    <div className='flex items-center justify-center flex-col min-h-screen gap-y-6'>
 
      <div>
        {JSON.stringify(data,null,2)}
      </div>
      <Button
      disabled={create.isPending}
      onClick={() => create.mutate()}>
        Create Workflow
      </Button>
      <Button
      disabled={testAi.isPending}
      onClick={() => testAi.mutate()}>
        Test AI
      </Button>
      
    </div>
  )
}
