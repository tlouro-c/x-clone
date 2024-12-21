"use client"

import {Repeat2} from "lucide-react";
import {useTweet} from "@/app/(authenticated)/(right-side-bar)/home/components/tweet-context";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";
import {startTransition, useActionState, useEffect} from "react";
import {tweetInteractionAction, TweetInteractionOptions} from "@/actions/tweet-actions";


export const TweetRetweet = () => {

    const { tweetContext, setTweetContext } = useTweet()
    const tweet = tweetContext.tweetActivity.tweet
    const [state, action, isPending] = useActionState(tweetInteractionAction, null)

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        const options: TweetInteractionOptions = {
            type: tweet.isRetweetedByCurrentUser ? "unretweet" : "retweet",
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
                        isRetweetedByCurrentUser: state.type == "retweet",
                        retweetsCount: prevTweetContext.tweetActivity.tweet.retweetsCount + (state.type == "retweet" ? 1 : -1)

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
            className={`rounded-full hover:bg-green-500/20 h-6 w-6 p-0 bg-transparent hover:text-green-500 ${tweet.isRetweetedByCurrentUser ? "text-green-500" : "text-neutral-500"}`}
            onClick={handleClick}
            aria-checked={tweet.isRetweetedByCurrentUser}
            aria-label="Toggle">
            <Repeat2/>
            <span>{tweet.retweetsCount}</span>
        </Button>
    )
}