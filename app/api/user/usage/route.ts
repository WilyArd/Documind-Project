
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkUsageLimit } from "@/lib/usage-limit";

export async function GET(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
        const userId = user ? user.id : null;

        // Check General Limit (PDF Tools)
        const { count: generalUsage } = await checkUsageLimit(supabase, userId, "general", ip); // "general" or anything not "ai-chat"

        // Check AI Limit
        const { count: aiUsage } = await checkUsageLimit(supabase, userId, "ai-chat", ip);

        const isGuest = !userId;
        const generalLimit = isGuest ? 1 : 5;
        const aiLimit = isGuest ? 1 : 3;

        return NextResponse.json({
            usage: generalUsage,
            limit: generalLimit,
            ai_usage: aiUsage,
            ai_limit: aiLimit,
            remaining: Math.max(0, generalLimit - generalUsage),
            is_guest: isGuest
        });

    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch usage stats" },
            { status: 500 }
        );
    }
}
