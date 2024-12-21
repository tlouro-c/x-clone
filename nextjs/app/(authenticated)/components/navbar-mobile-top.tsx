import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import Link from "next/link";
import {MyAccountDropdownMenu} from "@/app/(authenticated)/components/my-account-dropdown-menu";


export const NavbarMobileTop = () => {

    return (
        <div className={"flex md:hidden w-full fixed top-0 h-12 justify-center items-center z-10"}>
            <MyAccountDropdownMenu className={"max-w-fit hover:bg-transparent absolute left-0 px-2 py-2"} avatarClassName={"h-8 w-8"}/>
            <Link href={"/home"} className={`px-3 py-1 flex rounded-full max-w-fit`}>
                <Avatar className={"w-10 h-10"}>
                    <AvatarImage className={"dark:hidden p-2"} src="/assets/images/x-logo-black.png"/>
                    <AvatarImage className={"hidden dark:block p-2"} src="/assets/images/x-logo-white.png"/>
                    <AvatarFallback>X</AvatarFallback>
                </Avatar>
                <span className={"text-xs self-end p-1 hidden lg:block"}>Clone By Tomás</span>
            </Link>
        </div>
    )
}