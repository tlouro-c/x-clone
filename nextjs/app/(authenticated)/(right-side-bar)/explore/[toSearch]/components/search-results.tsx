"use client"

import {User} from "@/app/(authenticated)/(right-side-bar)/[userId]/components/user";
import {useSearchContent} from "@/app/(authenticated)/(right-side-bar)/explore/components/search-content-context";
import {startTransition, useActionState, useEffect} from "react";
import {userSearchAction} from "@/actions/user-actions";
import Loader from "@/components/ui/loader";
import * as React from "react";
import {useAuthenticatedUser} from "@/app/(authenticated)/components/authenticated-user-context";
import {Button} from "@/components/ui/button";
import {tweetSearchAction} from "@/actions/tweet-actions";
import Tweet from "@/app/(authenticated)/(right-side-bar)/home/components/tweet";

interface SearchResultsProps {
    toSearch: string
}

export const SearchResults = ({toSearch}: SearchResultsProps) => {

    const { searchContent, setSearchContent } = useSearchContent()
    const [ peopleState, peopleAction, isPendingPeople ] = useActionState(userSearchAction, [])
    const [ tweetsState, tweetsAction, isPendingTweets ] = useActionState(tweetSearchAction, [])
    const { authenticatedUser } = useAuthenticatedUser()

    useEffect(() => {
        setSearchContent(prevFeedContent => ({
            ...prevFeedContent,
            peopleList: peopleState
        }))
    }, [peopleState, setSearchContent]);

    useEffect(() => {

        startTransition(() => {
            peopleAction(toSearch)
        })

    }, [peopleAction, searchContent.type, toSearch]);

    useEffect(() => {
        setSearchContent(prevFeedContent => ({
            ...prevFeedContent,
            tweetsList: tweetsState
        }))
    }, [tweetsState, setSearchContent]);

    useEffect(() => {

        startTransition(() => {
            tweetsAction(toSearch)
        })

    }, [tweetsAction, searchContent.type, toSearch]);

    const handleViewAllButton = (e: React.MouseEvent) => {
        e.preventDefault()
        setSearchContent(prevFeedContent => ({
            ...prevFeedContent,
            type: "People"
        }))
    }

    if (searchContent.type == "People") {
        return (
            <div className={"flex flex-col"}>
                {searchContent.peopleList?.map((user, index) => (
                    <User key={index} user={user} currentUserId={authenticatedUser.id}/>
                ))}
                {isPendingPeople && (
                    <div className="mt-20 inset-0 flex items-center justify-center z-10">
                        <Loader/>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className={"flex flex-col"}>
            <div className={"flex flex-col items-stretch border-b"}>
                <p className={"mx-4 my-2 font-bold text-xl"}>People</p>
                {searchContent.peopleList?.slice(0, 3).map((user, index) => (
                    <User key={index} user={user} currentUserId={authenticatedUser.id}/>
                ))}
                {isPendingPeople && (
                    <div className="mt-20 inset-0 flex items-center justify-center z-10">
                        <Loader/>
                    </div>
                )}
                <Button
                    variant={"ghost"}
                    className={"ms-4 hover:underline hover:bg-transparent self-start font-bold p-0"}
                    onClick={handleViewAllButton}
                >
                    View all
                </Button>
            </div>
            <div>
                {searchContent.tweetsList?.map((tweetActivity, index) => (
                    <Tweet key={index}
                           tweetActivity={tweetActivity}
                           authenticatedUserId={authenticatedUser.id}
                    />
                ))}
                {isPendingTweets && (
                    <div className="mt-20 inset-0 flex items-center justify-center z-10">
                        <Loader/>
                    </div>
                )}
            </div>

        </div>
    )

}