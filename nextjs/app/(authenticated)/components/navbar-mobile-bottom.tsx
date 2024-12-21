import {IconKey} from "@/app/(authenticated)/components/sidebar-menu-content";
import {getAuthenticatedUserId} from "@/lib/server/utils";
import {SidebarMenuLinkContent} from "@/app/(authenticated)/components/sidebar-menu-link-content";
import Link from "next/link";


export const NavbarMobileBottom = async () => {

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
        <div className={"border-t w-full flex md:hidden justify-center items-stretch fixed bottom-0 h-12 bg-background"}>
            {items.map(item => (
                <Link key={item.title} href={item.url}
                      className={"flex flex-1 items-center justify-center lg:justify-start hover:bg-foreground/10"}>
                    <SidebarMenuLinkContent title={item.title} url={item.url} icon={item.icon}/>
                </Link>
            ))}
        </div>
    )
}