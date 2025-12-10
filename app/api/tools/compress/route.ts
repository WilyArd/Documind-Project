import { NextRequest, NextResponse } from "next/server";
import { processFile } from "@/lib/ilovepdf";
import { createClient } from "@/lib/supabase/server";
import { checkUsageLimit, logUsage } from "@/lib/usage-limit";

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { allowed } = await checkUsageLimit(supabase, user.id, "compress");
        if (!allowed) {
            return NextResponse.json(
                { error: "Daily limit reached (5/5). Upgrade for more." },
                { status: 429 }
            );
        }

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

        // Log usage on success
        await logUsage(supabase, user.id, "compress");

        const uint8 = new Uint8Array(outputBuffer);
        return new NextResponse(uint8, {
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
