"use client"

import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Ellipsis} from "lucide-react";
import {signOut} from "@/actions/auth-actions";
import {UserAvatar} from "@/app/(authenticated)/(right-side-bar)/[userId]/components/user-avatar";
import {useAuthenticatedUser} from "@/app/(authenticated)/components/authenticated-user-context";

interface MyAccountDropdownMenuProps {
    className?: string
    avatarClassName?: string
}

export const MyAccountDropdownMenu = ({ className, avatarClassName }: MyAccountDropdownMenuProps) => {

    const { authenticatedUser } = useAuthenticatedUser()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className={`flex justify-center items-center px-3 py-1 rounded-full w-full hover:bg-foreground/10 transition-colors gap-2 ${className}`}>
                <UserAvatar
                    avatarSrc={authenticatedUser.avatar}
                    className={`w-14 h-14 ${avatarClassName}`}
                />
                <div className={"flex-col items-start hidden lg:flex"}>
                    <p className={"font-bold text-sm"}>{authenticatedUser.name}</p>
                    <p className="text-neutral-500 text-sm">{authenticatedUser.username}</p>
                </div>
                <Ellipsis className="ms-auto hidden lg:block" />
            </DropdownMenuTrigger>
            <DropdownMenuContent side={"top"}>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )

}