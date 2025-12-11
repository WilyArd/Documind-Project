import { Merge, Scissors, Minimize2, Sparkles, History, Brain } from "lucide-react";
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
    let recentLogs: any[] = [];

    if (user) {
        // Fetch usage count
        const { count } = await checkUsageLimit(supabase, user.id);
        usageCount = count;

        // Fetch recent logs
        const { data: logs } = await supabase
            .from("logs")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(5);

        recentLogs = logs || [];
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
        });
    }

    const getActionLabel = (action: string) => {
        switch (action) {
            case "merge_pdf": return "Merged PDFs";
            case "split_pdf": return "Split PDF";
            case "compress_pdf": return "Compressed PDF";
            case "ai-chat": return "Chatted with AI";
            default: return action.replace(/_/g, " ");
        }
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col min-h-[calc(100vh-4rem)]">
            {/* Header Content */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                        Welcome back!
                    </h1>
                    <p className="text-muted">
                        Ready to process some documents today?
                    </p>
                </div>

                {/* Usage Card */}
                <div className="bg-card/50 backdrop-blur-sm border border-border/50 p-4 rounded-xl flex items-center gap-4 min-w-[280px]">
                    <div className={`p-3 rounded-lg ${usageCount >= LIMIT ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary'}`}>
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-foreground">Daily Credits</span>
                            <span className={`text-xs font-bold ${usageCount >= LIMIT ? 'text-red-500' : 'text-primary'}`}>{usageCount}/{LIMIT} Used</span>
                        </div>
                        <div className="w-full h-2 bg-secondary/20 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${usageCount >= LIMIT ? 'bg-red-500' : 'bg-primary'}`}
                                style={{ width: `${Math.min((usageCount / LIMIT) * 100, 100)}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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

            {/* Recent Activity Section */}
            <div className="mt-4">
                <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                    <History className="w-5 h-5 text-muted" />
                    Recent Activity
                </h2>

                {recentLogs.length > 0 ? (
                    <div className="bg-card border border-border rounded-xl divide-y divide-border/50 overflow-hidden">
                        {recentLogs.map((log) => (
                            <div key={log.id} className="p-4 flex items-center justify-between hover:bg-muted/5 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 rounded-lg bg-secondary/10 text-secondary-foreground">
                                        {log.action === 'ai-chat' ? <Sparkles className="w-4 h-4" /> :
                                            log.action.includes('merge') ? <Merge className="w-4 h-4" /> :
                                                log.action.includes('split') ? <Scissors className="w-4 h-4" /> :
                                                    log.action.includes('compress') ? <Minimize2 className="w-4 h-4" /> :
                                                        <Brain className="w-4 h-4" />}
                                    </div>
                                    <div>
                                        <p className="font-medium text-foreground capitalize">{getActionLabel(log.action)}</p>
                                        <p className="text-xs text-muted">Action ID: {log.id.slice(0, 8)}</p>
                                    </div>
                                </div>
                                <span className="text-sm text-muted">{formatDate(log.created_at)}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-card/50 border border-border border-dashed rounded-xl p-8 text-center">
                        <div className="inline-flex p-3 rounded-full bg-muted/20 mb-3">
                            <History className="w-6 h-6 text-muted" />
                        </div>
                        <p className="text-muted">No recent activity found.</p>
                        <p className="text-xs text-muted-foreground mt-1">Start using tools to see your history here.</p>
                    </div>
                )}
            </div>

            {/* Minimal Dashboard Footer */}
            <div className="mt-auto pt-12 border-t border-border/30 text-center text-xs text-muted">
                <p>© {new Date().getFullYear()} DocuMind. All rights reserved.</p>
            </div>
        </div>
    );
}
