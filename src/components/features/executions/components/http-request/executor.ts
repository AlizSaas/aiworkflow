import type { NodeExecutor } from "@/components/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, {type Options as KyOptions} from "ky";
import Handlebars from "handlebars";
import { httpRequestChannel } from "@/inngest/channels/http-request";

Handlebars.registerHelper('json', function(context) {
    const jsonString = JSON.stringify(context);
     const safeString =  new Handlebars.SafeString(jsonString);
        return safeString;
}); // Register 'json' helper

type HttpsRequestData  = {
         variableName: string;
        endpoint: string;
        method:  "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
        body?: string;
}

export const httpRequestExecutor: NodeExecutor<HttpsRequestData> = async ({context,nodeId,step,data,publish}) => {
        console.log('the node is ', nodeId);
 
     await publish(
        httpRequestChannel().status({
                nodeId, // publish node ID for tracking
                status:'loading'
        })
     )

        if(!data.endpoint) {
                await publish(
                        httpRequestChannel().status({
                                nodeId,
                                status:'error'
                        })
                     )
                throw new NonRetriableError("No endpoint provided for HTTP request");
        }
 if(!data.variableName) {
                await publish(
                        httpRequestChannel().status({
                                nodeId,
                                status:'error'
                        })
                     )
                throw new NonRetriableError("No variable name provided for HTTP request");
        }
        if(!data.method) {
                await publish(
                        httpRequestChannel().status({
                                nodeId,
                                status:'error'
                        })
                     )
                throw new NonRetriableError("No method provided for HTTP request");
        }

try {
const result  = await step.run('http-request', async () => {
        const endpoint = Handlebars.compile(data.endpoint)(context);
        console.log("🚀 Executing HTTP Request to:", endpoint);
        const method  = data.method

        const options: KyOptions = {method};
        if(["POST","PUT","PATCH"].includes(method) && data.body) {
    const resolved  = Handlebars.compile(data.body)(context);
    JSON.parse(resolved); // Validate JSON
                options.body = resolved; // Set body only if it's valid JSON

                     options.headers = {
                        'Content-Type': 'application/json'
                }

        }

        const response = await ky(endpoint,options)
        const contentType  = response.headers.get("content-type") 
        const responseData  = contentType && contentType.includes("application/json") ? await response.json() : await response.text();
         const responsePayload  = {
                    httpResponse:{
                        status: response.status,
                        data: responseData,
                        statusText: response.statusText
                }
        }

        return {
                ...context,
                [data.variableName]: responsePayload
        }
}) 

        await publish(
                httpRequestChannel().status({
                        nodeId,
                        status:'success'
                })
        );

return result;

} catch (error) {
        await publish(
                httpRequestChannel().status({
                        nodeId,
                        status:'error'
                })
        );
        throw error;
}
}
