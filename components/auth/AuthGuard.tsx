"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login?redirect=/ai-chat/demo"); // Redirect to login if not authenticated
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-muted text-sm animate-pulse">Checking authentication...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null; // Don't render anything while redirecting
    }

    return <>{children}</>;
}
