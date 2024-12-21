import Image from "next/image"
import {SignUpForm} from "@/app/auth/sign-up/components/sign-up-form";

export default function Signup() {

    return (
        <div className="w-full min-h-[100vh] flex flex-col md:flex-row md:gap-20 md:justify-center lg:gap-40 py-12 max-h-screen overflow-y-auto">
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
                        <h1 className="text-3xl font-bold">Create an account</h1>
                        <p className="text-balance text-muted-foreground">
                            Enter your information below to create an account
                        </p>
                    </div>
                    <SignUpForm/>
                </div>
            </div>
        </div>
    )
}