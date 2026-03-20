"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { generateGoogleFormScript } from "./utils";

interface GoogleFormTriggerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const GoogleFormDialog = ({ open, onOpenChange }: GoogleFormTriggerProps) => {
    const params = useParams();
    const workflowId = params.workflowId as string;

    // webhook url
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const webhookUrl = `${baseUrl}/api/webhook/google-form?workflowId=${workflowId}`

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(webhookUrl);
            toast.success("webhook URL copied to clipboard");
        }
        catch {
            toast.error("failed to copy URL");
        }
    }
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Google Form Trigger configuration</DialogTitle>
                    <DialogDescription>
                        use this webhook URL in your Google Form's App Script to trigger this workflow when form is submitted.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="webhook-url">
                            webhook URL
                        </Label>
                        <div className="flex gap-2" >
                            <Input
                                id="webhook-url"
                                value={webhookUrl}
                                readOnly
                                className="font-mono text-sm" />
                            <Button
                                type="button"
                                size={"icon"}
                                variant={"outline"}
                                onClick={copyToClipboard}
                            >
                                <CopyIcon className="size-4" />
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="rounded-lg bg-muted p-4 space-y-3">
                     <h4 className=" font-medium text-sm"> Google app script:</h4>   
                     <div className="flex items-center justify-center">
                        <Button
                        type="button"
                        variant={"outline"}
                        onClick={async ()=>{
                            const script =  generateGoogleFormScript(webhookUrl);

                            try{
                                await navigator.clipboard.writeText(script);
                                toast.success("script copied to clipboard");
                            }
                            catch(e){
                                toast.error("failed to copy Script to clipboard");
                            };
                        }}
                     >
                        <CopyIcon className="size-4 mr-2"/>
                        Copy Google App Script
                        </Button>
                     </div>       
                </div>
                <div className="rounded-lg bg-muted p-4 space-y-2">
                    <h4> Availabe Variables</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                        <li>
                            <code className="bg-background px-1 py-0.5 rounded">
                                {"{{googleForm.respondentEmail}}"}
                            </code>
                            -Respondent's email
                        </li>
                        <li>
                            <code className="bg-background px-1 py-0.5 rounded">
                                {"{{googleForm.respondes['Qusetion Name']}}"}
                            </code>
                            -Specific answer
                        </li>
                        <li>
                            <code className="bg-background px-1 py-0.5 rounded">
                                {"{{json googleForm.responses}}"}
                            </code>
                            -All responses as JSON
                        </li>

                    </ul>

                </div>
            </DialogContent>

        </Dialog>
    )
}