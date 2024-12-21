import {ChatBoxHeader} from "@/app/(authenticated)/messages/[chatBoxId]/components/chat-box-header";
import {ChatBoxProvider} from "@/app/(authenticated)/messages/[chatBoxId]/components/chat-box-provider";
import {fetchChatBoxById, fetchChatBoxHistory} from "@/lib/server/axios-ssr";
import ClientFallback from "@/app/(authenticated)/components/client-fallback";
import {getAuthenticatedUserId} from "@/lib/server/utils";
import {ChatBoxHistory} from "@/app/(authenticated)/messages/[chatBoxId]/components/chat-box-history";
import {ChatBoxInput} from "@/app/(authenticated)/messages/[chatBoxId]/components/chat-box-input";
import LoadingDefault from "@/app/loading";
import {Suspense} from "react";


const ChatBoxPage = async ({params}: { params: Promise<{ chatBoxId: number }> }) => {

    const chatBoxId = (await params).chatBoxId
    const authenticatedUserId = await getAuthenticatedUserId()

    let chatBox
    let history
    try {
        const { data: chatBoxData } = await fetchChatBoxById(chatBoxId)
        chatBox = chatBoxData
        const { data: historyData } = await fetchChatBoxHistory(chatBoxId);
        history = historyData;
    } catch (error) {
        return <ClientFallback customErrorMessage={error instanceof Error ? error.message : null}/>
    }

    const [authenticatedUser, otherUser] = chatBox.userA.id === authenticatedUserId
        ? [chatBox.userA, chatBox.userB]
        : [chatBox.userB, chatBox.userA]

    return (
        <Suspense fallback={<LoadingDefault/>}>
            <div className={"h-screen w-full flex flex-col"}>
                <ChatBoxProvider
                    value={{
                        id: chatBox.id,
                        authenticatedUser: authenticatedUser,
                        otherUser: otherUser,
                        history: history
                    }}>
                    <ChatBoxHeader/>
                    <ChatBoxHistory/>
                    <ChatBoxInput/>
                </ChatBoxProvider>
            </div>
        </Suspense>
    )
}

            export default ChatBoxPage
