import {useQueryStates} from 'nuqs'
import {workflowsParams} from '../params'

export const useWorkflowsParams = () => {
    return useQueryStates(workflowsParams)
} // returns {page, pageSize, search}
// This code defines a custom React hook 'useWorkflowsParams' that utilizes the 'useQueryStates' function from the 'nuqs' library to manage query parameters related to workflows. By passing in the 'workflowsParams' object, which defines parameters for pagination and search, the hook returns an object containing the current states of these parameters: 'page', 'pageSize', and 'search'. This allows components to easily access and manipulate these query parameters, enabling dynamic filtering and pagination of workflow data based on user input or URL changes.