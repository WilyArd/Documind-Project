
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
// @ts-ignore
import pdf from "pdf-parse";
import { createClient } from "@/lib/supabase/server";
import { checkUsageLimit, logUsage } from "@/lib/usage-limit";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Check limits
        const { allowed } = await checkUsageLimit(supabase, user.id, "ai-chat");
        if (!allowed) {
            return NextResponse.json(
                { error: "Daily limit reached (5/5). Upgrade for more." },
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

                // Limit context size roughly to avoid token limits (Flash has large context but let's be safe)
                // 1 char ~= 1 token (rough estimate for safety), Flash limit is 1M tokens.
                // We are fine for most PDFs.
            } catch (e) {
                console.error("PDF Parse error", e);
                return NextResponse.json({ error: "Failed to read PDF content" }, { status: 400 });
            }
        }

        // Initialize model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Construct prompt
        let prompt = `User Question: ${message}\n\n`;
        if (contextText) {
            prompt += `Using the following document content, answer the user's question. If the answer is not in the document, say so.\n\nDocument Content:\n${contextText}\n`;
        } else {
            // If no file, maybe chat history context? For now simple chat.
            prompt += `Answer the following question as a helpful assistant.`;
        }

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        // Save to chat history
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
            content: text
        });

        // Log usage
        await logUsage(supabase, user.id, "ai-chat");

        return NextResponse.json({ response: text });

    } catch (error: unknown) {
        console.error("AI Chat error:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to generate response";
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
