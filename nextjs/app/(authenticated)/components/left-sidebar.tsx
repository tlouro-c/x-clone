import {
    Sidebar,
    SidebarContent, SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader, SidebarMenu, SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {MyAccountDropdownMenu} from "@/app/(authenticated)/components/my-account-dropdown-menu";
import {SidebarMenuContent} from "@/app/(authenticated)/components/sidebar-menu-content";
import Link from "next/link";

export async function LeftSidebar() {

    return (
        <Sidebar collapsible={"icon"} side={"left"} variant={"sidebar"}
                 className={"border-r hidden md:block md:w-[80px] lg:w-[28vw]"}>
            <SidebarHeader className={`items-end py-2`}>
                <div className={"flex w-full lg:w-[250px] justify-center lg:justify-start"}>
                    <Link href={"/home"} className={`px-3 py-1 flex hover:bg-foreground/10 rounded-full max-w-fit`}>
                        <Avatar className={"w-14 h-14"}>
                            <AvatarImage className={"dark:hidden p-2"} src="/assets/images/x-logo-black.png"/>
                            <AvatarImage className={"hidden dark:block p-2"} src="/assets/images/x-logo-white.png"/>
                            <AvatarFallback>X</AvatarFallback>
                        </Avatar>
                        <span className={"text-xs self-end p-1 hidden lg:block"}>Clone By Tomás</span>
                    </Link>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className={`md:items-end gap-1`}>
                            <SidebarMenuContent/>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className={`items-end py-2`}>
                <SidebarGroup className="group-data-[collapsible=icon]:hidden p-0">
                    <SidebarMenu className={`items-end gap-3`}>
                        <SidebarMenuItem className={"w-full lg:w-[250px]"}>
                            <MyAccountDropdownMenu/>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarFooter>
        </Sidebar>
    )
}