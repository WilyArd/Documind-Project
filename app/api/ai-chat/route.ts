
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
// @ts-ignore
const pdf = require("pdf-parse");
import { createClient } from "@/lib/supabase/server";
import { checkUsageLimit, logUsage } from "@/lib/usage-limit";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        // Get IP for guest tracking
        const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
        const userId = user ? user.id : null;

        // Check limits
        const { allowed } = await checkUsageLimit(supabase, userId, "ai-chat", ip);

        if (!allowed) {
            const limitMsg = userId ? "Daily AI limit reached (3/3)." : "Guest limit reached (1/1). Sign in for more.";
            return NextResponse.json(
                { error: limitMsg },
                { status: 429 }
            );
        }

        const formData = await req.formData();
        const file = formData.get("file") as File | null;
        const message = formData.get("message") as string;
        const docId = formData.get("docId") as string;

        if (!message) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        let contextText = "";

        // If file provided, extract text
        if (file) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            try {
                const data = await pdf(buffer);
                contextText = data.text;
            } catch (e) {
                console.error("PDF Parse error", e);
                return NextResponse.json({ error: "Failed to read PDF content" }, { status: 400 });
            }
        }

        // List of models to try in order of preference
        // User has access to Gemini 2.5 series
        const modelsToTry = [
            "gemini-2.5-flash",
            "gemini-2.5-flash-lite",
            "gemini-2.0-flash-exp",
            "gemini-1.5-flash",
            "gemini-1.5-flash-8b",
            "gemini-1.5-pro",
            "gemini-pro"
        ];

        let responseText = "";
        let lastError = null;

        // Construct prompt (reuse for all attempts)
        let prompt = `User Question: ${message}\n\n`;
        if (contextText) {
            prompt += `Using the following document content, answer the user's question. If the answer is not in the document, say so.\n\nDocument Content:\n${contextText}\n`;
        } else {
            prompt += `Answer the following question as a helpful assistant.`;
        }

        for (const modelName of modelsToTry) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent(prompt);
                const response = result.response;
                responseText = response.text();

                if (responseText) {
                    break;
                }
            } catch (error: any) {
                // Silently continue to next model, warn only in dev if needed
                // console.warn(`Failed with ${modelName}:`, error.message);
                lastError = error;
            }
        }

        if (!responseText) {
            throw lastError || new Error("All models failed. Please check your API Quota.");
        }

        // Save to chat history ONLY if user is logged in
        if (user) {
            // 1. User message
            await supabase.from("chat_history").insert({
                user_id: user.id,
                doc_id: docId || "general",
                role: "user",
                content: message
            });

            // 2. Assistant message
            await supabase.from("chat_history").insert({
                user_id: user.id,
                doc_id: docId || "general",
                role: "assistant",
                content: responseText
            });
        }

        // Log usage (Guest or User)
        await logUsage(supabase, userId, "ai-chat", null, ip);

        return NextResponse.json({ response: responseText });

    } catch (error: unknown) {
        console.error("AI Chat error:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to generate response";
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
