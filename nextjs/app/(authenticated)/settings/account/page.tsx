import {AccountUpdateForm} from "@/app/(authenticated)/settings/account/components/account-update-form";
import {fetchUser} from "@/lib/server/axios-ssr";
import ClientFallback from "@/app/(authenticated)/components/client-fallback";
import {GoBackButton} from "@/app/(authenticated)/(right-side-bar)/[userId]/components/go-back-button";
import {getAuthenticatedUserId} from "@/lib/server/utils";
import {Suspense} from "react";
import LoadingDefault from "@/app/loading";

export default async function Account() {

    let user
    try {
        const {data} = await fetchUser(await getAuthenticatedUserId())
        user = data
    } catch (error) {
        return <ClientFallback customErrorMessage={error instanceof Error ? error.message : null}/>
    }

    return (
        <Suspense fallback={<LoadingDefault/>}>
            <div className={"flex flex-col"}>
                <div className={"sticky flex h-14 items-center ps-6 bg-background/80 backdrop-blur-sm gap-6"}>
                    <GoBackButton className={"block lg:hidden"}/>
                    <p className={"text-xl font-bold"}>Account</p>
                </div>
                <div className={"flex flex-col p-6 w-full"}>
                    <AccountUpdateForm userId={user.id} userUsername={user.username} userEmail={user.email ?? ""}/>
                </div>
            </div>
        </Suspense>

    )
}