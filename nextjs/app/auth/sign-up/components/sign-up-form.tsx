"use client"

import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import React, {startTransition, useActionState, useState} from "react";
import {signUp} from "@/actions/auth-actions";
import Loader from "@/components/ui/loader";
import Link from "next/link";

export const SignUpForm = () => {

    const [state, formAction, isPending] = useActionState(signUp, null)

    const [formData, setFormData] = useState(
        {name: '', username: '', email: '', password: '', repeatPassword: ''}
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
                repeatPassword: btoa(formData.repeatPassword)
            })
        })
    };

    return (
        <form className={`grid gap-4 transition-opacity ${isPending ? "opacity-50 pointer-events-none" : ""}`} onSubmit={handleSubmit} method={"post"}>
            <div className="grid gap-2">
                <Label htmlFor="username">Name</Label>
                <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="m@example.com"
                    required
                />
            </div>
            <div className="grid gap-2">
                <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                </div>
                <Input id="password" type="password" name="password" value={formData.password} onChange={handleChange}
                       required/>
            </div>
            <div className="grid gap-2">
                <div className="flex items-center">
                    <Label htmlFor="repeatPassword">Confirm Password</Label>
                </div>
                <Input id="repeatPassword" type="password" name="repeatPassword" value={formData.repeatPassword}
                       onChange={handleChange} required/>
            </div>
            {state && (
                <div className="grid gap-2 text-sm text-rose-500"> {state} </div>
            )}
            <Button type="submit" className={`w-full`} disabled={isPending}>
                {!isPending ? 'Sign Up' : <Loader className={"border"}/>}
            </Button>
            <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link href="/auth/sign-in" className="underline">
                    Sign in
                </Link>
            </div>
        </form>
    )
}