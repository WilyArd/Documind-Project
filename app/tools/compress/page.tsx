"use client";

import { useState } from "react";
import { Minimize2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { FileUploader } from "@/components/ui/FileUploader";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";

export default function CompressPdfPage() {
    const [files, setFiles] = useState<File[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState<{ name: string; originalSize: number; compressedSize: number; downloadUrl: string } | null>(null);
    const [compressionLevel, setCompressionLevel] = useState<"low" | "medium" | "high">("medium");

    const handleProcess = async () => {
        if (files.length === 0) return;

        setIsProcessing(true);
        setResult(null);

        try {
            const formData = new FormData();
            formData.append("file", files[0]);
            formData.append("level", compressionLevel === "low" ? "extreme" : compressionLevel === "medium" ? "recommended" : "low");
            // Note: UI "low" compression means high quality (low reduction). 
            // Wait, UI says "Low ~20% smaller". iLovePDF 'low' means low compression (high quality).
            // UI says "High ~60% smaller". iLovePDF 'extreme' means high compression (low quality).
            // So: 
            // UI "Low" -> iLovePDF "low"
            // UI "Medium" -> iLovePDF "recommended"
            // UI "High" -> iLovePDF "extreme"
            // Let's map it correctly based on the UI labels.

            const apiLevel = compressionLevel === "low" ? "low" : compressionLevel === "medium" ? "recommended" : "extreme";
            formData.set("level", apiLevel);

            const response = await fetch("/api/tools/compress", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to compress PDF");
            }

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const compressedSize = blob.size;

            setResult({
                name: `compressed_${files[0].name}`,
                originalSize: files[0].size,
                compressedSize,
                downloadUrl,
            });
        } catch (error: any) {
            console.error("Compression failed:", error);
            alert(error.message || "Failed to process file. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    return (
        <div>
            <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-muted hover:text-foreground transition-colors mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
            </Link>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-primary/10">
                            <Minimize2 className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle>Compress PDF</CardTitle>
                            <CardDescription>
                                Reduce file size while maintaining quality for easy sharing
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    <FileUploader
                        onFilesSelected={setFiles}
                        maxFiles={1}
                    />

                    {files.length > 0 && (
                        <>
                            <div className="space-y-4">
                                <p className="text-sm font-medium text-foreground">Compression Level</p>
                                <div className="grid grid-cols-3 gap-3">
                                    {(["low", "medium", "high"] as const).map((level) => (
                                        <button
                                            key={level}
                                            onClick={() => setCompressionLevel(level)}
                                            className={`p-3 rounded-lg border text-sm font-medium transition-all ${compressionLevel === level
                                                ? "border-primary bg-primary/10 text-primary"
                                                : "border-border hover:border-primary/50 text-muted hover:text-foreground"
                                                }`}
                                        >
                                            <span className="block capitalize">{level}</span>
                                            <span className="block text-xs mt-1 opacity-75">
                                                {level === "low" ? "~20% smaller" : level === "medium" ? "~40% smaller" : "~60% smaller"}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-lg">
                                <p className="text-sm text-foreground">
                                    Ready to compress <strong>{files[0].name}</strong> ({formatSize(files[0].size)})
                                </p>
                                <Button
                                    onClick={handleProcess}
                                    isLoading={isProcessing}
                                >
                                    Process with DocuMind
                                </Button>
                            </div>
                        </>
                    )}

                    {result && (
                        <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                            <p className="text-sm text-success font-medium mb-2">
                                ✓ PDF compressed successfully!
                            </p>
                            <div className="flex items-center justify-between text-sm text-foreground mb-3">
                                <span>
                                    {formatSize(result.originalSize)} → {formatSize(result.compressedSize)}
                                </span>
                                <span className="text-success font-medium">
                                    {Math.round((1 - result.compressedSize / result.originalSize) * 100)}% smaller
                                </span>
                            </div>
                            <a href={result.downloadUrl} download={result.name}>
                                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                                    Download {result.name}
                                </Button>
                            </a>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
