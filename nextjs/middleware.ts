import {NextRequest, NextResponse} from "next/server";
import {axiosSSR} from "@/lib/server/axios-ssr";
import {getIsEnabled, getRefreshTokenCookieFromHeader, isTokenExpired} from "@/lib/server/utils";
import {AuthenticationResponse} from "@/utils/auth";

export async function middleware(req: NextRequest) {

    // console.log(`Middleware for ${req.nextUrl.href}`)

    const res = applyPathnameRedirections(req)

    return verifyAuthentication(req, res)
}

function applyPathnameRedirections(req: NextRequest) {

    switch (req.nextUrl.pathname) {
        case "/":
            return NextResponse.redirect(new URL("/home", req.url));
    }
    return NextResponse.next()
}


async function verifyAuthentication(req: NextRequest, res: NextResponse) : Promise<NextResponse> {

    const accessToken = req.cookies.get('access_token')?.value ?? ''

    if (!isTokenExpired(accessToken)) {
        if(!getIsEnabled(accessToken) && req.nextUrl.pathname != "/auth/email-confirmation") {
            return NextResponse.redirect(new URL("/auth/email-confirmation", req.url))
        }
        return res
    }

    try {
        const refreshToken = req.cookies.get('refresh_token')?.value
        const {data, headers} = await axiosSSR.post<AuthenticationResponse>(
            '/auth/refresh-token',
            undefined,
            {
                headers: { Cookie: `refresh_token=${refreshToken}` }
            }
        )

        if (data.hasPendingEmailConfirmation && req.nextUrl.pathname != '/auth/email-confirmation') {
            res = NextResponse.redirect(new URL("/auth/email-confirmation", req.url))
        }

        const setCookieHeader = headers["set-cookie"] ?? []
        const newRefreshTokenCookie = getRefreshTokenCookieFromHeader(setCookieHeader)
        res.cookies.set('refresh_token', newRefreshTokenCookie?.value ?? '', {
            httpOnly: true,
            secure: true,
            path: '/',
            expires: newRefreshTokenCookie?.expires
        })
        res.cookies.set('access_token', data.accessToken, {
            httpOnly: true,
            secure: true,
            path: '/'
        })
        return res
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return NextResponse.redirect(new URL("/auth/sign-in", req.url))
    }
}

export const config = {
    matcher: [
        "/((?!auth/sign-up|auth/sign-in|api|_next|static|public|favicon.ico|assets/images/).*)"
    ]
}