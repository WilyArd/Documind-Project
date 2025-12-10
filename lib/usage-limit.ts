
import { SupabaseClient } from "@supabase/supabase-js";

export async function checkUsageLimit(supabase: SupabaseClient, userId: string, actionType: string = "all") {
    // Determine the start of the current day (UTC)
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);

    const { count, error } = await supabase
        .from("logs")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .gte("created_at", startOfDay.toISOString());

    if (error) {
        console.error("Error checking usage limit:", error);
        // Fail open or closed? Let's fail open to avoid blocking users on db errors, 
        // but log it.
        return { allowed: true, count: 0 };
    }

    const LIMIT = 5;

    if (count !== null && count >= LIMIT) {
        return { allowed: false, count };
    }

    return { allowed: true, count: count ?? 0 };
}

export async function logUsage(supabase: SupabaseClient, userId: string, action: string, details?: any) {
    await supabase.from("logs").insert({
        user_id: userId,
        action,
        details,
    });
}
