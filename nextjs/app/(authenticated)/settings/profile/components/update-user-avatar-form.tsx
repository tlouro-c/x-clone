"use client"

import { z } from "zod"
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useForm} from "react-hook-form";
import {startTransition, useActionState, useEffect} from "react";
import {updateUserAvatarAction} from "@/actions/user-actions";
import {useAuthenticatedUser} from "@/app/(authenticated)/components/authenticated-user-context";
import {toast} from "sonner";

const formSchema = typeof window !== "undefined"
    ? z.object({
        file: z
            .instanceof(FileList)
            .refine((files) => files.length === 1, "Please select one file."),
    })
    : z.any();


export const UpdateUserAvatarForm = () => {

    const [state, action, isPending] = useActionState(updateUserAvatarAction, null)
    const {authenticatedUser, setAuthenticatedUser} = useAuthenticatedUser()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            file: undefined,
        },
    })

    const fileRef = form.register("file");

     function onSubmit(values: z.infer<typeof formSchema>) {

        const file = values.file?.item(0);
        if (!file) return

        if (file.size > 1000000) {
            toast("Please upload a file with less than 1MB")
            return;
        }
        startTransition(() => {
            action({
                userId: authenticatedUser.id,
                newAvatar: file,
            })
        });
    }

    useEffect(() => {
        if (!state) return

        if (state.ok) {
            setAuthenticatedUser(prevAuthenticatedUser => ({
                ...prevAuthenticatedUser,
                avatar: state.updatedUser?.avatar ?? null,
            }));
        }

        toast(state.ok ? "User avatar updated successfully" : state.detail)
    }, [setAuthenticatedUser, state]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="file"
                    render={() => (
                        <FormItem>
                            <FormLabel>Avatar</FormLabel>
                            <FormControl>
                                <Input required={true} type="file" placeholder="shadcn" {...fileRef} />
                            </FormControl>
                            <FormDescription>
                                This is your public display avatar.
                            </FormDescription>
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isPending}>
                    {isPending ? "Uploading..." : "Submit"}
                </Button>
            </form>
        </Form>
    )
};
