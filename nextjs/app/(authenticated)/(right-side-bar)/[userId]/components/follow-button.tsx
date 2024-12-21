"use client"

import React, {startTransition, useActionState, useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {followAction} from "@/actions/user-actions";
import Loader from "@/components/ui/loader";

interface FollowButtonProps {
    followerId: string;
    followedId: string;
    initialFollowState: boolean;
    className?: string
}

export const FollowButton = ({followerId, followedId, initialFollowState, className}: FollowButtonProps) => {

    const [state, action, isPending] = useActionState(followAction, null)
    const [isFollowed, setFollowState] = useState(initialFollowState)

    const handleClick = (buttonType: string) => (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault()

        startTransition(() => {
            action({
                followedUserId: followedId,
                followerUserId: followerId,
                type: buttonType
            })
        })
    }

    useEffect(() => {
        setFollowState(state?.type == "follow")
    }, [state?.type])

    useEffect(() => {
        setFollowState(initialFollowState);
    }, [initialFollowState])

    if (!isFollowed) {
        return (
            <Button onClick={handleClick("follow")} className={`${!state?.ok ? "border-rose-600" : ""} ${className} font-bold rounded-full`} disabled={isPending}>
                {!isPending ? 'Follow' : <Loader className={"border"}/>}
            </Button>
        )
    } else {
        return (
            <Button variant={"outline"} onClick={handleClick("unfollow")} disabled={isPending}
                    className={`${!state?.ok ? "border-rose-600" : ""} ${className} group border-muted hover:bg-red-950/30 hover:border hover:border-red-900 font-bold rounded-full`}>
                <span className="group-hover:hidden w-16 flex justify-center items-center">
                    {!isPending ? 'Following' : <Loader className={"border"}/>}
                </span>
                <span className="hidden group-hover:flex text-red-600 w-16  justify-center items-center">
                    {!isPending ? 'Unfollow' : <Loader className={"border"}/>}
                </span>
            </Button>
        )
    }

}