import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import {RightSidebar} from "@/app/(authenticated)/(right-side-bar)/components/right-sidebar";

export default function RightSideBarLayout({
                                             children,
                                         }: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <SidebarProvider>
            <SidebarInset>
                <main className={"h-screen flex flex-col"} > {children} </main>
            </SidebarInset>
            <RightSidebar/>
        </SidebarProvider>
    );
}