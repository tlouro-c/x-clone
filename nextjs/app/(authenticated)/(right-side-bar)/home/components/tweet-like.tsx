"use client"

import {Heart} from "lucide-react";
import {useTweet} from "@/app/(authenticated)/(right-side-bar)/home/components/tweet-context";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";
import {startTransition, useActionState, useEffect} from "react";
import {tweetInteractionAction, TweetInteractionOptions} from "@/actions/tweet-actions";


export const TweetLike = () => {

    const { tweetContext, setTweetContext } = useTweet()
    const tweet = tweetContext.tweetActivity.tweet
    const [state, action, isPending] = useActionState(tweetInteractionAction, null)

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        const options: TweetInteractionOptions = {
            type: tweet.isLikedByCurrentUser ? "dislike" : "like",
            tweetId: tweet.id
        }

        startTransition(() => {
            action(options)
        })
    }

    useEffect(() => {

        if (!state) {
            return
        }

        if (state?.ok) {
            setTweetContext(prevTweetContext => ({
                ...prevTweetContext,
                tweetActivity: {
                    ...prevTweetContext.tweetActivity,
                    tweet: {
                        ...prevTweetContext.tweetActivity.tweet,
                        isLikedByCurrentUser: state.type == "like",
                        likesCount: prevTweetContext.tweetActivity.tweet.likesCount + (state.type == "like" ? 1 : -1)

                    },
                },
            }))
            toast(state.message)
        } else {
            toast(state?.detail)
        }

    }, [setTweetContext, state]);


    return (
        <Button
            disabled={isPending}
            className={`rounded-full hover:bg-rose-600/20 h-6 w-6 p-0 bg-transparent hover:text-rose-600 ${tweet.isLikedByCurrentUser ? "text-rose-600" : "text-neutral-500"}`}
            onClick={handleClick}
            aria-checked={tweet.isLikedByCurrentUser}
            size="sm"
            aria-label="Toggle">
            {tweet.isLikedByCurrentUser ? <Heart fill={"red"}/> : <Heart/>}
            <span>{tweet.likesCount}</span>
        </Button>
    )
}