"use client"

import {usePathname} from "next/navigation";
import {SidebarSearchInput} from "@/app/(authenticated)/(right-side-bar)/components/sidebar-search-input";
import {SidebarHeader} from "@/components/ui/sidebar";

export const RightSidebarHeader = () => {

    const pathname = usePathname()

    return (
        <SidebarHeader className={`py-4 ${pathname.includes("explore") ? "hidden" : ""}`}>
            <SidebarSearchInput className={`lg:w-[250px]`}/>
        </SidebarHeader>
    )
}