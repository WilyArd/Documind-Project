
import { SupabaseClient } from "@supabase/supabase-js";

export async function checkUsageLimit(supabase: SupabaseClient, userId: string | null, actionType: string = "all", identifier?: string) {
    // Determine the start of the current day (UTC)
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);

    let query = supabase
        .from("logs")
        .select("*", { count: "exact", head: true })
        .gte("created_at", startOfDay.toISOString());

    // Filter by user or identifier (IP/Session)
    if (userId) {
        query = query.eq("user_id", userId);
    } else if (identifier) {
        query = query.is("user_id", null).eq("ip_address", identifier);
    } else {
        // Should not happen, but block if no identity
        return { allowed: false, count: 0 };
    }

    // Separate AI limit count if action is AI
    if (actionType === "ai-chat") {
        query = query.eq("action", "ai-chat");
    } else {
        // For general PDF tools (exclude AI chat from this count?)
        // User asked: "Limit AI khusus saja". So PDF limits don't count AI usage?
        // Let's separate them completely.
        query = query.neq("action", "ai-chat");
    }

    const { count, error } = await query;

    if (error) {
        console.error("Error checking usage limit:", error);
        return { allowed: true, count: 0 };
    }

    // --- LIMIT CONFIGURATION ---
    let LIMIT = 0;

    if (!userId) {
        // GUEST LIMIT: 1 Credit Total (Any tool)
        // Since guests share 1 limit, we shouldn't filter by action type above if we want a TOTAL limit.
        // But for code simplicity, let's say Guest gets 1 PDF AND 1 AI? Or just 1 TOTAL.
        // User: "limitnya sangat terbatas" -> 1 Global Action for Guest.
        // Re-query for GLOBAL count if guest
        if (actionType !== "all") {
            const { count: globalCount } = await supabase
                .from("logs")
                .select("*", { count: "exact", head: true })
                .is("user_id", null)
                .eq("ip_address", identifier)
                .gte("created_at", startOfDay.toISOString());

            if (globalCount !== null && globalCount >= 1) {
                return { allowed: false, count: globalCount };
            }
            return { allowed: true, count: globalCount || 0 };
        }
    } else {
        // LOGGED IN USER LIMITS
        if (actionType === "ai-chat") {
            LIMIT = 3; // AI Specific Limit
        } else {
            LIMIT = 5; // General PDF Tools Limit
        }
    }

    if (count !== null && count >= LIMIT) {
        return { allowed: false, count };
    }

    return { allowed: true, count: count ?? 0 };
}

export async function logUsage(supabase: SupabaseClient, userId: string | null, action: string, details?: any, ipAddress?: string) {
    await supabase.from("logs").insert({
        user_id: userId, // Can be null for guests
        action,
        details,
        ip_address: ipAddress
    });
}
