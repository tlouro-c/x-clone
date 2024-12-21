"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import {TweetActivityInterface} from "@/types/interfaces";

interface FeedContentContextType {
    feedContent: FeedContentInterface;
    setFeedContent: (value: (prevFeedContent: FeedContentInterface) => FeedContentInterface) => void;
}

// Create the context with a proper type and a default value
const FeedContentContext = createContext<FeedContentContextType | undefined>(undefined);

interface ProviderProps {
    children: ReactNode;
}

export interface FeedContentInterface {
    type: "For you" | "Following";
    tweetActivityList: TweetActivityInterface[]
}

export function FeedContentProvider({ children }: ProviderProps) {
    const [feedContent, setFeedContent] = useState<FeedContentInterface>({type: "For you", tweetActivityList: []});

    return (
        <FeedContentContext.Provider value={{ feedContent, setFeedContent }}>
            {children}
        </FeedContentContext.Provider>
    );
}

export function useFeedContent() {
    const context = useContext(FeedContentContext);
    if (!context) {
        throw new Error("useFeedContent must be used within a FeedContentProvider");
    }
    return context;
}