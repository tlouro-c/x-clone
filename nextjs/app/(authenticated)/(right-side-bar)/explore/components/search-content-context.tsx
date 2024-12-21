"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import {TweetActivityInterface, UserInterface} from "@/types/interfaces";

interface SearchContentContextType {
    searchContent: SearchContentInterface;
    setSearchContent: (value: (prevFeedContent: SearchContentInterface) => SearchContentInterface) => void;
}

// Create the context with a proper type and a default value
const SearchContentContext = createContext<SearchContentContextType | undefined>(undefined);

interface ProviderProps {
    children: ReactNode;
}

export interface SearchContentInterface {
    type: "Top" | "People";
    peopleList?: UserInterface[];
    tweetsList?: TweetActivityInterface[];
}

export function SearchContentProvider({ children }: ProviderProps) {
    const [searchContent, setSearchContent] = useState<SearchContentInterface>({type: "Top"});

    return (
        <SearchContentContext.Provider value={{ searchContent, setSearchContent }}>
            {children}
        </SearchContentContext.Provider>
    );
}

export function useSearchContent() {
    const context = useContext(SearchContentContext);
    if (!context) {
        throw new Error("useFeedContent must be used within a SearchContentProvider");
    }
    return context;
}