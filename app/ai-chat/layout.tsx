import { Navbar } from "@/components/layout/Navbar";
import AuthGuard from "@/components/auth/AuthGuard";

export default function AiChatLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthGuard>
            <div className="h-screen flex flex-col bg-background">
                <Navbar />
                <main className="flex-1 overflow-hidden">{children}</main>
            </div>
        </AuthGuard>
    );
}
