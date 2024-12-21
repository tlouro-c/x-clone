"use client"

import {useChatBox} from "@/app/(authenticated)/messages/[chatBoxId]/components/chat-box-provider";
import { Input } from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {startTransition, useActionState, useEffect, useState} from "react";
import {SendHorizonal} from "lucide-react";
import {sendMessageAction} from "@/actions/user-actions";
import {toast} from "sonner";
import {MessageInterface} from "@/types/interfaces";


export const ChatBoxInput = () => {

    const [state, action, isPending] = useActionState(sendMessageAction, null)
    const { chatBox, setChatBox } = useChatBox()
    const [ messageValue, setMessageValue ] = useState<string>("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        startTransition(() => action({
            senderId: chatBox.authenticatedUser.id,
            receiverId: chatBox.otherUser.id,
            content: messageValue
        }))
        setMessageValue('')

    }

    useEffect(() => {
        if (!state) {
            return;
        }

        if (state.ok && state.message) {
            setChatBox((prevChatBoxContext) => ({
                ...prevChatBoxContext,
                history: [
                    ...prevChatBoxContext.history,
                    state.message as MessageInterface
                ],
            }));
        } else {
            toast(state?.detail);
        }
    }, [setChatBox, state])

    return (
        <div className={"flex sticky bottom-0 border-t py-2 px-4 bg-background z-30"}>
            <form className={"flex p-1 w-full bg-foreground/10 rounded-2xl h-12 items-center"} method={"post"} onSubmit={handleSubmit}>
                <Input
                    onChange={(e) => setMessageValue(e.target.value)}
                    value={messageValue}
                    type="text"
                    placeholder={"Start a new message"}
                    className={"border-none focus-visible:ring-0 shadow-none"}/>
                <Button
                    disabled={messageValue.length < 1 || isPending}
                    type="submit"
                    className={"shadow-none border-none bg-transparent text-sky-400 hover:bg-sky-400/20 rounded-full aspect-square"}
                >
                    <SendHorizonal/>
                </Button>
            </form>
        </div>
    )
}