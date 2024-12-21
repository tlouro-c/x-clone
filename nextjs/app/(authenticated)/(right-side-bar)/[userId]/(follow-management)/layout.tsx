import {fetchUser} from "@/lib/server/axios-ssr";
import ClientFallback from "@/app/(authenticated)/components/client-fallback";
import {
    FollowManagementHeader
} from "@/app/(authenticated)/(right-side-bar)/[userId]/(follow-management)/components/follow-management-header";


const FollowManagementLayout = async ({
                                          children, params,
                                      }: Readonly<{
    children: React.ReactNode;
    params: Promise<{ userId: string }>
}>) => {

    let user;
    try {
        const {data} = await fetchUser((await params).userId);
        user = data;
    } catch (error) {
        return <ClientFallback customErrorMessage={error instanceof Error ? error.message : null}/>;
    }

    return (
        <div className={"flex flex-col"}>
            <FollowManagementHeader user={user}/>
            <main> {children} </main>
        </div>
    )
}

export default FollowManagementLayout