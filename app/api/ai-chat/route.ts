import { NextResponse } from "next/server";

const simulatedResponses = [
    "Based on the document, I can see that the main topic covers several key points. Let me summarize them for you...",
    "That's a great question! According to the PDF content, the answer involves understanding the relationship between the concepts mentioned in Section 2.",
    "I found relevant information on page 3 of your document. The text states that this is an important consideration for the overall analysis.",
    "Looking at the data in your PDF, I can identify three main trends that are worth noting. Would you like me to elaborate on any of them?",
    "The document mentions this topic in multiple sections. The most comprehensive explanation can be found in the conclusion where it summarizes the key findings.",
];

export async function POST(request: Request) {
    try {
        const { message, docId } = await request.json();

        if (!message) {
            return NextResponse.json(
                { error: "No message provided" },
                { status: 400 }
            );
        }

        // Simulate AI processing delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Mock AI response
        const response = simulatedResponses[Math.floor(Math.random() * simulatedResponses.length)];

        return NextResponse.json({
            success: true,
            message: response,
            docId,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to process message" },
            { status: 500 }
        );
    }
}
