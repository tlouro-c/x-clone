import {fetchUserFollowers} from "@/lib/server/axios-ssr";
import ClientFallback from "@/app/(authenticated)/components/client-fallback";
import {User} from "@/app/(authenticated)/(right-side-bar)/[userId]/components/user";
import {getAuthenticatedUserId} from "@/lib/server/utils";
import LoadingDefault from "@/app/loading";
import {Suspense} from "react";


const Followers = async ({params}: { params: Promise<{ userId: string }> }) => {

    let followers
    try {
        const { data } = await fetchUserFollowers((await params).userId, 1)
        followers = data
    } catch (error) {
        return <ClientFallback customErrorMessage={error instanceof Error ? error.message : null} />;
    }

    const authenticatedUserId = await getAuthenticatedUserId()

    return (
        <Suspense fallback={<LoadingDefault/>}>
            <div className={"flex flex-col"}>
                {followers.map(((follower, index) => (
                    <User key={index} user={follower} currentUserId={authenticatedUserId}/>
                )))}
            </div>
        </Suspense>
    )
}

export default Followers