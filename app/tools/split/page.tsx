"use client";

import { useState } from "react";
import { Scissors, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { FileUploader } from "@/components/ui/FileUploader";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";

export default function SplitPdfPage() {
    const [files, setFiles] = useState<File[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState<{ name: string; downloadUrl: string } | null>(null);
    const [pageRange, setPageRange] = useState("");
    const [splitOption, setSplitOption] = useState<"all" | "range">("all");

    const handleProcess = async () => {
        if (files.length === 0) return;

        setIsProcessing(true);
        setResult(null);

        try {
            const formData = new FormData();
            formData.append("file", files[0]);
            formData.append("splitMode", splitOption === "all" ? "all" : "ranges");
            if (splitOption === "range") {
                formData.append("ranges", pageRange);
            }

            const response = await fetch("/api/tools/split", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to split PDF");
            }

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);

            // The API returns a ZIP file usually
            setResult({
                name: "split_files.zip",
                downloadUrl,
            });
        } catch (error: any) {
            console.error("Split failed:", error);
            alert(error.message || "Failed to split file. Please try again.");
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
                            <Scissors className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle>Split PDF</CardTitle>
                            <CardDescription>
                                Extract pages or split your PDF into separate documents
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
                                <p className="text-sm font-medium text-foreground">Split Options</p>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="splitOption"
                                            checked={splitOption === "all"}
                                            onChange={() => setSplitOption("all")}
                                            className="w-4 h-4 text-primary"
                                        />
                                        <span className="text-sm text-foreground">Extract all pages</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="splitOption"
                                            checked={splitOption === "range"}
                                            onChange={() => setSplitOption("range")}
                                            className="w-4 h-4 text-primary"
                                        />
                                        <span className="text-sm text-foreground">Custom range</span>
                                    </label>
                                </div>

                                {splitOption === "range" && (
                                    <input
                                        type="text"
                                        value={pageRange}
                                        onChange={(e) => setPageRange(e.target.value)}
                                        placeholder="e.g., 1-5, 8, 10-12"
                                        className="w-full px-4 py-2.5 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                                    />
                                )}
                            </div>

                            <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-lg">
                                <p className="text-sm text-foreground">
                                    Ready to split <strong>{files[0].name}</strong>
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
                            <p className="text-sm text-success font-medium mb-3">
                                ✓ PDF split successfully!
                            </p>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-foreground">{result.name}</span>
                                <a href={result.downloadUrl} download={result.name}>
                                    <Button variant="outline" size="sm">
                                        Download ZIP
                                    </Button>
                                </a>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
