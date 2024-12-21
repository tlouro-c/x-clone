import {ThemeForm} from "@/app/(authenticated)/settings/appearance/components/theme-form";
import {GoBackButton} from "@/app/(authenticated)/(right-side-bar)/[userId]/components/go-back-button";
import LoadingDefault from "@/app/loading";
import {Suspense} from "react";

export default function Appearance() {

    return (
        <Suspense fallback={<LoadingDefault/>}>
            <div className={"flex flex-col w-full"}>
                <div className={"sticky flex h-14 items-center ps-6 bg-background/80 backdrop-blur-sm gap-6"}>
                    <GoBackButton className={"block lg:hidden"}/>
                    <p className={"text-xl font-bold"}>Appearance</p>
                </div>
                <div className={"flex flex-col p-6"}>
                    <ThemeForm/>
                </div>
            </div>
        </Suspense>
    )
}