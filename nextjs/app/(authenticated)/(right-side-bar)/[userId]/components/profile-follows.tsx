import Link from "next/link";

interface ProfileFollowsProps {
    userId: string,
    followersCount: number,
    followingCount: number
}

export const ProfileFollows = ({userId, followersCount, followingCount}: ProfileFollowsProps) => {

    return (
        <div className={"flex gap-4"}>
            <Link href={`/${userId}/following`} className={"hover:underline underline-offset-2"}>
                <span className={"text-sm font-bold"}>{followingCount}</span>
                <span className={"text-sm text-neutral-500"}>&nbsp;Following</span>
            </Link>
            <Link href={`/${userId}/followers`} className={"hover:underline"}>
                <span className={"text-sm font-bold"}>{followersCount}</span>
                <span className={"text-sm text-neutral-500"}>&nbsp;Followers</span>
            </Link>
        </div>
    )
}