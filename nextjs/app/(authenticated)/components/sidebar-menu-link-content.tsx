"use client"

import {usePathname} from "next/navigation";
import {Bell, Home, Mail, Search, Settings, User} from "lucide-react";

const iconMap = {
    Home,
    Search,
    Bell,
    Mail,
    User,
    Settings,
};

type IconKey = keyof typeof iconMap;

interface SidebarMenuLinkProps {
    title: string,
    url: string,
    icon: IconKey

}

export const SidebarMenuLinkContent = ({title, url, icon}: SidebarMenuLinkProps)=> {

    const pathname = usePathname()

    const Icon = iconMap[icon]

    return (
            <div className={"flex items-center justify-start gap-3"}>
                <Icon size={25} strokeWidth={pathname == url ? "3px" : "2px"}/>
                <span className={`text-xl hidden lg:block ${pathname == url ? "font-bold" : ""}`}>{title}</span>
            </div>
    )
}