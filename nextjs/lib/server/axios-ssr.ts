import 'server-only'
import axios, {InternalAxiosRequestConfig} from "axios";
import {cookies} from "next/headers";
import {BasicApiResponseInterface, ChatBoxInterface, MessageInterface, UserInterface} from "@/types/interfaces";
import {cache} from "react";
import {AuthenticationResponse} from "@/utils/auth";


export const axiosSSR = axios.create({
    baseURL: process.env.API_URL,
});

axiosSSR.interceptors.request.use(
    async function (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("access_token")?.value ?? "";

        config.headers.set("Authorization", `Bearer ${accessToken}`);

        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

axiosSSR.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
});



// API calls

export const fetchUser =
    cache(async (userId: string | null) => axiosSSR.get<UserInterface>(`/users/${userId}`))

export const fetchEmailConfirmation =
    (confirmationCode: string) => axiosSSR.get<AuthenticationResponse>(`/auth/confirm-email?code=${confirmationCode}`)

export const fetchResendEmailConfirmationCode =
    () => axiosSSR.get<BasicApiResponseInterface>('/auth/resend-email-confirmation')

export const fetchUserFollowers =
    (userId: string, page: number) =>
        axiosSSR.get<UserInterface[]>(`/follows?user=${userId}&page=${page}&type=followers`)

export const fetchUserFollowing =
    (userId: string, page: number) =>
        axiosSSR.get<UserInterface[]>(`/follows?user=${userId}&page=${page}&type=following`)

export const fetchUserSearch =
    (content: string, page: number) =>
        axiosSSR.get<UserInterface[]>(`/users/search?toMatch=${content}&page=${page}`)

export const fetchUserChatBoxes =
    (userId: string, page: number) =>
        axiosSSR.get<ChatBoxInterface[]>(`/chat-box?user=${userId}&page=${page}`)

export const fetchChatBoxById =
    (chatBoxId: number) =>
        axiosSSR.get<ChatBoxInterface>(`/chat-box/${chatBoxId}`)

export const fetchChatBoxHistory =
    (chatBoxId: number) =>
        axiosSSR.get<MessageInterface[]>(`/chat-box/${chatBoxId}/history?page=1`)

