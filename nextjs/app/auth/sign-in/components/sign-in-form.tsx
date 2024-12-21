"use client"

import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import React, {startTransition, useActionState, useState} from "react";
import {signIn} from "@/actions/auth-actions";
import Loader from "@/components/ui/loader";
import Link from "next/link";

export const SignInForm = () => {

    const [state, formAction, isPending] = useActionState(signIn, null)

    const [formData, setFormData] = useState(
        {login: '', password: ''}
    );

    const handleChange = (e : React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> ) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        startTransition(() => {
            formAction({
                ...formData,
                password: btoa(formData.password),
            })
        })
    };

    return (
        <form className={`grid gap-4 transition-opacity  ${isPending ? "opacity-50 pointer-events-none" : ""}`} onSubmit={handleSubmit} method={"post"}>
            <div className="grid gap-2">
                <Label htmlFor="login">Email / Username</Label>
                <Input
                    id="login"
                    name="login"
                    value={formData.login}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="grid gap-2">
                <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    {/*<Link*/}
                    {/*    href="/forgot-password"*/}
                    {/*    className="ml-auto inline-block text-sm underline"*/}
                    {/*>*/}
                    {/*    Forgot your password?*/}
                    {/*</Link>*/}
                </div>
                <Input id="password" type="password" name="password" value={formData.password} onChange={handleChange}
                       required/>
            </div>
            {state && (
                <div className="grid gap-2 text-sm text-rose-500"> {state} </div>
            )}
            <Button type="submit" className={`w-full`} disabled={isPending}>
                {!isPending ? 'Sign In' : <Loader className={"border"}/>}
            </Button>
            <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/auth/sign-up" className="underline">
                    Sign up
                </Link>
            </div>
        </form>
    )
}