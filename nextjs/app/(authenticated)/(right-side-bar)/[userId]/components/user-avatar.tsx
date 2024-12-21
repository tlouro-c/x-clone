"use client"

import {startTransition, useActionState, useEffect, useState} from "react";
import {toast} from "sonner";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {fetchAvatarFromServer} from "@/actions/user-actions";
import {Skeleton} from "@/components/ui/skeleton";

interface UserAvatarProps {
    avatarSrc: string | null
    className?: string
}

export const UserAvatar = ({avatarSrc, className}: UserAvatarProps) => {

    const [state, action] = useActionState(fetchAvatarFromServer, null)
    const [avatarUrl, setAvatarUrl] = useState<string | undefined>()

    useEffect(() => {
        if (!avatarSrc) return
        startTransition(() => action(avatarSrc))
    }, [action, avatarSrc]);

    useEffect(() => {
        if (!state) return
        if (!state.ok) {
            toast(state.detail)
            return
        }

        const fetchingData = state.avatarFetchingData
        if (!fetchingData) return;

        const byteCharacters = atob(fetchingData.imageData);
        const byteNumbers = Array.from(byteCharacters, (char) => char.charCodeAt(0));
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], {
            type: fetchingData.contentTypeHeader,
        });

        setAvatarUrl(URL.createObjectURL(blob));

    }, [state]);

    return (
        <Avatar className={className}>
            <AvatarImage className={"object-cover"} src={avatarUrl} alt="User Avatar" width={150} height={150}/>
            <AvatarFallback>
                <Skeleton className="h-full w-full rounded-full"/>
            </AvatarFallback>
        </Avatar>
    );
}