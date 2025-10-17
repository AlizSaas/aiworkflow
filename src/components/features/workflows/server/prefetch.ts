import type { inferInput } from "@trpc/tanstack-react-query";
import { prefetch,trpc } from "@/trpc/server";


type Input = inferInput<typeof trpc.workflows.getMany>
// prefetch all workflows

export const prefetchWorkflows = async (params: Input) => {
   
    return prefetch(trpc.workflows.getMany.queryOptions(params))
} 


export const prefetchWorkflow = async (id: string) => {
    return prefetch(trpc.workflows.getOne.queryOptions({ id }))

} //for server side prefetch a single workflow by id