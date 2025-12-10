"use client";

import { useCallback, useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { Upload, X, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploaderProps {
    onFilesSelected: (files: File[]) => void;
    maxFiles?: number;
    maxSize?: number;
    accept?: Record<string, string[]>;
    className?: string;
}

export function FileUploader({
    onFilesSelected,
    maxFiles = 10,
    maxSize = 50 * 1024 * 1024, // 50MB
    accept = { "application/pdf": [".pdf"] },
    className,
}: FileUploaderProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [errors, setErrors] = useState<string[]>([]);

    const onDrop = useCallback(
        (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
            const newFiles = [...files, ...acceptedFiles].slice(0, maxFiles);
            setFiles(newFiles);
            onFilesSelected(newFiles);

            if (rejectedFiles.length > 0) {
                const errorMessages = rejectedFiles.map((rejection) => {
                    const fileName = rejection.file.name;
                    const errorCodes = rejection.errors.map((e) => e.code).join(", ");
                    return `${fileName}: ${errorCodes}`;
                });
                setErrors(errorMessages);
            } else {
                setErrors([]);
            }
        },
        [files, maxFiles, onFilesSelected]
    );

    const removeFile = (index: number) => {
        const newFiles = files.filter((_, i) => i !== index);
        setFiles(newFiles);
        onFilesSelected(newFiles);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept,
        maxFiles,
        maxSize,
    });

    return (
        <div className={cn("w-full", className)}>
            <div
                {...getRootProps()}
                className={cn(
                    "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300",
                    isDragActive
                        ? "border-primary bg-primary/5 scale-[1.02]"
                        : "border-border hover:border-primary/50 hover:bg-primary/5"
                )}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-4">
                    <div className={cn(
                        "p-4 rounded-full transition-colors",
                        isDragActive ? "bg-primary/20" : "bg-muted/20"
                    )}>
                        <Upload className={cn(
                            "w-8 h-8 transition-colors",
                            isDragActive ? "text-primary" : "text-muted"
                        )} />
                    </div>
                    <div>
                        <p className="text-lg font-medium text-foreground">
                            {isDragActive ? "Drop your files here" : "Drag & drop your PDFs here"}
                        </p>
                        <p className="text-sm text-muted mt-1">
                            or click to browse (max {maxFiles} files, {Math.round(maxSize / 1024 / 1024)}MB each)
                        </p>
                    </div>
                </div>
            </div>

            {errors.length > 0 && (
                <div className="mt-4 p-3 bg-error/10 border border-error/20 rounded-lg">
                    {errors.map((error, index) => (
                        <p key={index} className="text-sm text-error">
                            {error}
                        </p>
                    ))}
                </div>
            )}

            {files.length > 0 && (
                <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-foreground">
                        Selected files ({files.length})
                    </p>
                    {files.map((file, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-card border border-border rounded-lg"
                        >
                            <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-primary" />
                                <div>
                                    <p className="text-sm font-medium text-foreground truncate max-w-[200px]">
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-muted">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => removeFile(index)}
                                className="p-1 hover:bg-error/10 rounded-full transition-colors"
                            >
                                <X className="w-4 h-4 text-error" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
