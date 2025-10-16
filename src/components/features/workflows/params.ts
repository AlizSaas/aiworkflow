import {parseAsInteger,parseAsString} from 'nuqs/server'
import {PAGINATION} from '@/config/constants'

export const workflowsParams = {
    page: parseAsInteger.withDefault(PAGINATION.DEFAULT_PAGE).withOptions({clearOnDefault: true}),
    pageSize: parseAsInteger.withDefault(PAGINATION.DEFAULT_PAGE_SIZE).withOptions({clearOnDefault: true}),
    search: parseAsString.withDefault('').withOptions({clearOnDefault: true}),
} // explain what this code does 
// This code defines a set of parameters for handling pagination and search functionality in a web application. It uses the 'nuqs' library to parse query parameters from the URL. The 'workflowsParams' object includes three parameters: 'page', 'pageSize', and 'search'. Each parameter has a default value and options to clear the parameter from the URL if it matches the default value. The 'page' parameter defaults to a predefined constant for the default page number, 'pageSize' defaults to a predefined constant for the number of items per page, and 'search' defaults to an empty string. This setup allows for easy management of pagination and search features in the application's workflows section.