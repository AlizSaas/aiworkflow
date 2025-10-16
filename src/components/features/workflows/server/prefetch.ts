import type { inferInput } from "@trpc/tanstack-react-query";
import { prefetch,trpc } from "@/trpc/server";

type Input = inferInput<typeof trpc.workflows.all>
// prefetch all workflows

export const prefetchWorkflows = async (params: Input) => {

    return prefetch(trpc.workflows.all.queryOptions(params))
}