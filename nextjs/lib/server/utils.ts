import 'server-only'
import {ReadonlyRequestCookies} from "next/dist/server/web/spec-extension/adapters/request-cookies";
import {cookies} from "next/headers";
import {AuthenticationResponse} from "@/utils/auth";
import {jwtDecode} from "jwt-decode";
import {cache} from "react";

interface CookiesDetails {
    name: string;
    value: string;
    expires?: Date;
}

export async function setCookies(toSetCookies: CookiesDetails[], cookieStore: ReadonlyRequestCookies | null = null) {

    if (!cookieStore) {
        cookieStore = await cookies()
    }

    toSetCookies.forEach(cookie => {
        cookieStore.set({
            name: cookie.name,
            value: cookie.value,
            httpOnly: true,
            secure: true,
            expires: cookie.expires ?? undefined,
            path: '/'
        })
    })
}

export function extractCookieDetails(cookieString: string | undefined, cookieName: string): CookiesDetails | undefined {
    if (!cookieString) return undefined;

    const parts = cookieString.split(';').map(part => part.trim());
    const [name, value] = parts[0].split('=');

    if (name !== cookieName) return undefined;

    const expiresPart = parts.find(part => part.toLowerCase().startsWith('expires='));
    const expires = expiresPart ? new Date(expiresPart.split('=')[1]) : undefined;

    return {
        name,
        value,
        expires,
    };
}

export function getRefreshTokenCookieFromHeader(setCookieHeader: string[] | string) : CookiesDetails | undefined {

    setCookieHeader = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];

    const newRefreshToken = setCookieHeader.find(cookie =>
        cookie.startsWith('refresh_token')
    );
    return extractCookieDetails(newRefreshToken, 'refresh_token')
}

export async function assignNewAuthenticationCookies(data: AuthenticationResponse,
                                                     setCookieHeader: string[],
                                                     cookieStore: ReadonlyRequestCookies | null = null) {

    const newRefreshTokenCookie = getRefreshTokenCookieFromHeader(setCookieHeader)
    const newAccessTokenCookie = {name: 'access_token', value: data.accessToken}

    if (newRefreshTokenCookie) {
        await setCookies([newRefreshTokenCookie, newAccessTokenCookie], cookieStore)
    }
}

export const isTokenExpired = (token: string) => {
    try {
        const decoded = jwtDecode(token);

        // The `exp` claim is in Unix timestamp format (seconds since epoch)
        const currentTime = Math.floor(Date.now() / 1000); // current time in seconds
        const expirationTime = decoded.exp ?? currentTime;
        const timeLeft = expirationTime - currentTime;

        return timeLeft <= 20
    } catch (error) {
        console.error("Invalid token", error);
        return true; // If the token is invalid, we treat it as expired
    }
};

export const getAuthenticatedUserId = cache(async () => {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')?.value ?? ''

    if (!accessToken) {
        console.error("Access token is missing.");
        return ''
    }

    const userId = getTokenSubject(accessToken);
    if (!userId) {
        console.error("Failed to extract user ID from access token.");
        return '';
    }

    return userId
})

export const getTokenSubject = (token: string) => {
    return jwtDecode(token).sub
}

export function decodePassword(encodedPassword : string) {
    return Buffer.from(encodedPassword, 'base64').toString('utf8'); // Base64 decode
}

export const getIsEnabled = (token: string) => {
    const decoded = jwtDecode(token) as { isEnabled: string };
    return decoded.isEnabled == "t";
}

