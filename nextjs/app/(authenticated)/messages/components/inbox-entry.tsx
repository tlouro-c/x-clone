"use client"

import {Avatar, AvatarImage} from "@/components/ui/avatar";
import Link from "next/link";
import {ChatBoxInterface} from "@/types/interfaces";
import {formatDate} from "@/lib/utils";
import {usePathname} from "next/navigation";


interface InboxEntryProps {
    chatBox: ChatBoxInterface,
    authenticatedUserId: string
}

export const InboxEntry = ({ chatBox, authenticatedUserId }: InboxEntryProps) => {

    const pathname = usePathname()

    const isHighlighted = pathname.slice(pathname.lastIndexOf("/") + 1) == chatBox.id.toString()

    const otherUser = chatBox.userA.id == authenticatedUserId ? chatBox.userB : chatBox.userA

    return (
            <Link
                href={`/messages/${chatBox.id}`}
                className={`flex flex-col p-4 hover:bg-foreground/10 transition-colors relative ${isHighlighted ? "bg-foreground/15" : ""}`}>
                <div className={"flex justify-start gap-2"}>
                    <Avatar>
                        <AvatarImage src={"/assets/images/default-avatar.png"}/>
                    </Avatar>
                    <div className={"flex flex-col flex-1 pt-1"}>
                        <div className={"flex gap-1"}>
                            <p className={"text-sm font-bold"}> {otherUser.name} </p>
                            <p className={"text-sm text-neutral-500"}> @{otherUser.username} </p>
                            <p className={"text-neutral-500 text-sm"}> · </p>
                            <p className={"text-sm text-neutral-500"}>
                                {chatBox.lastMessage ? formatDate(chatBox.lastMessage.timestamp.toString()) : ''}
                            </p>
                        </div>
                        <p className={"text-sm"}>
                            {chatBox.lastMessage ? `${chatBox.lastMessage.content.slice(0, 12)}${chatBox.lastMessage.content.length > 12 ? '...' : ''}` : ''}
                        </p>
                    </div>
                </div>
                {isHighlighted && (
                    <div className={"absolute right-0 border border-r-2 border-r-sky-400 h-full top-0"}></div>
                )}
            </Link>
    )

}