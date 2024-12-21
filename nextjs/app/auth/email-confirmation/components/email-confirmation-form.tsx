"use client"

import {startTransition, useActionState, useState} from "react";
import {confirmEmail} from "@/actions/auth-actions";
import {InputOTP, InputOTPGroup, InputOTPSlot} from "@/components/ui/input-otp";
import {Dot} from "lucide-react";
import * as React from "react";
import Loader from "@/components/ui/loader";
import {REGEXP_ONLY_DIGITS} from "input-otp";


export const EmailConfirmationForm = () => {

    const [state, action, isPending] = useActionState(confirmEmail, null)
    const [codeValue, setCodeValue] = useState<string>('')

    const handleOnChange = (value : string) => {
        setCodeValue(value)

        if (value.length >= 6) {
            startTransition(() => {
                action( {code: value} )
                setCodeValue('')

            })

        }
    }

    return (
        <div
            className={`flex flex-col gap-3 items-center justify-center transition-all ${isPending ? "opacity-50 pointer-events-none" : ""}`}>
            <div className="grid gap-2 text-sm text-rose-500"> {state ? state : <br/>} </div>
            <InputOTP
                maxLength={6}
                value={codeValue}
                onChange={handleOnChange}
                disabled={isPending}
                pattern={REGEXP_ONLY_DIGITS}
            >
                <InputOTPGroup className={"gap-1"}>
                    <InputOTPGroup>
                        <InputOTPSlot index={0}/>
                        <InputOTPSlot index={1}/>
                    </InputOTPGroup>
                    <Dot/>
                    <InputOTPGroup>
                        <InputOTPSlot index={2}/>
                        <InputOTPSlot index={3}/>
                    </InputOTPGroup>
                    <Dot/>
                    <InputOTPGroup>
                        <InputOTPSlot index={4}/>
                        <InputOTPSlot index={5}/>
                    </InputOTPGroup>
                </InputOTPGroup>
            </InputOTP>
            <p className="text-center text-sm">
                Enter the 6 digit code sent to your e-mail.
            </p>
            {isPending && (
                <div className="absolute inset-0 bg-foreground/25 flex items-center justify-center z-10">
                    <Loader/>
                </div>
            )}
        </div>
    )
}