import {fetchUser} from "@/lib/server/axios-ssr";
import ClientFallback from "@/app/(authenticated)/components/client-fallback";
import {UserProfile} from "@/app/(authenticated)/(right-side-bar)/[userId]/components/user-profile";

const UserPage = async ({params}: { params: Promise<{ userId: string }> }) => {

    let user;
    try {
        const {data} = await fetchUser((await params).userId);
        user = data;
    } catch (error) {
        return <ClientFallback customErrorMessage={error instanceof Error ? error.message : null} />;
    }

    return <UserProfile user={user} />;
};

export default UserPage;

