import * as React from "react"

import {EmailConfirmationForm} from "@/app/auth/email-confirmation/components/email-confirmation-form";
import {ResendEmailButton} from "@/app/auth/sign-up/components/resend-email-button";

import {signOut} from "@/actions/auth-actions";
import {Button} from "@/components/ui/button";

export default function EmailConfirmation() {

    return (
        <div className="w-full min-h-[100vh] flex flex-col justify-center items-center gap-3">
            <EmailConfirmationForm/>
            <ResendEmailButton/>
            <Button variant={"outline"} className={"absolute bottom-0 left-0 m-5"} onClick={signOut}>
                Sign out
            </Button>
        </div>
    )
}
