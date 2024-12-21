import {UserInterface} from "@/types/interfaces";
import Link from "next/link";
import {FollowButton} from "@/app/(authenticated)/(right-side-bar)/[userId]/components/follow-button";
import {UserAvatar} from "@/app/(authenticated)/(right-side-bar)/[userId]/components/user-avatar";

interface UserProps {
    user: UserInterface;
    currentUserId: string;
}

export const User = ({user, currentUserId}: UserProps) => {

    return (
        <Link href={`/${user.id}`} className={"flex flex-col p-4"}>
            <div className={"flex justify-start gap-2"}>
                <UserAvatar avatarSrc={user.avatar}/>
                <div className={"flex flex-col"}>
                    <span className={"text-sm font-bold hover:underline"}> {user.name} </span>
                    <span className={"text-sm text-neutral-500"}> @{user.username} </span>
                </div>
                <FollowButton
                    className={`ms-auto ${currentUserId == user.id ? "hidden" : ""}`}
                    followerId={currentUserId}
                    followedId={user.id}
                    initialFollowState={user.isFollowedByCurrentUser}
                />
            </div>


        </Link>
    )
}