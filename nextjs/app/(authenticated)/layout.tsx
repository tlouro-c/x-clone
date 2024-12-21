import { SidebarProvider } from "@/components/ui/sidebar"
import {LeftSidebar} from "@/app/(authenticated)/components/left-sidebar";
import {AuthenticatedUserProvider} from "@/app/(authenticated)/components/authenticated-user-context";
import {getAuthenticatedUserId} from "@/lib/server/utils";
import {fetchUser} from "@/lib/server/axios-ssr";
import ClientFallback from "@/app/(authenticated)/components/client-fallback";
import {NavbarMobileBottom} from "@/app/(authenticated)/components/navbar-mobile-bottom";


export default async function AuthorizedLayout({
                                                   children,
                                               }: Readonly<{
    children: React.ReactNode;
}>) {

    let user
    try {
        const authenticatedUserId = await getAuthenticatedUserId()
        const {data} = await fetchUser(authenticatedUserId)
        user = data
    } catch (error) {
        return <ClientFallback customErrorMessage={error instanceof Error ? error.message : null }/>
    }

    return (
        <SidebarProvider>
            <AuthenticatedUserProvider value={user}>
                <LeftSidebar/>
                <main className={"h-full w-full"}> {children} </main>
                <NavbarMobileBottom/>
            </AuthenticatedUserProvider>
        </SidebarProvider>
    );
}