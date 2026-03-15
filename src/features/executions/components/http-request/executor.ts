import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, {type Options as kyOptions } from "ky";
import Handlebars from "handlebars";
type HttpRequestData = {
    variableName:string,
    endpoint:string,
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?:string,
};

Handlebars.registerHelper("json",(ctx)=>{
    const JsonString = JSON.stringify(ctx,null,2);
    return new Handlebars.SafeString(JsonString);
})

export const httpRequestExecutor: NodeExecutor<HttpRequestData>=
async ({
    data,
    nodeId,
    context,
    step
})=>{
    
    if(!data.endpoint){
        // error state for http request
        throw new NonRetriableError("Http request node: no endpoint configured");
    }
    if(!data.variableName){
        // error state for http request
        throw new NonRetriableError("Variable name not configured");
    }
    if(!data.method){
        // error state for http request
        throw new NonRetriableError("method name not configured");
    }
    const result = await step.run("Http-request",async ()=>{
        const endpoint = Handlebars.compile(data.endpoint)(context);
        
        const method = data.method || "GET";

        const options: kyOptions = {method};

        if(["POST","PUT","PATCH"].includes(method)){  
                const resolved = Handlebars.compile(data.body|| "{}")(context);
                JSON.parse(resolved);
                options.body = resolved;
               
                options.headers={
                    "Content-Type":"application/json"
                }
        }

        const response = await ky(endpoint, options);
        const contentType = response.headers.get("content-type");
        const responseData = contentType?.includes("application/json")? await response.json():await response.text();
        
        const responsePayload = {
            httpResponse:{
                status:response.status,
                statusText: response.statusText,
                data: responseData
            }
        }
        return {
            ...context,
            [data.variableName]:responsePayload
        }
    });

    return result;
}