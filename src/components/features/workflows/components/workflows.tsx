'use client'
import { EmptyView, EntityContainer, EntityHeader, EntityItem, EntityList, EntityPagination, EntitySearch, ErrorView, LoadingView } from "@/components/entity-components"
import { useCreateWorkflow, useRemoveWorkFlow, useSuspenseWorkflows } from "../hooks/use-workflows"
import { useUpgradeModal } from "@/hooks/use-uprade-modal"
import { useRouter } from "next/navigation"
import { useWorkflowsParams } from "../hooks/use-workflows-params"
import { useEntitySearch } from "@/hooks/use-entity-search"
import type  {Workflow} from '@/generated/prisma'
import { WorkflowIcon } from "lucide-react"
import {formatDistanceToNow}from 'date-fns'


export const WorkFlowsSearch = () => {
    const [params,setParams] = useWorkflowsParams()
    const {onSearcheValue,searchValue} = useEntitySearch({
        params,
        setParams,
        
    })
    return (
        <EntitySearch
        value={searchValue}
        onChange={onSearcheValue}
        placeholder="Search workflows"
        />
    )
}

export const WorkFlowsList = () => {
    const workflows = useSuspenseWorkflows()
   
    

    return (
     <EntityList
     items={workflows.data.items}
     getKey={(workflows) => workflows.id}
     renderItem={(workflows) => <WorkflowItem key={workflows.id} data={workflows} />}
     emptyView={<WorkflowsEmpty />}


     
     
     />
    )
}

export const WorkFlowsHeader = ({disabled}: {disabled?: boolean}) => {
    const router = useRouter()
    const createdWorkFlow = useCreateWorkflow()
    const { handleError, modal } = useUpgradeModal()

    const handleCreate = () => {
        createdWorkFlow.mutate(
            undefined,
            {
                onSuccess: (data) => {
 router.push(`/workflows/${data.id}`)
                },
                onError:(error) => {
                  handleError(error)
                }
            }
        )
    }
    return (
        <>
        {modal}
        <EntityHeader
        newButtonLabel="New Workflow"
        disabled={disabled}
        isCreating={createdWorkFlow.isPending}
        onNew={handleCreate}
        
        title="Create and manage your workflows"/>
         </>
    )
}
export const WorkflowsPagination = () => {
    const workflows = useSuspenseWorkflows()
    const [params,setParams] = useWorkflowsParams()

    return (
       <EntityPagination
       disabled={workflows.isRefetching}
       totalPages={workflows.data.totalPages}
       page={workflows.data.page}
       onPageChange={(page) => setParams({...params,page})}
       
       
       
       />
    )
}

export const WorkflowLoading = () => {
    return (
        <LoadingView message="Loading workflows..." />
    )
}

export const WorkflowError = () => {
    return (
        <ErrorView message="Could not load workflows" />
    )
}
export const WorkflowsEmpty = () => {
    const router = useRouter()
    const createWorkflow = useCreateWorkflow()
        const { handleError, modal } = useUpgradeModal()
          const handleCreate = () => {
        createWorkflow.mutate(
            undefined,
            {
                onError:(error) => {
                  handleError(error)
                },
                onSuccess:(data) => {
                  
                    router.push(`/workflows/${data.id}`)
                }

            }
        )
    }

    return (
        <>
        {modal}
        <EmptyView
         message="No workflows found" onNew={handleCreate} />
        </>
    )
}

export const WorkflowItem = ({data}: {data: Workflow} ) => {
    const  removeWorkFlow = useRemoveWorkFlow()
    const handleRemove = () => {
        removeWorkFlow.mutate({id: data.id})
    }
    return (
        <EntityItem
        href={`/workflows/${data.id}`}
        title={data.name}
        substitle={<>
        updated {formatDistanceToNow(new Date(data.updatedAt),{addSuffix:true})} {' '}
        &bull; Created{" "} {formatDistanceToNow(new Date(data.createdAt),{addSuffix:true})}
        </>}
        image={<div className="size-8 flex items-center justify-center">
            <WorkflowIcon className="size-5 text-muted-foreground" />

        </div>}
        onRemove={handleRemove}
        isRemoving={removeWorkFlow.isPending}

        />
        
    )
}

















export const WorkFlowsContainer = ({children}:{children: React.ReactNode} ) =>{

    return (
        <EntityContainer
        header={ <WorkFlowsHeader  />}
        search={<WorkFlowsSearch />}
        pagination={<WorkflowsPagination />}
        
        
        >
            {children}

        </EntityContainer>
    )
}

