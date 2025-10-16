'use client'
import { EntityContainer, EntityHeader, EntityPagination, EntitySearch } from "@/components/entity-components"
import { useCreateWorkflow, useSuspenseWorkflows } from "../hooks/use-workflows"
import { useUpgradeModal } from "@/hooks/use-uprade-modal"
import { useRouter } from "next/navigation"
import { useWorkflowsParams } from "../hooks/use-workflows-params"
import { useEntitySearch } from "@/hooks/use-entity-search"


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
        <div className="flex-1 flex justify-center items-center">
            
            {JSON.stringify(workflows.data,null,2)}
        </div>
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

