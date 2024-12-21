"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import {TweetActivityInterface} from "@/types/interfaces";

interface TweetContextType {
    tweetContext: TweetContextInterface;
    setTweetContext: (value: (prevTweetContext: TweetContextInterface) => TweetContextInterface) => void;
}

// Create the context with a proper type and a default value
const TweetContext = createContext<TweetContextType | undefined>(undefined);

interface ProviderProps {
    value: {tweetActivity: TweetActivityInterface, authenticatedUserId: string};
    children: ReactNode;
}

export interface TweetContextInterface {
    tweetActivity: TweetActivityInterface
    authenticatedUserId: string
}

export function TweetProvider({ children, value }: ProviderProps) {
    const [tweetContext, setTweetContext] = useState<TweetContextInterface>(value);

    return (
        <TweetContext.Provider value={{ tweetContext, setTweetContext }}>
            {children}
        </TweetContext.Provider>
    );
}

export function useTweet() {
    const context = useContext(TweetContext);
    if (!context) {
        throw new Error("useTweet must be used within a TweetContextProvider");
    }
    return context;
}