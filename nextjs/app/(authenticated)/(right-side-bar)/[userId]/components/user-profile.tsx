import {UserInterface} from "@/types/interfaces";
import {ProfileHeader} from "@/app/(authenticated)/(right-side-bar)/[userId]/components/profile-header";
import {ProfileInformation} from "@/app/(authenticated)/(right-side-bar)/[userId]/components/profile-information";
import {ProfileContent} from "@/app/(authenticated)/(right-side-bar)/[userId]/components/profile-content";
import {ScrollArea} from "@/components/ui/scroll-area";
import {getAuthenticatedUserId} from "@/lib/server/utils";


interface UserProfileProps {
    user: UserInterface;
}

export const UserProfile = async ({user}: UserProfileProps) => {

    const authenticatedUserId = await getAuthenticatedUserId()

    return (
        <div className={"flex flex-col justify-items-stretch items-stretch w-full h-screen"}>
            <ProfileHeader name={user.name} postsCount={user.postsCount}/>
            <ScrollArea>
                <ProfileInformation user={user}/>
                <ProfileContent userId={user.id} authenticatedUserId={authenticatedUserId}/>
            </ScrollArea>
        </div>
    )

}