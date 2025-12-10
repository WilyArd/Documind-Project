import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const files = formData.getAll("files") as File[];

        if (!files || files.length < 2) {
            return NextResponse.json(
                { error: "Please upload at least 2 PDF files to merge." },
                { status: 400 }
            );
        }

        // Merge requires a specific task flow: create task, add multiple files, process
        // Our processFile helper currently adds one file. We need to modify it or logic here.
        // For merge, we can't use the simple processFile helper as is because it creates a new task per file.
        // We need to write custom logic for merge here using the shared ilovepdf instance.

        // Changing approach: Let's use the helper for single-file tasks, but write custom logic here for multi-file merge.
        const { default: ilovepdf } = await import("@/lib/ilovepdf");
        const { default: ILovePDFFile } = await import("@ilovepdf/ilovepdf-nodejs/ILovePDFFile");
        const fs = await import("fs/promises");
        const path = await import("path");
        const os = await import("os");

        const task = ilovepdf.newTask("merge");
        await task.start();

        const tempDir = os.tmpdir();
        const tempFiles: string[] = [];

        for (const file of files) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const tempFilePath = path.join(tempDir, `documind_merge_${Date.now()}_${file.name}`);
            await fs.writeFile(tempFilePath, buffer);
            tempFiles.push(tempFilePath);
            const pdfFile = new ILovePDFFile(tempFilePath);
            await task.addFile(pdfFile);
        }

        await task.process();
        const data = await task.download();

        // Clean up temp files
        for (const tempFile of tempFiles) {
            await fs.unlink(tempFile).catch(() => { });
        }

        const uint8 = new Uint8Array(data);
        return new NextResponse(uint8, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": 'attachment; filename="merged.pdf"',
            },
        });

    } catch (error: any) {
        console.error("Merge error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to merge PDFs" },
            { status: 500 }
        );
    }
}
