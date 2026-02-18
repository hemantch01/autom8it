import { headers } from "next/headers";
import { auth } from "./auth";
import {redirect} from "next/navigation";

export  const requireAuth  = async ()=>{
    console.error("hi before seeions")
    const session =  await auth.api.getSession({
        headers: await headers()
    });
    console.log(session);
    if(!session){
        redirect("/login");
    }
    return session;
}

export const requireUnAuth = async ()=>{
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if(session){
        redirect("/");
    }
}