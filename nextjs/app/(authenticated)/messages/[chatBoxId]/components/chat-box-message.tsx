"use client"

import {MessageInterface} from "@/types/interfaces";
import {useChatBox} from "@/app/(authenticated)/messages/[chatBoxId]/components/chat-box-provider";

interface ChatBoxMessageProps {
    message: MessageInterface
}

export const ChatBoxMessage = ({message}: ChatBoxMessageProps) => {

    const { chatBox } = useChatBox()

    if (message.sender.id == chatBox.authenticatedUser.id) {
        return (
            <div className={"flex flex-col self-end gap-1 w-8/12 py-2"}>
                <div className={"flex flex-col py-3 px-4 rounded-2xl rounded-br-sm bg-sky-500"}>
                    {message.content}
                </div>
                <span className={"self-end text-neutral-500 text-xs"}>{formatDate(new Date(message.timestamp))}</span>
            </div>
        )
    }
    return (
        <div className={"flex flex-col w-8/12 gap-1 py-2"}>
            <div className={"flex flex-col py-3 px-4 rounded-2xl rounded-bl-sm bg-foreground/20"}>
                {message.content}
            </div>
            <span className={"text-neutral-500 text-xs"}>{formatDate(new Date(message.timestamp))}</span>
        </div>

    )
}

function formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
        month: 'short', // Short month name (e.g., "Feb")
        day: 'numeric', // Day of the month (e.g., "5")
        year: 'numeric', // Full year (e.g., "2024")
        hour: 'numeric', // Hour (e.g., "9")
        minute: '2-digit', // Minutes with leading zero (e.g., "31")
        hour12: true // Use 12-hour clock (e.g., "PM")
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
}