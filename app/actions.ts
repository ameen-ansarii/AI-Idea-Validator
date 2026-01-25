"use server";

import OpenAI from "openai";
import { ValidationReport } from "./types";

export async function validateIdea(idea: string): Promise<ValidationReport> {
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
        console.error("API Key missing. Make sure OPENROUTER_API_KEY is set in .env.local");
        throw new Error("Server configuration error: Missing API Key.");
    }

    const openai = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: apiKey,
        defaultHeaders: {
            "HTTP-Referer": "https://ideavalidator.com", // Optional, for OpenRouter rankings
            "X-Title": "AI Idea Validator", // Optional, for OpenRouter rankings
        },
    });

    const systemPrompt = `
    You are an expert startup analyst and product validator. 
    Your task is to provide a strict, realistic, non-motivational evaluation of a startup idea.
    
    Rules:
    - Avoid hype, encouragement, or emotional language.
    - Be blunt but constructive.
    - If the idea is weak, clearly say so.
    - Do not give legal or financial advice.
    
    Output strictly in valid JSON format matching this interface:
    {
      "summary": "Rewrite the idea in 2-3 clear sentences.",
      "targetUsers": "Primary and secondary user groups.",
      "problemSeverity": number (1-10),
      "severityJustification": "Brief justification of the score.",
      "marketDemand": "Low" | "Medium" | "High",
      "demandJustification": "Why is demand at this level?",
      "monetizationPaths": ["Path 1", "Path 2", ...],
      "alternatives": ["Competitor 1", "Substitute 2", ...],
      "risks": "Key risks and blind spots.",
      "mvpScope": "Smallest usable version definition. Exclude future features.",
      "verdict": "Build Now" | "Build with Caution" | "Pivot Required" | "Not Worth Pursuing",
      "verdictJustification": "2-3 sentences justifying the verdict.",
      "confidenceScore": "Low" | "Medium" | "High",
      "confidenceJustification": "One line explaining why confidence is not 100%.",
      "whyItFails": "Brutally honest paragraph on why this usually fails (e.g. wrong audience, distribution, bias).",
      "whoShouldNotBuild": "One sentence description of who should NOT build this (e.g. 'Not for first-time founders')."
    }
  `;

    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
        try {
            const completion = await openai.chat.completions.create({
                model: "google/gemini-2.0-flash-exp:free",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: `Evaluate this idea: "${idea}"` }
                ],
                // Removing strict json_object requirement as it can be flaky with experimental models
                // response_format: { type: "json_object" } 
            });

            const content = completion.choices[0].message.content;
            if (!content) {
                // Log the full response for debugging
                console.error("OpenAI Response Empty:", JSON.stringify(completion, null, 2));
                throw new Error("Received empty response from AI");
            }

            // Try to parse JSON, cleaning up potential markdown code blocks if the model adds them
            const cleanContent = content.replace(/```json\n?|\n?```/g, "").trim();

            try {
                const report: ValidationReport = JSON.parse(cleanContent);
                return report;
            } catch (jsonError) {
                console.error("JSON Parse Error:", jsonError, "Content:", content);
                throw new Error("AI returned invalid JSON. Please try again.");
            }

        } catch (error: any) {
            // Check for Rate Limit (429) or Server Error (5xx)
            const isRateLimit = error?.status === 429 || error?.code === 429 || error?.message?.includes("429");

            if (isRateLimit && attempt < maxRetries - 1) {
                attempt++;
                const delay = 1000 * Math.pow(2, attempt); // 2s, 4s, 8s
                console.log(`429 Rate Limit hit. Retrying in ${delay}ms... (Attempt ${attempt + 1}/${maxRetries})`);
                await new Promise(res => setTimeout(res, delay));
                continue;
            }

            console.error("AI Validation Error:", error);
            const errorMessage = error?.message || error?.toString() || "Unknown error";

            // Provide a friendly error for 429 if retries fail
            if (isRateLimit) {
                throw new Error("Traffic is high on the free AI model. Please wait a moment and try again.");
            }

            throw new Error(`Validation failed: ${errorMessage}`);
        }
    }

    throw new Error("Failed to validate idea after multiple attempts.");
}
