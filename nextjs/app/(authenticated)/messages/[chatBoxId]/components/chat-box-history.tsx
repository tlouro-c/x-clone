"use client"

import {useChatBox} from "@/app/(authenticated)/messages/[chatBoxId]/components/chat-box-provider";
import {ScrollArea} from "@/components/ui/scroll-area";
import {ChatBoxMessage} from "@/app/(authenticated)/messages/[chatBoxId]/components/chat-box-message";
import Link from "next/link";
import {useEffect, useRef} from "react";
import {fetchMessagesUpdatesAction} from "@/actions/user-actions";
import {toast} from "sonner";
import {UserAvatar} from "@/app/(authenticated)/(right-side-bar)/[userId]/components/user-avatar";

export const ChatBoxHistory = () => {

    const { chatBox, setChatBox } = useChatBox()
    const messagesContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        scrollToBottom(messagesContainerRef.current, false);
    }, [chatBox.history]);

    useEffect(() => {
        const interval = setInterval(async () => {
            const newMessagesResponse = await fetchMessagesUpdatesAction(chatBox.id)
            const newMessages = newMessagesResponse.newMessages
            if (!newMessagesResponse.ok) {
                toast(newMessagesResponse.detail)
                return
            }
            const existingMessageIds = new Set(chatBox.history.map((msg) => msg.id))

            const filteredMessages = newMessages.filter(
                (message) => !existingMessageIds.has(message.id)
            );

            if (filteredMessages.length > 0) {
                setChatBox((prevChatBoxContext) => ({
                    ...prevChatBoxContext,
                    history: prevChatBoxContext.history.concat(filteredMessages)
                }));
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [chatBox.history, chatBox.id, setChatBox]);

                return (
        <ScrollArea className={"px-4 h-full"}>
            <Link href={`/${chatBox.otherUser.id}`} className={"flex flex-col items-center hover:bg-foreground/10 p-4 transition-colors duration-200 border-b"}>
                <UserAvatar avatarSrc={chatBox.otherUser.avatar} className={"h-16 w-16"}/>
                <p className={"font-bold"}>{chatBox.otherUser.name}</p>
                <p className={"text-neutral-500"}>@{chatBox.otherUser.username}</p>
                <div className={"flex text-sm text-neutral-500 items-center gap-1 my-4"}>
                    <span className={"leading-none"}>Joined {new Date(chatBox.otherUser.createdAt).toLocaleString('default', { month: 'long' })} {new Date(chatBox.otherUser.createdAt).getFullYear()}</span>
                    <span> · </span>
                    <span> {chatBox.otherUser.followersCount} Followers </span>
                </div>
            </Link>
            <div className={"flex flex-col"} ref={messagesContainerRef}>
                {chatBox.history.map((message, index) => (
                    <ChatBoxMessage key={index} message={message}/>
                ))}
            </div>
        </ScrollArea>
    )
}

export const scrollToBottom = (
    container: HTMLElement | null,
    smooth = false
) => {
    if (container?.children.length) {
        const lastElement = container?.lastChild as HTMLElement;

        lastElement?.scrollIntoView({
            behavior: smooth ? "smooth" : "auto",
            block: "end",
            inline: "nearest",
        });
    }
};