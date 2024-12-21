import {SettingsNav} from "@/app/(authenticated)/settings/components/settings-nav";
import {GoBackButton} from "@/app/(authenticated)/(right-side-bar)/[userId]/components/go-back-button";

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

export default function Settings() {

    return (
        <div className={"flex lg:hidden flex-col min-w-80 border-r"}>
            <div className={"sticky flex h-14 items-center ps-6 gap-6 justify-start bg-background/80 backdrop-blur-sm"}>
                <GoBackButton className={"block lg:hidden"}/>
                <p className={"text-xl font-bold"}>Settings</p>
            </div>
            <SettingsNav items={settingsNavItems}/>
        </div>
    )
}