import {SidebarInput} from "@/components/ui/sidebar";
import {startTransition, useActionState, useEffect, useState} from "react";
import {userSearchAction} from "@/actions/user-actions";
import Loader from "@/components/ui/loader";
import * as React from "react";
import {UserInterface} from "@/types/interfaces";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Search, X} from "lucide-react";
import {InboxPeopleSearchResult} from "@/app/(authenticated)/messages/components/inbox-people-search-result";
import {Badge} from "@/components/ui/badge";
import {UserAvatar} from "@/app/(authenticated)/(right-side-bar)/[userId]/components/user-avatar";

export const SearchPeopleInput = ({
                                      className,
                                      selectedUser,
                                      setSelectedUser,
                                  }: {
    className?: string;
    selectedUser: UserInterface | null;
    setSelectedUser: React.Dispatch<React.SetStateAction<UserInterface | null>>;
}) => {

    const [inputValue, setInputValue] = useState("")
    const [searchResults, setSearchResults] = useState<UserInterface[]>([])
    const [state, action, isPending] = useActionState(userSearchAction, [])

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

    useEffect(() => {
        setSearchResults(state)
    }, [state]);

    return (
        <div className={`w-full flex flex-col h-96 ${className}`}>
            <div className={"flex items-center gap-2  px-2"}>
                <div className={"flex items-center justify-center aspect-square h-8 w-8 flex-shrink-0"}>
                    <Search className={"text-sky-500"} size={20}/>
                </div>
                <SidebarInput
                    value={inputValue}
                    onChange={handleChange}
                    placeholder={"Search people"}
                    className={"h-12 border-none rounded-none focus-visible:ring-0"}/>
            </div>
            {selectedUser && (
                <div className={"p-2"}>
                    <Badge onClick={() => setSelectedUser(null)} variant={"outline"} className={"flex items-center gap-2 w-fit pe-3 ps-1 py-1 rounded-full hover:cursor-pointer hover:bg-muted/50"}>
                        <UserAvatar avatarSrc={selectedUser.avatar} className={"h-6 w-6"}/>
                        <span className={"font-bold text-sm"}>{selectedUser.name}</span>
                        <X className={"text-sky-500 ms-2"} size={15}/>
                    </Badge>
                </div>
            )}
            <ScrollArea className={"border-t w-full flex flex-col h-full relative"}>
                {isPending && (
                    <div className="mt-10 inset-0 flex items-center justify-center z-10">
                        <Loader/>
                    </div>
                )}
                {searchResults.map((result, index) =>
                    <InboxPeopleSearchResult onClick={() => setSelectedUser(result == selectedUser ? null : result)} isSelected={selectedUser == result}
                                             key={index} user={result}/>
                )}
            </ScrollArea>
        </div>
    )
}