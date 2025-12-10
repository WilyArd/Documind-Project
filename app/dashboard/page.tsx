import { Merge, Scissors, Minimize2, Sparkles } from "lucide-react";
import { ToolCard } from "@/components/dashboard/ToolCard";

import { createClient } from "@/lib/supabase/server";
import { checkUsageLimit } from "@/lib/usage-limit";

const tools = [
    {
        title: "Merge PDFs",
        description: "Combine multiple PDF files into a single document quickly and easily.",
        icon: Merge,
        href: "/tools/merge",
    },
    {
        title: "Split PDF",
        description: "Extract pages or split your PDF into separate documents.",
        icon: Scissors,
        href: "/tools/split",
    },
    {
        title: "Compress PDF",
        description: "Reduce file size while maintaining quality for easy sharing.",
        icon: Minimize2,
        href: "/tools/compress",
    },
    {
        title: "Ask DocuMind AI",
        description: "Chat with your documents using AI. Get answers, summaries, and insights instantly.",
        icon: Sparkles,
        href: "/ai-chat/demo",
        featured: true,
    },
];

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let usageCount = 0;
    const LIMIT = 5;

    if (user) {
        const { count } = await checkUsageLimit(supabase, user.id);
        usageCount = count;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Hero Section */}
            <div className="text-center mb-10">
                <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
                    Manage your PDFs{" "}
                    <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        intelligently
                    </span>
                </h1>
                <p className="text-lg text-muted max-w-2xl mx-auto mb-6">
                    DocuMind combines powerful PDF tools with AI capabilities to help you
                    work smarter with your documents.
                </p>

                {/* Usage Stats Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border">
                    <div className="flex flex-col items-center">
                        <span className="text-sm font-medium text-muted-foreground">Daily Free Credits</span>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="w-32 h-2 bg-secondary/20 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${usageCount >= LIMIT ? 'bg-red-500' : 'bg-primary'}`}
                                    style={{ width: `${Math.min((usageCount / LIMIT) * 100, 100)}%` }}
                                ></div>
                            </div>
                            <span className={`text-sm font-bold ${usageCount >= LIMIT ? 'text-red-500' : 'text-primary'}`}>
                                {usageCount}/{LIMIT}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {tools.map((tool) => (
                    <ToolCard
                        key={tool.title}
                        title={tool.title}
                        description={tool.description}
                        icon={tool.icon}
                        href={tool.href}
                        featured={tool.featured}
                    />
                ))}
            </div>

            {/* Recent Documents Section */}
            <div className="mt-16">
                <h2 className="text-2xl font-semibold text-foreground mb-6">
                    Recent Documents
                </h2>
                <div className="bg-card border border-border rounded-xl p-8 text-center">
                    <p className="text-muted">
                        No documents yet. Upload your first PDF to get started!
                    </p>
                </div>
            </div>
        </div>
    );
}
