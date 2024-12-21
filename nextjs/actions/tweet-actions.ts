"use server"

import {axiosSSR} from "@/lib/server/axios-ssr";
import {AxiosError} from "axios";
import {TweetActivityInterface, TweetInterface} from "@/types/interfaces";

interface createTweetForm {
    userId: string,
    content: string
}

export interface CreateTweetState {
    ok: boolean,
    response?: TweetActivityInterface,
    detail?: string
}

export const createTweetAction = async (prevState: CreateTweetState | null, tweetForm: createTweetForm): Promise<CreateTweetState> => {

    try {
        const { data } = await axiosSSR.post<TweetActivityInterface>("/tweets", tweetForm)
        return {ok: true, response: data}
    } catch (error) {
        if (error instanceof AxiosError) {
            return {ok: false, detail: error.response?.data.detail ?? "Failed to create the tweet"}
        }
        return {ok: false, detail: "Failed to create the tweet"}
    }
}


export const fetchProfileContentAction = async (prevState: TweetActivityInterface[] | null, queryString: string): Promise<TweetActivityInterface[]> => {
   return axiosSSR.get<TweetActivityInterface[]>(`/activity?${queryString}`)
        .then(response => { return response.data })
        .catch(() => { return [] })
}


interface FeedContentActionParams {
    type: 'for-you' | 'following';
    queryString: string;
}

export const fetchFeedContentAction = async (prevState: TweetActivityInterface[] | null, params: FeedContentActionParams): Promise<TweetActivityInterface[]> => {
    return axiosSSR.get<TweetActivityInterface[]>(`/activity/${params.type}?${params.queryString}`)
        .then(response => { return response.data })
        .catch(() => { return [] })
}

export const tweetSearchAction = async (prevState: TweetActivityInterface[], toMatch: string): Promise<TweetActivityInterface[]> => {

    try {
        const { data } = await axiosSSR.get<TweetActivityInterface[]>(`/tweets/search?toMatch=${toMatch}&page=1`)
        return data
    } catch (error) {
        return []
    }
}

interface TweetInteractionState {
    ok: boolean
    type: string
    message?: string
    detail?: string
}

export interface TweetInteractionOptions {
    type: string
    tweetId: number
}

export const tweetInteractionAction = async (prevState: TweetInteractionState | null, options: TweetInteractionOptions): Promise<TweetInteractionState> => {

    try {
        const { data } = await axiosSSR.get<{ message: string }>(`/tweets/${options.tweetId}/${options.type}`)
        return {ok: true, type: options.type, message: data.message}
    } catch (error) {
        if (error instanceof AxiosError) {
            return {ok: false, type: options.type, detail: error.response?.data.detail ?? `Failed to ${options.type} the tweet`}
        }
        return {ok: false, type: options.type, detail: `Failed to ${options.type} the tweet`}
    }
}

interface TweetDeletionState {
    ok: boolean
    message?: string
    detail?: string
}

export const deleteTweetAction = async (prevState: TweetDeletionState | null, tweetId: number): Promise<TweetDeletionState> => {

    try {
        const { data } = await axiosSSR.delete<{ message: string }>(`tweets/${tweetId}`)
        return {ok: true, message: data.message}
    } catch (error) {
        if (error instanceof AxiosError) {
            return {ok: false, detail: error.response?.data.detail ?? `Failed to delete the tweet`}
        }
        return {ok: false, detail: `Failed to delete the tweet`}
    }

}