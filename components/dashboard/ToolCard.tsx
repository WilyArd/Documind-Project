import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    href: string;
    featured?: boolean;
}

export function ToolCard({ title, description, icon: Icon, href, featured }: ToolCardProps) {
    return (
        <Link href={href} className="block group">
            <div
                className={cn(
                    "relative h-full p-6 rounded-xl transition-all duration-300",
                    "border bg-card hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1",
                    featured
                        ? "gradient-border"
                        : "border-border hover:border-primary/50"
                )}
            >
                {featured && (
                    <div className="absolute top-3 right-3 px-2 py-1 text-xs font-medium bg-gradient-to-r from-primary to-secondary text-white rounded-full">
                        AI Powered
                    </div>
                )}
                <div
                    className={cn(
                        "inline-flex p-3 rounded-xl mb-4 transition-all",
                        featured
                            ? "bg-gradient-to-br from-primary to-secondary text-white"
                            : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white"
                    )}
                >
                    <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">
                    {title}
                </h3>
                <p className="text-sm text-muted">
                    {description}
                </p>
            </div>
        </Link>
    );
}
