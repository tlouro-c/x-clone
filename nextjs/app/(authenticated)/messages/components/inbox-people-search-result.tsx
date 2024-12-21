import {UserInterface} from "@/types/interfaces";
import {Check} from "lucide-react";
import {UserAvatar} from "@/app/(authenticated)/(right-side-bar)/[userId]/components/user-avatar";

interface UserSearchResultProps {
    user: UserInterface;
    onClick: (user: UserInterface) => void;
    isSelected: boolean
}

export const InboxPeopleSearchResult = ({ user, onClick, isSelected }: UserSearchResultProps) => {

    return (
        <div onClick={() => onClick(user)}  className={"flex flex-col p-4 hover:bg-muted/80 hover:cursor-pointer"}>
            <div className={"flex justify-start items-center gap-2"}>
                <UserAvatar avatarSrc={user.avatar}/>
                <div className={"flex flex-col"}>
                    <span className={"text-sm font-bold"}> {user.name} </span>
                    <span className={"text-sm text-neutral-500"}> @{user.username} </span>
                </div>
                {isSelected && (
                    <Check className={"ms-auto text-sky-500"} size={15}/>
                )}
            </div>
        </div>
    )
}