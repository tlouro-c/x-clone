import {SidebarMenuButton, SidebarMenuItem} from "@/components/ui/sidebar";
import {getAuthenticatedUserId} from "@/lib/server/utils";
import {SidebarMenuLinkContent} from "@/app/(authenticated)/components/sidebar-menu-link-content";
import Link from "next/link";

// Example of defining a fixed set of icon names (using a union type)
export type IconKey = "Home" | "Search" | "Bell" | "Mail" | "User" | "Settings";

export const SidebarMenuContent = async () => {

    const items: { title: string; url: string; icon: IconKey }[] = [{
        title: "Home",
        url: "/home",
        icon: "Home",
    },
        {
            title: "Explore",
            url: "/explore",
            icon: "Search",
        },
        // {
        //     title: "Notifications",
        //     url: "/notifications",
        //     icon: "Bell",
        // },
        {
            title: "Messages",
            url: "/messages",
            icon: "Mail",
        },
        {
            title: "Profile",
            // url: "/test",
            url: `/${await getAuthenticatedUserId()}`,
            icon: "User",
        },
        {
            title: "Settings",
            url: "/settings",
            icon: "Settings",
        },
    ]

    return (
        <>
            {items.map(item => (
                <SidebarMenuItem key={item.title}
                                 className={"w-full lg:w-[250px] flex justify-center lg:justify-start"}>
                    <SidebarMenuButton asChild
                                       className={`p-6 transition-all rounded-full flex justify-start`}>
                        <Link href={item.url}
                              className={"flex items-center justify-center lg:justify-start hover:bg-foreground/10 max-w-fit"}>
                            <SidebarMenuLinkContent title={item.title} url={item.url} icon={item.icon}/>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
        </>
    )
}