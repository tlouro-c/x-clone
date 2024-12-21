"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import {UserInterface} from "@/types/interfaces";

interface AuthenticatedUserContextType {
    authenticatedUser: AuthenticatedUserInterface;
    setAuthenticatedUser: (value: (prevAuthenticatedUser: AuthenticatedUserInterface) => AuthenticatedUserInterface) => void;
}

// Create the context with a proper type and a default value
const AuthenticatedUserContext = createContext<AuthenticatedUserContextType | undefined>(undefined);

interface ProviderProps {
    value: UserInterface;
    children: ReactNode;
}

export interface AuthenticatedUserInterface {
    id: string
    name: string
    username: string
    avatar: string | null
}

export function AuthenticatedUserProvider({ children, value }: ProviderProps) {
    const [authenticatedUser, setAuthenticatedUser] = useState<AuthenticatedUserInterface>({id: value.id, name: value.name, username: value.username, avatar: value.avatar});

    return (
        <AuthenticatedUserContext.Provider value={{ authenticatedUser, setAuthenticatedUser }}>
            {children}
        </AuthenticatedUserContext.Provider>
    );
}

export function useAuthenticatedUser() {
    const context = useContext(AuthenticatedUserContext);
    if (!context) {
        throw new Error("useFeedContent must be used within a AuthenticatedUserProvider");
    }
    return context;
}