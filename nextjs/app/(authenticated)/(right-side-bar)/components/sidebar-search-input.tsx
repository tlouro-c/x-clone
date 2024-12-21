"use client"

import {SidebarInput} from "@/components/ui/sidebar";
import {startTransition, useActionState, useEffect, useState} from "react";
import {userSearchAction} from "@/actions/user-actions";
import Loader from "@/components/ui/loader";
import * as React from "react";
import {UserInterface} from "@/types/interfaces";
import {UserSearchResult} from "@/app/(authenticated)/(right-side-bar)/explore/components/user-search-result";
import {useRouter} from "next/navigation";
import {ScrollArea} from "@/components/ui/scroll-area";

export const SidebarSearchInput = ({className}: {className?: string}) => {

    const [isFocused, setIsFocused] = useState(false);
    const [isDropdownHovered, setIsDropdownHovered] = useState(false); // Track interaction with the dropdown
    const [inputValue, setInputValue] = useState("")
    const [searchResults, setSearchResults] = useState<UserInterface[]>([])
    const [state, action, isPending] = useActionState(userSearchAction, [])
    const router = useRouter()

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        setInputValue(value)
        setSearchResults([])
        if (value) {
            startTransition(() => {
                action(value)
            })
        }
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (inputValue.trim()) {
            setIsFocused(false)
            setIsDropdownHovered(false)
            router.push(`/explore/${inputValue}`)
        }
    };

    useEffect(() => {
        setSearchResults(state)
    }, [state]);

    return (
        <form className={`w-full relative ${className}`} onSubmit={handleSubmit}>
            <SidebarInput
                value={inputValue}
                onChange={handleChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={"Search"}
                className={"rounded-full h-12"}/>
            {(isFocused || isDropdownHovered) && (
                <div className={"absolute mt-2 w-full flex flex-col h-80 bg-background rounded-lg shadow-sm shadow-foreground/40 z-10"}
                     onMouseEnter={() => setIsDropdownHovered(true)}
                     onMouseLeave={() => setIsDropdownHovered(false)}
                >
                    {isPending && (
                        <div className="mt-10 inset-0 flex items-center justify-center z-10">
                            <Loader/>
                        </div>
                    )}
                    <ScrollArea>
                        {searchResults.map((result, index) => <UserSearchResult key={index} user={result}/>)}
                    </ScrollArea>
                </div>
            )}
        </form>
    )
}