"use client"

import {UserInterface} from "@/types/interfaces";
import {GoBackButton} from "@/app/(authenticated)/(right-side-bar)/[userId]/components/go-back-button";
import ContentSwitchButton from "@/app/(authenticated)/(right-side-bar)/home/components/content-switch-button";
import {usePathname, useRouter} from "next/navigation";

interface FollowManagementHeaderProps {
    user: UserInterface
}

export const FollowManagementHeader = ({ user }: FollowManagementHeaderProps) => {

    const router = useRouter()
    const pathname = usePathname()
    const selectedContentType = pathname.substring(pathname.lastIndexOf("/") + 1)

    const handleOnClick = (contentType: string)=> (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault()
        if (selectedContentType == contentType) {
            return
        }
        router.push(`/${user.id}/${contentType}`)
    }

    return (
        <div className={"sticky flex flex-col bg-background/80 backdrop-blur-sm"}>
            <div className={"flex h-14 items-center ps-6 gap-6"}>
                <GoBackButton/>
                <div className={"flex flex-col"}>
                    <p className={"text-lg font-bold"}>{user.name}</p>
                    <span className={"text-neutral-500 text-sm"}>@{user.username}</span>
                </div>
            </div>
            <div className={"flex w-full"}>
                <ContentSwitchButton className={"flex-1 h-12"} onClickAction={handleOnClick("followers")} isHighlighted={selectedContentType == "followers"}>
                    Followers
                </ContentSwitchButton>
                <ContentSwitchButton className={"flex-1 h-12"} onClickAction={handleOnClick("following")} isHighlighted={selectedContentType == "following"}>
                    Following
                </ContentSwitchButton>
            </div>
        </div>
    )
}