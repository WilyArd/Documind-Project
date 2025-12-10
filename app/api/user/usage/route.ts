
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkUsageLimit } from "@/lib/usage-limit";

export async function GET(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { count } = await checkUsageLimit(supabase, user.id);

        return NextResponse.json({
            usage: count,
            limit: 5,
            remaining: Math.max(0, 5 - count)
        });

    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch usage stats" },
            { status: 500 }
        );
    }
}
