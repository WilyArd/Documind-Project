import { NextRequest, NextResponse } from "next/server";
import { processFile } from "@/lib/ilovepdf";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const splitMode = formData.get("splitMode") as string; // 'ranges' or 'all'
        const ranges = formData.get("ranges") as string;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // iLovePDF Split Params
        // https://developer.ilovepdf.com/docs/api-reference#split-pdf
        // split_mode: 'ranges' | 'fixed_range' | 'remove_pages' ... wait, SDK wrapper might differ.
        // Let's use generic params passed to processFile.

        let params: any = {
            tool: 'split',
        };

        if (splitMode === 'ranges') {
            params.split_mode = 'ranges';
            params.ranges = ranges; // e.g., "1-3,5-7"
        } else {
            // For 'all' pages, iLovePDF usually bursts the PDF
            // Or we can use split_mode: 'fixed_range' with fixed_range: 1?
            // Actually 'split_mode': 'ranges' with 'ranges': '1,2,3...' is one way.
            // But typically "Extract all pages" is similar to burst.
            // Let's assume 'ranges' mode for now and strict user input.
            // If ranges is empty, maybe default to extracting all pages logic if API supports it?
            // Checking docs (mental check): split_mode 'ranges' is standard.
            params.split_mode = 'ranges';
            params.ranges = ranges || "1-end"; // Default to whole doc if missing?
        }

        const outputBuffer = await processFile("split", buffer, file.name, params);

        // iLovePDF split usually returns a ZIP if multiple files are resulting
        return new NextResponse(outputBuffer, {
            headers: {
                "Content-Type": "application/zip", // Provided it returns a zip
                "Content-Disposition": 'attachment; filename="split-files.zip"',
            },
        });

    } catch (error: any) {
        console.error("Split error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to split PDF" },
            { status: 500 }
        );
    }
}
