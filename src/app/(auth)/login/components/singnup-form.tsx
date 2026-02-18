"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod"
import {z} from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const signupSchema = z.object({
    email: z.string().email("please enter valid email address"),
    password:z.string().min(5,"password is required min 5"),
    confirmPassword:z.string()
}).refine((data)=> data.password===data.confirmPassword,{
    message: "password don't match",
    path:["confirmPassword"]
})
type SignupFormValues = z.infer<typeof signupSchema>;


export function SignupForm(){
   const router = useRouter();

    const form = useForm({
        resolver:zodResolver(signupSchema),
        defaultValues:{
            email:"",
            password:"",
            confirmPassword:""
        }
    });

            const onSubmit = async (values: SignupFormValues) => {
        try {
            await authClient.signUp.email(
            {
                name:values.email,
                email: values.email,
                password: values.password,
                callbackURL: "/",
            },
            {
                onSuccess: () => router.push("/"),
                onError: (ctx) => {toast.error(ctx.error.message)},
            }
            );
        } catch (err) {
            toast.error("Signup failed. Check console.");
            console.error(err);
        }
        };


    const isPending = form.formState.isSubmitting;
    return <div className="flex flex-col gap-6">
        <Card>
            <CardHeader className="text-center">
                <CardTitle>
                    Get Started
                </CardTitle>
                <CardDescription>
                    Create Your Account to Get Started
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} >
                        <div className="grid gap-6">
                            <div className="flex flex-col gap-4">
                                <Button 
                                variant={"outline"}
                                className="w-full"
                                type="button"
                                disabled={isPending}>
                                    Continue with Google
                                </Button>
                                <Button 
                                variant={"outline"}
                                className="w-full"
                                type="button"
                                disabled={isPending}>
                                    Continue with GitHub
                                </Button>
                            </div>
                            <div className="grid gap-6">
                                <FormField
                                control={form.control}
                                name ="email"
                                render={({field})=>(
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                            type="email"
                                            placeholder="hemantchaudhary905@gmail.com"
                                            {...field}/>
                                        </FormControl>
                                    </FormItem>
                                )}
                                />
                                <FormField
                                control={form.control}
                                name ="password"
                                render={({field})=>(
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                            type="password"
                                            placeholder="*********"
                                            {...field}/>
                                        </FormControl>
                                    </FormItem>
                                )}
                                />
                                 <FormField
                                control={form.control}
                                name ="confirmPassword"
                                render={({field})=>(
                                    <FormItem>
                                        <FormLabel>confirmPassword</FormLabel>
                                        <FormControl>
                                            <Input
                                            type="password"
                                            placeholder="*********"
                                            {...field}/>
                                        </FormControl>
                                    </FormItem>
                                )}
                                />
                                <Button
                                type="submit"
                                className="w-full"
                                disabled={isPending}>
                                    Sign up
                                </Button>
                                <div className="text-center text-sm">
                                    Already have an account?{" "}
                                    <Link href={"/login"}
                                    className="underline underline-offset-4">
                                        Login
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>

    </div>
}
