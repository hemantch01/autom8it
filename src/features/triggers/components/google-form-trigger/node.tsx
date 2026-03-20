"use client";
import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { GoogleFormDialog } from "./dialog";

export const GoogleFormTrigger = memo((props:NodeProps)=>{
    const [dialogOpen, setDialogOpen ] = useState(false);
    const handleOpenSettings = ()=>{
        setDialogOpen(true);
    }
    return (
        <>
        <GoogleFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}/>
        <BaseTriggerNode
        {...props}
        icon = '/logos/google_form.svg'
        name="Google Form"
        onSettings = {handleOpenSettings}
        onDoubleClick={handleOpenSettings}
        />
        </>
    )
})