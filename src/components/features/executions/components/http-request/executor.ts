import type { NodeExecutor } from "@/components/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, {type Options as KyOptions} from "ky";
type HttpsRequestData  = {
    endPoint?: string;
    method?:  "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    body?: string;
}

export const httpRequestExecutor: NodeExecutor<HttpsRequestData> = async ({context,nodeId,step,data}) => {
 
      console.log("🧩 HTTP Node Data:", data, "for Node ID:", nodeId);

    if(!data.endPoint) {
        throw new NonRetriableError("No endpoint provided for HTTP request");
    }


const result  = await step.run('http-request', async () => {
    const endpoint = data.endPoint!;
    const method  = data.method || "GET";

    const options: KyOptions = {method};
    if(["POST","PUT","PATCH"].includes(method) && data.body) {
        options.body = data.body;

    }

    const response = await ky(endpoint,options)
    const contentType  = response.headers.get("content-type") 
    const responseData  = contentType && contentType.includes("application/json") ? await response.json() : await response.text();

    return {
        ...context,
        httpResponse:{
            status: response.status,
            data: responseData,
            statusText: response.statusText
            

        }
    }


}) 

return result;
}