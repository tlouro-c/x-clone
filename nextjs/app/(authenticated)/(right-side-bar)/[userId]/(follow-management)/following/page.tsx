import {fetchUserFollowing} from "@/lib/server/axios-ssr";
import ClientFallback from "@/app/(authenticated)/components/client-fallback";
import {User} from "@/app/(authenticated)/(right-side-bar)/[userId]/components/user";
import {getAuthenticatedUserId} from "@/lib/server/utils";
import LoadingDefault from "@/app/loading";
import {Suspense} from "react";


const Following = async ({params}: { params: Promise<{ userId: string }> }) => {

    let following
    try {
        const { data } = await fetchUserFollowing((await params).userId, 1)
        following = data
    } catch (error) {
        return <ClientFallback customErrorMessage={error instanceof Error ? error.message : null} />;
    }

    const authenticatedUserId = await getAuthenticatedUserId()

    return (
        <Suspense fallback={<LoadingDefault/>}>
            <div className={"flex flex-col"}>
                {following.map(((following, index) => (
                    <User key={index} user={following} currentUserId={authenticatedUserId}/>
                )))}
            </div>
        </Suspense>
    )
}

export default Following