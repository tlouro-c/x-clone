"use client"

import {Button} from "@/components/ui/button";
import * as React from "react";
import {startTransition, useActionState, useEffect, useState} from "react";
import {resendConfirmationEmail} from "@/actions/auth-actions";

export const ResendEmailButton = () => {

    const [state, action, isPending] = useActionState(resendConfirmationEmail, null)
    const [resendDisabled, setResendDisabled] = useState<boolean>(false);
    const [timer, setTimer] = useState<number>(0);

    const handleOnClick = () => {
        setResendDisabled(true)
        setTimer(60)
        startTransition(() => {
            action()
        })
    }

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (resendDisabled && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setResendDisabled(false);
        }
        return () => clearInterval(interval);
    }, [resendDisabled, timer]);

    return (
        <div className={"flex flex-col items-center w-8/12 gap-3"}>
            <Button onClick={handleOnClick} disabled={resendDisabled || isPending}>
                {resendDisabled ? `Resend in ${timer}s` : 'Resend code'}
            </Button>
            <p className="h-[50px] text-center text-xs text-muted-foreground"> {state ? state : ""} </p>
        </div>
    )
}