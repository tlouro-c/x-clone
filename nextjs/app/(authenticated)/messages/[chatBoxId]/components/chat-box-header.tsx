"use client"

import {useChatBox} from "@/app/(authenticated)/messages/[chatBoxId]/components/chat-box-provider";
import {GoBackButton} from "@/app/(authenticated)/(right-side-bar)/[userId]/components/go-back-button";

export const ChatBoxHeader = () => {

    const { chatBox } = useChatBox()

    const user = chatBox.otherUser

    return (
        <div className={"sticky flex min-h-14 h-14 items-center ps-6 gap-6 justify-start bg-background/80 backdrop-blur-sm"}>
            <GoBackButton className={"block lg:hidden"}/>
            <p className={"text-xl font-bold"}>{user.name}</p>
        </div>
    )
}