"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import React, {startTransition, useActionState} from "react";
import {updateUserAccountAction} from "@/actions/user-actions";
import Loader from "@/components/ui/loader";
import {useRouter} from "next/navigation";

const accountFormSchema = z.object({
    username: z
        .string()
        .nullish(),
    email: z
        .string()
        .nullish(),
    password: z
        .string()
        .nullish(),
    repeatPassword: z
        .string()
        .nullish()
})

type AccountFormValues = z.infer<typeof accountFormSchema>


interface AccountUpdateFormProps {
    userId: string
    userUsername: string
    userEmail: string
}

export function AccountUpdateForm( {userId, userUsername, userEmail} : AccountUpdateFormProps) {

    const router = useRouter()

    const [state, formAction, isPending] = useActionState(updateUserAccountAction, null)

    const defaultValues: Partial<AccountFormValues> = {
        username: userUsername,
        email: userEmail
    }

    const form = useForm<AccountFormValues>({
        resolver: zodResolver(accountFormSchema),
        defaultValues,
    })

    function onSubmit(data: AccountFormValues) {
        startTransition(() => {
            formAction({
                id: userId,
                username: data.username || null,
                email: data.email != userEmail ? data.email || null : null,
                password: data.password || null,
                repeatPassword: data.repeatPassword || null
            })
            router.refresh()
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="Your username" {...field} value={field.value ?? ""}/>
                            </FormControl>
                            <FormDescription>
                                Your username will be used to log in.
                            </FormDescription>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>E-mail</FormLabel>
                            <FormControl>
                                <Input placeholder="Your email" {...field} value={field.value ?? ""}/>
                            </FormControl>
                            <FormDescription>
                                This is your login email address.
                            </FormDescription>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type={"password"} placeholder="Your new password" {...field} value={field.value ?? ""} />
                            </FormControl>
                            <FormDescription>
                                Pick a secure password for your account.
                            </FormDescription>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="repeatPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm password</FormLabel>
                            <FormControl>
                                <Input placeholder={"Confirm your new password"} type={"password"} {...field} value={field.value ?? ""} />
                            </FormControl>
                            <FormDescription>
                                Pick a secure password for your account.
                            </FormDescription>
                        </FormItem>
                    )}
                />
                {state && (
                    <div className={`grid gap-2 text-sm ${state.ok ? "text-green-400" : "text-rose-500"}`}> {state.message} </div>
                )}
                <Button type="submit" disabled={isPending}>
                    {!isPending ? 'Update account' : <Loader className={"border"}/>}
                </Button>
            </form>
        </Form>
    )
}