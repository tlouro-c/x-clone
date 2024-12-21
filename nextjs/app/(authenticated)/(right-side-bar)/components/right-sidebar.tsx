import {
    Sidebar,
    SidebarContent, SidebarFooter,
    SidebarGroup
} from "@/components/ui/sidebar"
import {RightSidebarHeader} from "@/app/(authenticated)/(right-side-bar)/components/right-sidebar-header";

export function RightSidebar() {

    return (
        <>
            <div className={"w-[28vw] hidden md:block "}>

            </div>
            <Sidebar collapsible={"none"} side={"right"}
                     className={"border-l h-[100vh] hidden md:flex fixed top-0 right-0 flex-col w-[28vw]"}>
                <RightSidebarHeader/>
                <SidebarContent>
                    <SidebarGroup>
                        {/*<SidebarGroupContent className={"border rounded-xl w-full lg:w-[250px]"}>*/}
                        {/*    <div>*/}
                        {/*        <SidebarGroupLabel className={"text-lg font-bold text-foreground"}>*/}
                        {/*            Who to follow*/}
                        {/*        </SidebarGroupLabel>*/}
                        {/*        todo*/}
                        {/*    </div>*/}
                        {/*</SidebarGroupContent>*/}
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter>
                    <div
                        className={"w-full lg:w-[250px] p-6 flex items-center justify-start flex-wrap gap-2 text-xs text-neutral-500"}>
                        <a>Terms of Service</a>
                        <a>Privacy Policy</a>
                        <a>Cookie Policy</a>
                        <a>© 2024 X Corp.</a>
                    </div>
                </SidebarFooter>
            </Sidebar></>
    )
}