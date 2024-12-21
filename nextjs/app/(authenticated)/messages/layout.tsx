import {InboxEntry} from "@/app/(authenticated)/messages/components/inbox-entry";
import {fetchUserChatBoxes} from "@/lib/server/axios-ssr";
import {getAuthenticatedUserId} from "@/lib/server/utils";
import ClientFallback from "@/app/(authenticated)/components/client-fallback";
import {ChatBoxInterface} from "@/types/interfaces";
import {ScrollArea} from "@/components/ui/scroll-area";
import {NewInboxButton} from "@/app/(authenticated)/messages/components/new-inbox-button";

export default async function MessagesLayout({
                                                 children,
                                             }: Readonly<{
    children: React.ReactNode;
}>) {

    const authenticatedUserId = await getAuthenticatedUserId()

    let chatBoxes: ChatBoxInterface[] = []
    try {
        const { data } = await fetchUserChatBoxes(authenticatedUserId, 1)
        chatBoxes = data
    } catch (error) {
        return <ClientFallback customErrorMessage={error instanceof Error ? error.message : null}/>
    }

    return (
        <div className={"flex h-screen"}>
            <div className={"hidden lg:flex flex-col min-w-96 border-r"}>
                <div className={"sticky flex justify-between h-14 items-center px-6 bg-background/80 backdrop-blur-sm"}>
                    <p className={"text-xl font-bold"}>Messages</p>
                    <NewInboxButton/>
                </div>
                <ScrollArea className={"flex flex-col"}>
                    {chatBoxes.map((chatBox, index) => (
                        <InboxEntry key={index} chatBox={chatBox} authenticatedUserId={authenticatedUserId} />
                    ))}
                </ScrollArea>
            </div>
            <main className={"w-full h-full"}> {children} </main>
        </div>
    )
}