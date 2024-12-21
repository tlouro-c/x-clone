"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {Button} from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import * as React from "react";


interface ClientFallbackProps {
    customErrorMessage?: string | null
}

export default function ClientFallback( {customErrorMessage} : ClientFallbackProps) {
    const [retrying, setRetrying] = useState(false); // Manage retry attempts
    const router = useRouter();

    const handleRetry = async () => {
        setRetrying(true);
        router.refresh();
        setRetrying(false)
    };

    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center text-center bg-background z-40 w-screen">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Something went wrong</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                {customErrorMessage ? customErrorMessage : "We couldn&#39;t load your information. Please try again."}
            </p>
            <div className="flex space-x-4 mt-6">
                <Button
                    disabled={retrying}
                    size={"sm"}
                    variant={"outline"}
                    onClick={handleRetry}
                >
                    Try Again
                </Button>
                <Button
                    disabled={retrying}
                    size={"sm"}
                    onClick={() => router.back()}
                >
                    Go Back
                </Button>

            </div>
            {retrying && (
                <div className="absolute inset-0 bg-foreground/25 flex items-center justify-center min0w-screen z-50">
                    <Loader/>
                </div>
            )}
        </div>
    );
}