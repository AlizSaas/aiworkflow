'use client'

// hook to fetch all workflows using suspense
import { useTRPC} from '@/trpc/client';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

import { toast } from 'sonner';
import { useWorkflowsParams } from './use-workflows-params';

export const useSuspenseWorkflows = () => {
        const trpc = useTRPC()
        const [params] = useWorkflowsParams()

        return useSuspenseQuery(trpc.workflows.getMany.queryOptions(params))
} // hook to fetch  all workflows using suspense in the client side


// hook to create a new work flow

export const useCreateWorkflow = () => {
       
    const trpc = useTRPC()
    const queryClient = useQueryClient()
    return useMutation(trpc.workflows.create.mutationOptions({
        onSuccess:(data) => {
                toast.success(`Workflow ${data.name} created successfully`)
               
                queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}))
            },
            onError: (error) => {
                toast.error(`Error creating workflow: ${error.message}` )
            }

        
        
        
        
        }),

            
)}
// hook to create a new work flow
