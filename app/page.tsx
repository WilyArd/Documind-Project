
import Link from "next/link";
import { ArrowRight, Sparkles, Files, Scissors, Zap, Shield, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none z-[-1]">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] opacity-50 mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[128px] opacity-50 mix-blend-screen animate-pulse" style={{ animationDuration: '6s' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Sparkles className="w-4 h-4" />
            <span>New: AI-Powered PDF Assistant</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
            Master your documents <br />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">with intelligence</span>
          </h1>

          <p className="text-xl text-muted max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            DocuMind gives you superpowers for your PDFs. Merge, split, compress, and chat with your documents using advanced AI. Safe, fast, and free to start.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200">
            <Link href="/dashboard">
              <Button size="lg" className="h-12 px-8 text-base">
                Get Started for Free <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/ai-chat/demo">
              <Button variant="secondary" size="lg" className="h-12 px-8 text-base">
                Try AI Chat Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything you need</h2>
            <p className="text-muted">Powerful tools packaged in a beautiful, easy-to-use interface.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 text-blue-500 group-hover:scale-110 transition-transform">
                <Files className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Merge & Organize</h3>
              <p className="text-muted leading-relaxed">
                Combine multiple PDFs into a single, organized document. Rearrange pages and keep your workspace tidy.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-6 text-orange-500 group-hover:scale-110 transition-transform">
                <Scissors className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Split & Extract</h3>
              <p className="text-muted leading-relaxed">
                Separate a large PDF into smaller files or extract specific pages you need in seconds.
              </p>
            </div>

            {/* Feature 3 (AI) */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 hover:border-primary/50 transition-colors group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3">
                <span className="text-xs font-bold px-2 py-1 rounded bg-primary text-white">PRO</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Chat with AI</h3>
              <p className="text-muted leading-relaxed">
                Don't just read documents—talk to them. Ask questions, get summaries, and find information instantly with DocuMind AI.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust / Benefits */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Why professionals choose DocuMind</h2>
              <div className="space-y-4">
                {[
                  "Lighting fast processing speed",
                  "Secure file handling (files deleted after 1 hour)",
                  "Mobile-friendly responsive design",
                  "Generous free tier for daily use",
                  "No watermarks on your documents"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
              <Link href="/signup" className="inline-block mt-8">
                <Button variant="outline" size="lg">Start using for free</Button>
              </Link>
            </div>
            <div className="relative h-96 rounded-2xl bg-gradient-to-br from-card to-muted border border-border p-8 flex items-center justify-center overflow-hidden">
              {/* Decorative UI Mockup */}
              <div className="absolute inset-x-8 top-12 bottom-0 bg-background rounded-t-xl border border-border shadow-2xl p-4 opacity-90">
                <div className="flex items-center gap-2 mb-4 border-b border-border pb-4">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <div className="h-2 w-32 bg-muted rounded-full ml-4"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-32 bg-muted/20 rounded-lg w-full animate-pulse"></div>
                  <div className="flex gap-4">
                    <div className="h-20 bg-muted/20 rounded-lg w-1/3 animate-pulse delay-75"></div>
                    <div className="h-20 bg-muted/20 rounded-lg w-1/3 animate-pulse delay-150"></div>
                    <div className="h-20 bg-muted/20 rounded-lg w-1/3 animate-pulse delay-200"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
