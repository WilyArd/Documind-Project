"use client";

import { useState, useRef, useEffect, use } from "react";
import { Send, FileText, Sparkles, ArrowLeft, History, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { FileUploader } from "@/components/ui/FileUploader";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    created_at?: string;
}

export default function AiChatPage({ params }: { params: Promise<{ docId: string }> }) {
    const { docId } = use(params);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);
    const [activeTab, setActiveTab] = useState<"chat" | "pdf">("chat"); // Mobile tab state
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Fetch chat history on mount
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await fetch(`/api/chat/history?docId=${docId}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.messages && data.messages.length > 0) {
                        setMessages(data.messages);
                    } else {
                        // Default welcome message if no history
                        setMessages([{
                            id: "welcome",
                            role: "assistant",
                            content: "Hi! I'm DocuMind AI. Upload a PDF to get started, then ask me anything about it!",
                        }]);
                    }
                }
            } catch (error) {
                console.error("Failed to load chat history", error);
            } finally {
                setIsInitializing(false);
            }
        };

        fetchHistory();
    }, [docId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isInitializing]);

    const saveMessage = async (role: "user" | "assistant", content: string) => {
        try {
            await fetch("/api/chat/history", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ docId, role, content }),
            });
        } catch (error) {
            console.error("Failed to save message", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userContent = input.trim();
        const tempId = Date.now().toString();

        // Optimistic UI update
        const userMessage: Message = {
            id: tempId,
            role: "user",
            content: userContent,
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        // Save user message in background
        saveMessage("user", userContent);

        try {
            const formData = new FormData();
            formData.append("message", userContent);
            formData.append("docId", docId);
            if (selectedFile) {
                formData.append("file", selectedFile);
            }

            const response = await fetch("/api/ai-chat", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                const aiMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    content: data.response || data.message, // handle potential api response diff
                };
                setMessages((prev) => [...prev, aiMessage]);
                // Save AI response in background
                saveMessage("assistant", data.response || data.message);
            } else {
                // Handle error (e.g., limit reached)
                const errorMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    content: data.error || "Something went wrong.",
                };
                setMessages((prev) => [...prev, errorMessage]);
            }
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "Failed to connect to the server.",
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileSelect = (files: File[]) => {
        if (files.length > 0) {
            setSelectedFile(files[0]);
            // Optional: Auto-switch to chat tab on mobile after upload?
        }
    };

    const removeFile = () => {
        setSelectedFile(null);
    };

    if (isInitializing) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center gap-2">
                    <History className="w-8 h-8 text-muted" />
                    <span className="text-sm text-muted">Loading chat history...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col md:flex-row">
            {/* Mobile Tab Switcher */}
            <div className="md:hidden flex border-b border-border bg-background">
                <button
                    onClick={() => setActiveTab("pdf")}
                    className={`flex-1 p-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === "pdf"
                        ? "border-primary text-primary bg-primary/5"
                        : "border-transparent text-muted hover:text-foreground"
                        }`}
                >
                    <FileText className="w-4 h-4" />
                    Document
                </button>
                <button
                    onClick={() => setActiveTab("chat")}
                    className={`flex-1 p-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === "chat"
                        ? "border-primary text-primary bg-primary/5"
                        : "border-transparent text-muted hover:text-foreground"
                        }`}
                >
                    <Sparkles className="w-4 h-4" />
                    Chat with AI
                </button>
            </div>

            {/* Left Panel: File Upload / Info */}
            <div className={`md:flex md:w-1/2 flex-col border-r border-border ${activeTab === "pdf" ? "flex flex-1" : "hidden"}`}>
                <div className="p-4 border-b border-border flex items-center gap-3">
                    <Link
                        href="/dashboard"
                        className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <FileText className="w-5 h-5 text-primary" />
                    <span className="font-medium text-foreground">Document Context</span>
                </div>
                <div className="flex-1 p-6 bg-muted/10 overflow-y-auto">
                    {!selectedFile ? (
                        <div className="h-full flex flex-col items-center justify-center text-center">
                            <FileUploader
                                onFilesSelected={handleFileSelect}
                                maxFiles={1}
                                maxSize={10 * 1024 * 1024} // 10MB
                                className="max-w-md mx-auto"
                            />
                            <p className="text-sm text-muted mt-4">
                                Upload a PDF to query it with AI.
                            </p>
                        </div>
                    ) : (
                        <div className="max-w-md mx-auto">
                            <div className="p-6 bg-card border border-border rounded-xl shadow-sm text-center">
                                <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
                                    <FileText className="w-12 h-12 text-primary" />
                                </div>
                                <h3 className="text-lg font-semibold text-foreground mb-2 truncate" title={selectedFile.name}>
                                    {selectedFile.name}
                                </h3>
                                <p className="text-sm text-muted mb-6">
                                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                                <Button
                                    variant="outline"
                                    onClick={removeFile}
                                    className="w-full"
                                >
                                    Remove / Change File
                                </Button>
                            </div>
                            <div className="mt-6 text-center">
                                <p className="text-sm text-muted">
                                    File is ready. Switch to the chat tab to ask questions!
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Panel */}
            <div className={`flex-1 flex flex-col ${activeTab === "chat" ? "flex" : "hidden md:flex"}`}>
                {/* Chat Header */}
                <div className="p-4 border-b border-border flex items-center gap-3">
                    <Link
                        href="/dashboard"
                        className="md:hidden p-2 hover:bg-primary/10 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-secondary">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-foreground">DocuMind AI</h2>
                        <p className="text-xs text-muted">
                            Powered by Gemini • {selectedFile ? "File Loaded" : "No File Loaded"}
                        </p>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[80%] p-4 rounded-2xl ${message.role === "user"
                                    ? "bg-primary text-white rounded-br-md"
                                    : "bg-card border border-border rounded-bl-md"
                                    }`}
                            >
                                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-card border border-border p-4 rounded-2xl rounded-bl-md">
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-border">
                    <form onSubmit={handleSubmit} className="flex gap-3">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={selectedFile ? "Ask about your PDF..." : "Talk to the AI (Upload a PDF for context)..."}
                            className="flex-1 px-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                            disabled={isLoading}
                        />
                        <Button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="px-4"
                        >
                            <Send className="w-5 h-5" />
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
