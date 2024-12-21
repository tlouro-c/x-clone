import * as React from "react";
import {TweetFormSkeleton} from "@/app/(authenticated)/(right-side-bar)/home/components/tweet-form-skeleton";
import {HomeHeaderSkeleton} from "@/app/(authenticated)/(right-side-bar)/home/components/home-header-skeleton";
import Loader from "@/components/ui/loader";

export default async function Test() {

    return (
        <div className="flex flex-col justify-items-stretch items-stretch w-full relative h-screen">
            <HomeHeaderSkeleton/>
            <TweetFormSkeleton/>
            <div className="mt-20 inset-0 flex items-center justify-center z-10">
                <Loader/>
            </div>
        </div>
    )
}