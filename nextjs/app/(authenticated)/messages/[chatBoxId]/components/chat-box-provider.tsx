"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import {MessageInterface, UserInterface} from "@/types/interfaces";

interface ChatBoxContextType {
    chatBox: ChatBoxContextInterface;
    setChatBox: (value: (prevChatBoxContext: ChatBoxContextInterface) => ChatBoxContextInterface) => void;
}

// Create the context with a proper type and a default value
const ChatBoxContext = createContext<ChatBoxContextType | undefined>(undefined);

interface ProviderProps {
    value: {id: number, authenticatedUser: UserInterface, otherUser: UserInterface, history: MessageInterface[]};
    children: ReactNode;
}

export interface ChatBoxContextInterface {
    id: number
    authenticatedUser: UserInterface
    otherUser: UserInterface
    history: MessageInterface[]
}

export function ChatBoxProvider({ children, value }: ProviderProps) {
    const [chatBox, setChatBox] = useState<ChatBoxContextInterface>(value);

    return (
        <ChatBoxContext.Provider value={{ chatBox, setChatBox }}>
            {children}
        </ChatBoxContext.Provider>
    );
}

export function useChatBox() {
    const context = useContext(ChatBoxContext);
    if (!context) {
        throw new Error("useChatBox must be used within a ChatBoxContextProvider");
    }
    return context;
}