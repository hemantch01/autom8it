"use client"
import { useSuspenseWorkflows } from "../hooks/use-workflows"

export const WorkFlowsList = ()=>{
    const workflows = useSuspenseWorkflows();

    return (
        <p>
            {JSON.stringify(workflows.data,null,2)}
        </p>
    )
}