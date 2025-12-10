import { NextRequest, NextResponse } from "next/server";
import { processFile } from "@/lib/ilovepdf";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const compressionLevel = formData.get("level") as string; // e.g., 'extreme', 'recommended', 'low'

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Map our levels to iLovePDF compression levels if needed
        // Our UI sends: 'extreme', 'recommended', 'low'
        // iLovePDF API (compress): compression_level: 'extreme' | 'recommended' | 'low'
        // Matches perfectly!

        const outputBuffer = await processFile("compress", buffer, file.name, {
            compression_level: compressionLevel || "recommended",
        });

        return new NextResponse(outputBuffer, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="compressed_${file.name}"`,
            },
        });

    } catch (error: any) {
        console.error("Compress error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to compress PDF" },
            { status: 500 }
        );
    }
}
