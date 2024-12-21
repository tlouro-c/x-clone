'use client'

import {useRouter} from "next/navigation";
import {ArrowLeft} from "lucide-react";
import {Button} from "@/components/ui/button";

export const GoBackButton = ({ className } : {className?: string}) => {

    const router = useRouter()

    return (
        <Button variant={"ghost"} onClick={router.back} className={`rounded-full aspect-square transition-colors hover:bg-foreground/10 ${className}`}>
            <ArrowLeft/>
        </Button>
    )
}