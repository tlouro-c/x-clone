"use client"

import Link from "next/link";
import {Heart, Repeat2} from "lucide-react";
import {formatDate} from "@/lib/utils";
import {TweetEditMenu} from "@/app/(authenticated)/(right-side-bar)/home/components/tweet-edit-menu";
import {TweetRetweet} from "@/app/(authenticated)/(right-side-bar)/home/components/tweet-retweet";
import {TweetLike} from "@/app/(authenticated)/(right-side-bar)/home/components/tweet-like";
import {useTweet} from "@/app/(authenticated)/(right-side-bar)/home/components/tweet-context";
import {UserAvatar} from "@/app/(authenticated)/(right-side-bar)/[userId]/components/user-avatar";

export const TweetContent = () => {

    const { tweetContext } = useTweet()

    const tweetActivity = tweetContext.tweetActivity
    const tweet = tweetActivity.tweet

    return (
        <div className={`flex flex-col p-3 border-b ${tweetActivity.type == "DELETED" ? "hidden" : ""}`}>
            {tweetActivity.type == "RETWEET" && (
                <Link className={"flex gap-2 hover:underline"} href={`/${tweetActivity.user.id}`}>
                    <Repeat2 className={"text-neutral-500 ms-6"} size={15}/>
                    <p className={"text-xs text-neutral-500 font-bold"}>{tweetActivity.user.name} reposted</p>
                </Link>
            )}
            {tweetActivity.type == "LIKE" && (
                <Link className={"flex gap-2 hover:underline"} href={`/${tweetActivity.user.id}`}>
                    <Heart className={"text-neutral-500 ms-6"} size={15}/>
                    <p className={"text-xs text-neutral-500 font-bold"}>{tweetActivity.user.name} liked this</p>
                </Link>
            )}
            <div className={"flex gap-2"}>
                <UserAvatar avatarSrc={tweet.user.avatar}/>
                <div className={"flex flex-col gap-1 flex-1 pt-1"}>
                    <div className={"flex gap-1"}>
                        <Link href={`/${tweet.user.id}`}
                              className={"text-sm font-bold hover:underline"}> {tweet.user.name} </Link>
                        <Link href={`/${tweet.user.id}`}
                              className={"text-sm text-neutral-500"}> @{tweet.user.username} </Link>
                        <p className={"text-neutral-500 text-sm"}> · </p>
                        <p className={"text-sm text-neutral-500"}>{formatDate(tweet.createdAt)}</p>
                        {tweet.user.id == tweetContext.authenticatedUserId && (
                            <TweetEditMenu/>
                        )}
                    </div>
                    <div>
                        <p className={"text-sm font-medium leading-none"}> {tweet.content} </p>
                    </div>
                    <div className={"flex gap-20 items-center h-6 ps-1"}>
                        {/*<Button*/}
                        {/*    size="sm"*/}
                        {/*    aria-label="Toggle"*/}
                        {/*    className={"h-4 p-0 px-[6px] shadow-none text-neutral-500 hover:text-sky-400 bg-transparent hover:bg-transparent data-[state=on]:bg-transparent"}>*/}
                        {/*    <MessageCircle className="h-4 w-4"/>*/}
                        {/*    {tweet.comments}*/}
                        {/*</Button>*/}
                        <TweetRetweet/>
                        <TweetLike/>
                    </div>
                </div>
            </div>

        </div>
    )
}