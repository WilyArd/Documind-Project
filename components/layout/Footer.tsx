
import Link from "next/link";
import { Brain, Twitter, Github, Linkedin, Mail } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t border-border/50 bg-card/50 backdrop-blur-sm mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4 group w-fit">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-secondary group-hover:shadow-lg group-hover:shadow-primary/25 transition-all">
                                <Brain className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                DocuMind
                            </span>
                        </Link>
                        <p className="text-muted text-sm max-w-xs leading-relaxed">
                            Intelligent document processing for the modern era. Merge, split, compress, and chat with your PDFs powered by advanced AI.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Product</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/tools/merge" className="text-muted hover:text-primary transition-colors">Merge PDF</Link></li>
                            <li><Link href="/tools/split" className="text-muted hover:text-primary transition-colors">Split PDF</Link></li>
                            <li><Link href="/tools/compress" className="text-muted hover:text-primary transition-colors">Compress PDF</Link></li>
                            <li><Link href="/ai-chat/demo" className="text-muted hover:text-primary transition-colors">AI Chat</Link></li>
                        </ul>
                    </div>

                    {/* Legal/Social */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Connect</h3>
                        <div className="flex gap-4 mb-4">
                            <a href="#" className="p-2 rounded-lg bg-primary/5 text-muted hover:text-primary hover:bg-primary/10 transition-colors">
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a href="#" className="p-2 rounded-lg bg-primary/5 text-muted hover:text-primary hover:bg-primary/10 transition-colors">
                                <Github className="w-4 h-4" />
                            </a>
                            <a href="#" className="p-2 rounded-lg bg-primary/5 text-muted hover:text-primary hover:bg-primary/10 transition-colors">
                                <Mail className="w-4 h-4" />
                            </a>
                        </div>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="#" className="text-muted hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="text-muted hover:text-primary transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted">
                    <p>© {new Date().getFullYear()} DocuMind. All rights reserved.</p>
                    <p>Designed with ❤️ for efficiency.</p>
                </div>
            </div>
        </footer>
    );
}
