"use client";

import { useState } from "react";
import { Merge, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { FileUploader } from "@/components/ui/FileUploader";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";

export default function MergePdfPage() {
    const [files, setFiles] = useState<File[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState<{ name: string; downloadUrl: string } | null>(null);

    const handleProcess = async () => {
        if (files.length < 2) return;

        setIsProcessing(true);
        setResult(null);

        try {
            const formData = new FormData();
            files.forEach(file => formData.append("files", file));

            const response = await fetch("/api/tools/merge", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to merge PDFs");
            }

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);

            setResult({
                name: "merged_document.pdf",
                downloadUrl,
            });
        } catch (error: any) {
            console.error("Merge failed:", error);
            alert(error.message || "Failed to merge files. Please try again.");
        } finally {
            setIsProcessing(false);
        }
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
                            <Merge className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle>Merge PDFs</CardTitle>
                            <CardDescription>
                                Combine multiple PDF files into a single document
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    <FileUploader
                        onFilesSelected={setFiles}
                        maxFiles={20}
                    />

                    {files.length >= 2 && (
                        <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-lg">
                            <p className="text-sm text-foreground">
                                Ready to merge <strong>{files.length}</strong> files
                            </p>
                            <Button
                                onClick={handleProcess}
                                isLoading={isProcessing}
                            >
                                Process with DocuMind
                            </Button>
                        </div>
                    )}

                    {files.length === 1 && (
                        <p className="text-sm text-warning text-center">
                            Please add at least 2 files to merge
                        </p>
                    )}

                    {result && (
                        <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                            <p className="text-sm text-success font-medium mb-2">
                                ✓ Files merged successfully!
                            </p>
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
