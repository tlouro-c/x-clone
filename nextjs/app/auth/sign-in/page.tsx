
import Image from "next/image"
import {SignInForm} from "@/app/auth/sign-in/components/sign-in-form";


export default function SignIn() {

    return (
        <div className="w-full md:min-h-[100vh] flex flex-col md:flex-row justify-center md:gap-20 lg:gap-40 py-12">
            <div className={"flex justify-center items-center flex-col"}>
                <Image src={"/assets/images/x-logo-white.png"} alt={"X Logo"} width={1000} height={1000}
                       className={"h-32 w-32 md:h-64 md:w-64 hidden dark:block"} priority/>
                <Image src={"/assets/images/x-logo-black.png"} alt={"X Logo"} width={1000} height={1000}
                       className={"h-32 w-32 md:h-64 md:w-64 dark:hidden"} priority/>
                <span className={"text-xs p-1"}>Clone By Tomás</span>
            </div>
            <div className="flex items-center justify-center py-12">
                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2 text-center">
                        <h1 className="text-3xl font-bold">Login</h1>
                        <p className="text-balance text-muted-foreground">
                            Login with your e-mail or username
                        </p>
                    </div>
                    <SignInForm/>
                </div>
            </div>
        </div>
    )
}