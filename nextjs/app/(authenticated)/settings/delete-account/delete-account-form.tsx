"use client"

import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel} from "@/components/ui/form";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {
    AlertDialog, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import React, {startTransition, useActionState} from "react";
import {deleteUserAccountAction} from "@/actions/user-actions";
import Loader from "@/components/ui/loader";


const deleteAccountFormSchema = z.object({
    password: z.string()
})

type DeleteAccountFormValues = z.infer<typeof deleteAccountFormSchema>

interface AccountDeleteFormProps {
    userId: string
}


export const DeleteAccountForm = ({userId}: AccountDeleteFormProps) => {

    const [state, formAction, isPending] = useActionState(deleteUserAccountAction, null)

    const form = useForm<DeleteAccountFormValues>({
        resolver: zodResolver(deleteAccountFormSchema),
    })

    function onSubmit(data: DeleteAccountFormValues) {
        startTransition(() => {
            formAction({
                id: userId,
                password: data.password,
            })
        })
    }

    return (
        <Form {...form}>
            <form className={"flex flex-col"} id={"delete-account-form"} onSubmit={form.handleSubmit(onSubmit)} method={"delete"}>
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem className={"space-y-4"}>
                            <div className={"space-y-1"}>
                                <FormLabel>Delete your account</FormLabel>
                                <FormDescription>
                                    Permanently erase your account and data
                                </FormDescription>
                            </div>

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button>Delete</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader className={"space-y-5"}>
                                        <div className={"space-y-2"}>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete your
                                                account and remove your data from our servers.
                                            </AlertDialogDescription>
                                        </div>
                                        <div className={"flex flex-col gap-2"}>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input type={"password"} required={true} placeholder="Confirm your password" {...field} value={field.value ?? ""}/>
                                            </FormControl>
                                        </div>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter className={"flex items-center"}>
                                        {state && (
                                            <div className={`grid gap-2 text-sm text-rose-500`}> {state} </div>
                                        )}
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <Button
                                            form={"delete-account-form"}
                                            type={"submit"}
                                            variant={"destructive"}
                                            disabled={isPending}
                                        >
                                            {!isPending ? 'Delete account' : <Loader className={"border"}/>}
                                        </Button>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>


                        </FormItem>
                    )}
                />
            </form>
        </Form>
    )
}