"use client"

import {usePathname} from "next/navigation";
import Link from "next/link";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
    items: {
        href: string
        title: string
    }[]
}

export const SettingsNav = ({ className, items, ...props }: SidebarNavProps)=> {
    const pathname = usePathname()

    return (
            <nav
                className={`flex flex-col gap-1 p-4 ${className}`}
                {...props}
            >
                {items.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex justify-between transition-colors text-sm p-2 rounded-md ${pathname.substring(pathname.indexOf("/")) == item.href ? "bg-foreground/10 font-bold" : "hover:underline" }`}
                    >
                        {item.title}
                        {pathname.substring(pathname.indexOf("/")) == item.href && (
                            <div className={"m-0 border border-blue-400 z-20 h-full rounded-md"}></div>
                        )}
                    </Link>
                ))}
            </nav>
    )
}
