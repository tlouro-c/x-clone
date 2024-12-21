"use server"

import {AuthenticationResponse} from "@/utils/auth";
import {redirect} from 'next/navigation';
import {AxiosError} from "axios";
import {assignNewAuthenticationCookies, decodePassword, setCookies} from "@/lib/server/utils";
import {cookies} from "next/headers";
import {
    axiosSSR,
    fetchEmailConfirmation,
    fetchResendEmailConfirmationCode
} from "@/lib/server/axios-ssr";

interface SignUpParams {
    email: string;
    username: string;
    name: string;
    password: string;
    repeatPassword: string;
}

interface SignInParams {
    login: string;
    password: string;
}

export async function signUp(prevState : string | null,
                             { email, username, name, password, repeatPassword }: SignUpParams) : Promise<string> {

    try {
        const {data, headers} = await axiosSSR.post<AuthenticationResponse>("/auth/register",
            { email, name, username, password:decodePassword(password), repeatPassword:decodePassword(repeatPassword) });

        const setCookieHeader = headers['set-cookie']
        if (setCookieHeader) {
            await assignNewAuthenticationCookies(data, setCookieHeader)
        }

    } catch (error) {
        if (error instanceof AxiosError) {
            return error.response?.data.detail.split(".").at(0) ?? "Currently unavailable, try again later...";
        }
        return "Currently unavailable, try again later...";
    }
    redirect("/auth/email-confirmation")
}

export async function signIn(prevState : string | null,
                             { login, password }: SignInParams) : Promise<string> {

    let redirectionUrl = "/home"
    try {
        const { data, headers } = await axiosSSR.post<AuthenticationResponse>(`/auth/login`,
            { login, password:decodePassword(password) });

        const setCookieHeader = headers['set-cookie']
        if (setCookieHeader) {
            await assignNewAuthenticationCookies(data, setCookieHeader)
        }

        if (data.hasPendingEmailConfirmation) {
            redirectionUrl = "/auth/email-confirmation"
        }
    } catch (error) {
        if (error instanceof AxiosError) {
            return error.response?.data.detail.split(".").at(0) ?? "Currently unavailable, try again later...";
        }
        return "Currently unavailable, try again later...";
    }
    redirect(redirectionUrl)
}

export async function signOut() {
    await axiosSSR.post("/auth/logout").catch(() => {})

    const cookieStore = await cookies()
    cookieStore.delete('access_token')
    cookieStore.delete('refresh_token')
    cookieStore.delete('user_id')
    redirect("/auth/sign-in")
}


export async function confirmEmail(prevState : string | null, { code } : { code:string }): Promise<string | null> {

    try {
        const { data } = await fetchEmailConfirmation(code)

        const newAccessTokenCookie = {name: 'access_token', value: data.accessToken}
        await setCookies([newAccessTokenCookie])

    } catch (error) {
        if (error instanceof AxiosError) {
            return error.response?.data.detail
        }
        return "E-mail confirmation failed, try again later...";
    }
    redirect("/home")
}

export async function resendConfirmationEmail() : Promise<string | null> {

    try {
        const { data } = await fetchResendEmailConfirmationCode()
        return data.message ?? null
    } catch (error) {
        if (error instanceof AxiosError) {
            return error.response?.data.detail
        }
        return "E-mail confirmation re-sending failed, try again later...";
    }
}

