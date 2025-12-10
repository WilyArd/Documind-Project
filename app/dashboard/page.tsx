import { Merge, Scissors, Minimize2, Sparkles } from "lucide-react";
import { ToolCard } from "@/components/dashboard/ToolCard";

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

export default function DashboardPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Hero Section */}
            <div className="text-center mb-16">
                <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
                    Manage your PDFs{" "}
                    <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        intelligently
                    </span>
                </h1>
                <p className="text-lg text-muted max-w-2xl mx-auto">
                    DocuMind combines powerful PDF tools with AI capabilities to help you
                    work smarter with your documents.
                </p>
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
