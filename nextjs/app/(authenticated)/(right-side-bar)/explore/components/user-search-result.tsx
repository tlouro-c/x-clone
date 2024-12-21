import {UserInterface} from "@/types/interfaces";
import Link from "next/link";
import {UserAvatar} from "@/app/(authenticated)/(right-side-bar)/[userId]/components/user-avatar";

interface UserSearchResultProps {
    user: UserInterface;
}

export const UserSearchResult = ({ user }: UserSearchResultProps) => {

    return (
        <Link href={`/${user.id}`} className={"flex flex-col p-4 hover:bg-muted/80"}>
            <div className={"flex justify-start gap-2"}>
                <UserAvatar avatarSrc={user.avatar}/>
                <div className={"flex flex-col"}>
                    <span className={"text-sm font-bold hover:underline"}> {user.name} </span>
                    <span className={"text-sm text-neutral-500"}> @{user.username} </span>
                </div>
            </div>
        </Link>
    )
}