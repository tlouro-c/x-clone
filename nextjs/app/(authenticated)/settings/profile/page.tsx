import {GoBackButton} from "@/app/(authenticated)/(right-side-bar)/[userId]/components/go-back-button";
import LoadingDefault from "@/app/loading";
import {Suspense} from "react";
import {UpdateUserAvatarForm} from "@/app/(authenticated)/settings/profile/components/update-user-avatar-form";

export default function Profile() {

    return (
        <Suspense fallback={<LoadingDefault/>}>
            <div className={"flex flex-col w-full"}>
                <div className={"sticky flex h-14 items-center ps-6 bg-background/80 backdrop-blur-sm gap-6"}>
                    <GoBackButton className={"block lg:hidden"}/>
                    <p className={"text-xl font-bold"}>Profile</p>
                </div>
                <div className={"flex flex-col p-6"}>
                    <UpdateUserAvatarForm/>
                </div>
            </div>
        </Suspense>
    )
}