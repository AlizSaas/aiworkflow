import type { inferInput } from "@trpc/tanstack-react-query";
import { getQueryClient, trpc } from "@/trpc/server";


type Input = inferInput<typeof trpc.workflows.getMany>
// prefetch all workflows

export const prefetchWorkflows = async (params: Input) => {
    const queryClient = getQueryClient()
    return queryClient.prefetchQuery(trpc.workflows.getMany.queryOptions(params))
} 


export const prefetchWorkflow = async (id: string) => {
    const queryClient = getQueryClient()
    return queryClient.prefetchQuery(trpc.workflows.getOne.queryOptions({ id }))

} //for server side prefetch a single workflow by id