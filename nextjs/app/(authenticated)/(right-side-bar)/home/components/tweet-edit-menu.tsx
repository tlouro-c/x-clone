"use client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal, DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Check, Ellipsis, Trash2, X} from "lucide-react";
import {useTweet} from "@/app/(authenticated)/(right-side-bar)/home/components/tweet-context";
import {startTransition, useActionState, useEffect} from "react";
import {deleteTweetAction} from "@/actions/tweet-actions";
import {toast} from "sonner";


export const TweetEditMenu = () => {

    const [ state, action, isPending ] = useActionState(deleteTweetAction, null)
    const { tweetContext, setTweetContext } = useTweet()
    const tweet = tweetContext.tweetActivity.tweet
    
    const handleClick = () => {
        startTransition(() => action(tweet.id))
    }

    useEffect(() => {
        if (!state) {
            return
        }

        if (state.ok) {
            setTweetContext(prevTweetContext => ({
                ...prevTweetContext,
                    tweetActivity: {
                        ...prevTweetContext.tweetActivity,
                        type: "DELETED"
                    }
            }))
        }

        toast(state.ok ? state.message : state.detail)
    }, [setTweetContext, state]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className={"ms-auto p-0 h-6 rounded-full aspect-square bg-transparent hover:text-sky-400 hover:bg-sky-400/20 text-neutral-500 "}>
                <Ellipsis/>
            </DropdownMenuTrigger>
            <DropdownMenuContent side={"top"} className={"bg-background"}>
                <DropdownMenuGroup>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger className={"flex text-red-600 font-bold focus:bg-transparent data-[state=open]:bg-transparent"}>
                            <Trash2/>
                            <span>Delete</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent className={"bg-background"}>
                                <DropdownMenuLabel>Are you sure?</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleClick} disabled={isPending}>
                                    <Check/>
                                    <span>Yes</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem disabled={isPending}>
                                    <X/>
                                    <span>Cancel</span>
                                </DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}