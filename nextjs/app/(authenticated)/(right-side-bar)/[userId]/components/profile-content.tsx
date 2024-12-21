"use client"

import React, {startTransition, useActionState, useEffect, useState} from "react";
import {fetchProfileContentAction} from "@/actions/tweet-actions";
import ContentSwitchButton from "@/app/(authenticated)/(right-side-bar)/home/components/content-switch-button";
import Tweet from "@/app/(authenticated)/(right-side-bar)/home/components/tweet";
import Loader from "@/components/ui/loader";
import {TweetActivityInterface} from "@/types/interfaces";

interface ProfileContentProps {
    userId: string;
    authenticatedUserId: string;
}

export const ProfileContent = ({userId, authenticatedUserId} : ProfileContentProps) => {

    const [state, action, isPending] = useActionState(fetchProfileContentAction, null)
    const [typeOfContent, setTypeOfContent] = useState("Posts")
    const [tweetsList, setTweetsList] = useState<TweetActivityInterface[] | null>(null)

    useEffect(() => {
        startTransition(() => {
            action(`user=${userId}&tweets=true&retweets=true&page=1`)
        })
    }, [action, userId]);

    useEffect(() => {
        setTweetsList(state)
    }, [state]);

    const handleOnClick = (contentType: string)=> (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault()

        if (contentType == typeOfContent) {
            return
        }

        setTweetsList(null)
        setTypeOfContent(contentType)

        const queryString = contentType == "Posts" ? `user=${userId}&tweets=true&retweets=true&page=1` : `user=${userId}&likes=true&page=1`

        startTransition(() => {
            action(queryString)
        })
    }

    return (
        <div className={"flex flex-col"}>

            <div className={"flex border-b"}>
                <ContentSwitchButton disabled={isPending} isHighlighted={typeOfContent == "Posts"} className="flex-1 h-12"
                                     onClickAction={handleOnClick("Posts")}>
                    Posts
                </ContentSwitchButton>
                <ContentSwitchButton disabled={isPending} isHighlighted={typeOfContent == "Likes"} className="flex-1 h-12"
                                     onClickAction={handleOnClick("Likes")}>
                    Likes
                </ContentSwitchButton>
            </div>

            <div className={"flex flex-col"}>

                { isPending && (
                    <div className={"flex justify-center items-center m-10"}>
                        <Loader/>
                    </div>
                )}

                {tweetsList?.map(((tweetActivity, index) => (
                    <Tweet key={index}
                           tweetActivity={tweetActivity}
                           authenticatedUserId={authenticatedUserId}
                    />
                )))}
            </div>

        </div>
    )
}