import type {TweetActivityInterface} from '@/types/interfaces'
import {TweetProvider} from "@/app/(authenticated)/(right-side-bar)/home/components/tweet-context";
import {TweetContent} from "@/app/(authenticated)/(right-side-bar)/home/components/tweet-content";

interface TweetProps {
    authenticatedUserId: string
    tweetActivity: TweetActivityInterface
}

export default function Tweet({ tweetActivity, authenticatedUserId }: TweetProps) {

    return (
        <TweetProvider
            value={ {
               tweetActivity: tweetActivity,
                authenticatedUserId: authenticatedUserId
        } }>
            <TweetContent/>
        </TweetProvider>

    )

}