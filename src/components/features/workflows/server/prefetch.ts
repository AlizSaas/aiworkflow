import type { inferInput } from "@trpc/tanstack-react-query";
import { prefetch,trpc } from "@/trpc/server";


type Input = inferInput<typeof trpc.workflows.getMany>
// prefetch all workflows

export const prefetchWorkflows = async (params: Input) => {
    return prefetch(trpc.workflows.getMany.queryOptions(params))
} // explain what this code does
// This code defines an asynchronous function 'prefetchWorkflows' that takes an input parameter of type 'Input', which is inferred from the input type of the 'getMany' method in the 'workflows' router of a tRPC server. The function uses the 'prefetch' utility from the tRPC library to prefetch data for the 'getMany' query with the provided parameters. This is typically used to load data in advance, improving performance and user experience by reducing wait times when the data is actually needed in the application.

// best to use in use client side components to prefetch data before rendering
// Example usage in a React component:
