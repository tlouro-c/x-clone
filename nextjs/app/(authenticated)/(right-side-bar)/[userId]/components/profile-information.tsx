import {AspectRatio} from "@/components/ui/aspect-ratio";
import {getAuthenticatedUserId} from "@/lib/server/utils";
import {ProfileFollows} from "@/app/(authenticated)/(right-side-bar)/[userId]/components/profile-follows";
import {UserInterface} from "@/types/interfaces";
import {CalendarDays} from "lucide-react";
import {FollowButton} from "@/app/(authenticated)/(right-side-bar)/[userId]/components/follow-button";
import {UserAvatar} from "@/app/(authenticated)/(right-side-bar)/[userId]/components/user-avatar";
import Link from "next/link";


interface ProfileInformationProps {
    user: UserInterface;
}


export const ProfileInformation =
    async ({ user }: ProfileInformationProps) => {

    const authenticatedUserId =  await getAuthenticatedUserId() ?? ''
    const isAuthenticatedUser = authenticatedUserId == user.id;

    const createdAtDate = new Date(user.createdAt);
    const monthString = createdAtDate.toLocaleString('default', { month: 'long' });

        return (
        <>
            <AspectRatio ratio={3} className={"bg-foreground/30"}>
                <UserAvatar
                    avatarSrc={user.avatar}
                    className={"absolute bottom-[-38%] left-4 w-1/4 h-auto aspect-square border-4 border-background"}
                />
            </AspectRatio>
            <div className={"flex flex-col p-4 gap-3"}>
                <div className={"self-end flex justify-end w-[10%] aspect-square"}>
                    {isAuthenticatedUser && (
                        <Link
                            href={"/settings/profile"}
                            className="flex justify-center h-fit items-center rounded-full font-bold border border-foreground px-4 py-2 text-center transition-colors hover:bg-foreground/10"
                        >
                            <span className={"text-nowrap text-sm"}>Edit Profile</span>
                        </Link>
                    )}

                    {!isAuthenticatedUser && (
                        <FollowButton followerId={authenticatedUserId} followedId={user.id} initialFollowState={user.isFollowedByCurrentUser}/>
                    )}

                </div>
                <div>
                    <p className={"font-bold text-xl"}>{user.name}</p>
                    <p className={"text-neutral-500 text-sm"}>@{user.username}</p>
                </div>

                <div className={"flex items-center gap-1 text-neutral-500 text-sm"}>
                    <CalendarDays size={15}/>
                    <span className={"leading-none"}>Joined {monthString} {createdAtDate.getFullYear()}</span>
                </div>

                <ProfileFollows userId={user.id} followingCount={user.followingCount} followersCount={user.followersCount}/>
            </div>
        </>
    )
}