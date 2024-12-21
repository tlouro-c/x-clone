import {SettingsNav} from "@/app/(authenticated)/settings/components/settings-nav";
import {ScrollArea} from "@/components/ui/scroll-area";

const settingsNavItems = [
    {
        title: "Profile",
        href: "/settings/profile",
    },
    {
        title: "Account",
        href: "/settings/account",
    },
    {
        title: "Appearance",
        href: "/settings/appearance",
    },
    {
        title: "Delete account",
        href: "/settings/delete-account",
    }
]

export default function SettingsLayout({
                                           children,
                                       }: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <div className={"flex min-h-screen"}>
            <div className={"hidden lg:flex flex-col min-w-96 border-r"}>
                <div className={"sticky flex h-14 items-center ps-6 bg-background/80 backdrop-blur-sm"}>
                    <p className={"text-xl font-bold"}>Settings</p>
                </div>
                <SettingsNav items={settingsNavItems}/>
            </div>
            <ScrollArea>

            </ScrollArea>

            <main className={"w-full"}>{children}</main>
        </div>
    )
}