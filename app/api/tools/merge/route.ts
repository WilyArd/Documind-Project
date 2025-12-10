import { NextRequest, NextResponse } from "next/server";
import { processFile } from "@/lib/ilovepdf";

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
        const ILovePDFFile = (await import("@/lib/ilovepdf")).default.ILovePDFFile; // Wait, ILovePDFFile is not exported by default export instance

        // Re-importing classes directly
        const { default: ILovePDFApi } = await import("@ilovepdf/ilovepdf-nodejs");
        const { default: ILovePDFFileClass } = await import("@/lib/ilovepdf").then(() => import("@ilovepdf/ilovepdf-nodejs/ILovePDFFile"));

        // Actually, let's just import the instance from lib and use it

        const task = ilovepdf.newTask("merge");
        await task.start();

        for (const file of files) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            // @ts-ignore
            const pdfFile = new ILovePDFFileClass(buffer);
            await task.addFile(pdfFile);
        }

        await task.process();
        const data = await task.download();
        const buffer = Buffer.from(data);

        return new NextResponse(buffer, {
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
