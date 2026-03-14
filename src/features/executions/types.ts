import type { Inngest,GetStepTools } from "inngest";

export type WorkflowContext = Record<string,unknown>;

export type StepTools = GetStepTools<Inngest.Any>;

export interface NodeExecutorParams<t = Record<string,unknown>> {
    data:t;
    nodeId:string;
    context: WorkflowContext;
    step:StepTools
}

export type NodeExecutor<t=Record<string,unknown>> = (
    params: NodeExecutorParams<t>,
)=> Promise<WorkflowContext>;