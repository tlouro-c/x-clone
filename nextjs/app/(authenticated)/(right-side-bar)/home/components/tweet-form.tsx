"use client";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import {Textarea} from "@/components/ui/textarea";
import React, {startTransition, useActionState, useEffect, useState} from "react";
import {createTweetAction} from "@/actions/tweet-actions";
import Loader from "@/components/ui/loader";
import Link from "next/link";
import {
    useFeedContent
} from "@/app/(authenticated)/(right-side-bar)/home/components/feed-content-provider";
import {UserAvatar} from "@/app/(authenticated)/(right-side-bar)/[userId]/components/user-avatar";

const formSchema = z.object({
    tweetContent: z.string().min(1, "Tweet cannot be empty").max(280, "Tweet exceeds 280 characters"),
})

interface TweetFormProps {
    userId: string
    userAvatar: string | null
}

export default function TweetForm({userId, userAvatar} : TweetFormProps) {

    const { setFeedContent } = useFeedContent()
    const [value, setValue] = useState<string>("")
    const [state, action, isPending] = useActionState(createTweetAction, null)

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value);
    };

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            tweetContent: "",
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {

        startTransition( () => {
            action({userId: userId, content:values.tweetContent})
            form.reset()
            setValue("")
        })
    }

    useEffect(() => {
        if (!state) return
        const newTweetActivity = state?.response
        if (newTweetActivity) {
            setFeedContent((prevFeedContent) => ({
                ...prevFeedContent,
                tweetActivityList: [
                    newTweetActivity,
                    ...prevFeedContent.tweetActivityList,
                ],
            }));
        }
    }, [setFeedContent, state]);


    return (
        <div className={"flex items-start p-3 gap-1 border-b"}>
            <Link href={`/${userId}`}>
                <UserAvatar avatarSrc={userAvatar}/>
            </Link>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex-1">
                    <FormField
                        control={form.control}
                        name="tweetContent"
                        render={({field}) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea
                                        onInput={handleChange}
                                        placeholder="What is happening?!"
                                        className="resize-none border-0 focus-visible:ring-0 shadow-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <div className={"border-b"}></div>
                    <div className={"w-full flex justify-end gap-5 items-center"}>
                        {!state?.ok && (
                            <div className="grid gap-2 text-sm text-rose-500"> {state?.detail} </div>
                        )}
                        <div className="flex justify-between items-center ">
                            <span
                                className={`text-sm text-gray-500 ${value.length > 260 && value.length <= 280 ? 'text-yellow-600' : ''} ${value.length > 280 ? 'text-red-500' : ''}`}>
                              {value.length}/280
                            </span>
                        </div>
                        <Button type="submit" className={"rounded-full font-bold"} disabled={value.length > 280}>
                            {!isPending ? 'Post' : <Loader className={"border"}/>}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>

    )
}