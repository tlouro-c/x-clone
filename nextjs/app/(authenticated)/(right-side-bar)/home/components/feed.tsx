"use client";

import {startTransition, useActionState, useEffect} from "react";
import Tweet from "@/app/(authenticated)/(right-side-bar)/home/components/tweet";
import {fetchFeedContentAction} from "@/actions/tweet-actions";
import {
    FeedContentInterface,
    useFeedContent
} from "@/app/(authenticated)/(right-side-bar)/home/components/feed-content-provider";
import Loader from "@/components/ui/loader";
import * as React from "react";

interface FeedProps {
    userId: string
}

export default function Feed({userId}: FeedProps) {

    const { feedContent, setFeedContent } = useFeedContent();
    const [state, action, isPending] = useActionState(fetchFeedContentAction, [])

    useEffect(() => {
        if (feedContent.type == "For you") {
            startTransition(() => action({ type: "for-you", queryString: `user=${userId}&page=1` }))
        } else {
            startTransition(() => action({ type: "following", queryString: `user=${userId}&page=1` }))
        }
    }, [action, feedContent.type, userId]);

    useEffect(() => {
        setFeedContent((prevFeedContent: FeedContentInterface) => ({
            ...prevFeedContent, // Spread previous values
            tweetActivityList: state, // Update tweetActivityList with the new state
        }));
    }, [setFeedContent, state]);

    return (
        <div className={"flex flex-col"}>
            {isPending && (
                <div className="mt-20 inset-0 flex items-center justify-center z-10">
                    <Loader/>
                </div>
            )}
            {feedContent.tweetActivityList != null && feedContent.tweetActivityList.map((tweetActivity) => (
                <Tweet
                    key={tweetActivity.id}
                    tweetActivity={tweetActivity}
                    authenticatedUserId={userId}
                />
            ))}
        </div>
    );
}