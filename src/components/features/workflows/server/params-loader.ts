import {createLoader} from 'nuqs/server'
import {workflowsParams} from '../params'


export const WorkflowsParamsLoader = createLoader(workflowsParams) // explain what this code does
// This code creates a parameter loader for handling query parameters related to workflows in a web application. It uses the 'createLoader' function from the 'nuqs' library, passing in the 'workflowsParams' object that defines the expected parameters (such as page, pageSize, and search). The resulting 'WorkflowsParamsLoader' can be used to easily parse and validate these parameters from incoming requests, ensuring that they conform to the specified types and default values defined in 'workflowsParams'.

// best to use in page.tsx to await the params before rendering the page
// Example usage in a Next.js page component:
/*
import {WorkflowsParamsLoader} from './params-loader'
export default async function Page({searchParams}) {
    const params = await WorkflowsParamsLoader(searchParams)
    // Now you can use 'params' to fetch and display workflows based on the provided query parameters
}
*/
