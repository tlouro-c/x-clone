import {DeleteAccountForm} from "@/app/(authenticated)/settings/delete-account/delete-account-form";
import {fetchUser} from "@/lib/server/axios-ssr";
import ClientFallback from "@/app/(authenticated)/components/client-fallback";
import {GoBackButton} from "@/app/(authenticated)/(right-side-bar)/[userId]/components/go-back-button";
import {getAuthenticatedUserId} from "@/lib/server/utils";
import LoadingDefault from "@/app/loading";
import {Suspense} from "react";

export default async function DeleteAccount() {

    let user
    try {
        const {data} = await fetchUser(await getAuthenticatedUserId())
        user = data
    } catch (error) {
        return <ClientFallback customErrorMessage={error instanceof Error ? error.message : null}/>
    }

    return (
        <Suspense fallback={<LoadingDefault/>}>
            <div className={"flex flex-col w-full"}>
                <div className={"sticky flex h-14 items-center ps-6 bg-background/80 backdrop-blur-sm gap-6"}>
                    <GoBackButton className={"block lg:hidden"}/>
                    <p className={"text-xl font-bold"}>Delete account</p>
                </div>
                <div className={"flex flex-col p-6"}>
                    <DeleteAccountForm userId={user.id}/>
                </div>
            </div>
        </Suspense>
    )
}