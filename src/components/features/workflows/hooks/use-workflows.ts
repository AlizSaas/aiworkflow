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


// hook to delete a workflow
export const useRemoveWorkFlow = () => {
    const trpc = useTRPC()
    const queryClient = useQueryClient()
    return useMutation(trpc.workflows.remove.mutationOptions({
        onSuccess:(data) => {
                toast.success(`Workflow ${data.name} deleted successfully`)
                queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({})) // invalidate getMany query to refetch
                queryClient.invalidateQueries(trpc.workflows.getOne.queryFilter({id: data.id})) // invalidate getOne query if exists
        },  
        onError: (error) => {


                toast.error(`Error deleting workflow: ${error.message}` )
        }
    }))
} // hook to delete a workflow



export const useSuspenseWorkflow = (id:string) => {
    const trpc = useTRPC()
    return useSuspenseQuery(trpc.workflows.getOne.queryOptions({id}))
} //a hook to fetch single workflow using suspense


export const useUpdateworkflowName = () => {
    const queryClient = useQueryClient()
    const trpc = useTRPC()
    return useMutation(
        trpc.workflows.updateName.mutationOptions({
            onSuccess:(data) => {
                toast.success(`Workflow name updated to ${data.name}`)
                queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({})) // invalidate getMany query to refetch
                queryClient.invalidateQueries(trpc.workflows.getOne.queryOptions({id:data.id})) // invalidate getOne query to refetch



            },
            onError: (error) => {
                toast.error(`Error updating workflow name: ${error.message}` )
            }
            
            

        })
    )

} // hook to update workflow name