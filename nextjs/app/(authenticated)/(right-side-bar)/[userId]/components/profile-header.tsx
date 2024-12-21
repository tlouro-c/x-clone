import {GoBackButton} from "@/app/(authenticated)/(right-side-bar)/[userId]/components/go-back-button";


interface ProfileHeaderProps {
    name: string;
    postsCount: number;
}

export const ProfileHeader = ({ name, postsCount } : ProfileHeaderProps) => {

    return (
        <div className={"sticky flex h-14 items-center ps-6 bg-background/80 backdrop-blur-sm gap-6"}>
            <GoBackButton/>
            <div className={"flex flex-col"}>
                <p className={"text-lg font-bold"}>{name}</p>
                <span className={"text-neutral-500 text-sm"}>{postsCount} posts</span>
            </div>
        </div>
    )
}