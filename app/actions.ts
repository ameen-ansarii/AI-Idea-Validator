"use server";

import Groq from "groq-sdk";
import { ValidationReport } from "./types";

// Groq Configuration - Super fast and generous free tier!
const MODEL_NAME = "llama-3.3-70b-versatile";

const getGroq = () => {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        throw new Error("Missing GROQ_API_KEY in .env.local");
    }
    
    return new Groq({
        apiKey: apiKey,
    });
};

export async function validateIdea(idea: string): Promise<ValidationReport> {
    const client = getGroq();

    const systemPrompt = `You are an expert startup analyst and product validator. 
Your task is to provide a strict, realistic, non-motivational evaluation of a startup idea.

Rules:
- Avoid hype, encouragement, or emotional language.
- Be blunt but constructive.
- If the idea is weak, clearly say so.
- Do not give legal or financial advice.

You MUST respond with ONLY a valid JSON object matching this exact schema:
{
  "summary": "string",
  "targetUsers": "string",
  "problemSeverity": number (1-10),
  "severityJustification": "string",
  "marketDemand": "string (High/Medium/Low)",
  "demandJustification": "string",
  "monetizationPaths": ["string"],
  "alternatives": ["string"],
  "risks": "string",
  "mvpScope": "string",
  "verdict": "string (Promising/Questionable/Weak)",
  "verdictJustification": "string",
  "confidenceScore": "string (1-10)",
  "confidenceJustification": "string",
  "whyItFails": "string",
  "whoShouldNotBuild": "string"
}`;

    try {
        console.log("🚀 Starting validation with OpenRouter...");
        console.log("📋 Model:", MODEL_NAME);
        
        const completion = await client.chat.completions.create({
            model: MODEL_NAME,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Evaluate this startup idea: "${idea}"` }
            ],
            temperature: 0.7,
            max_tokens: 2000,
        });

        console.log("✅ Received response from OpenRouter");
        const response = completion.choices[0]?.message?.content || "";
        console.log("📝 Response preview:", response.substring(0, 100));
        
        // Clean up markdown code blocks if present
        const cleanContent = response.replace(/```json\n?|\n?```/g, "").trim();
        
        if (!cleanContent || cleanContent === "{}") {
            throw new Error("Received empty response from AI");
        }

        const parsed = JSON.parse(cleanContent) as ValidationReport;
        console.log("✅ Successfully parsed JSON response");
        return parsed;
    } catch (error: any) {
        console.error("❌ OpenRouter Validation Error:");
        console.error("Error message:", error.message);
        console.error("Error details:", error.response?.data || error);
        throw new Error(`Validation failed: ${error.message || "Unknown error"}`);
    }
}

export async function pivotIdea(originalIdea: string): Promise<string> {
    const client = getGroq();
    
    const systemPrompt = `You are a genius startup pivot machine.
Your goal is to take a weak or common idea and "pivot" it into something 10x better, deeper, or more niche.

Rules:
- Keep the core valid connection (same industry or problem).
- Change the mechanism, business model, or target audience to make it viable.
- Output ONLY the new idea text. 2 sentences max.
- Be creative and specific.`;

    try {
        const completion = await client.chat.completions.create({
            model: MODEL_NAME,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Pivot this idea into a unicorn startup concept: "${originalIdea}"` }
            ],
            temperature: 0.9,
            max_tokens: 200,
        });

        return completion.choices[0]?.message?.content || "Could not generate pivot. Please try again.";
    } catch (error: any) {
        console.error("Pivot Error:", error);
        return "Could not generate pivot. Please try again.";
    }
}

export async function generateRoadmap(idea: string): Promise<any[]> {
    const client = getGroq();
    
    const systemPrompt = `You are an expert startup CTO and Project Manager.
Create a strict 4-Week Execution Plan (Roadmap) for this idea.

You MUST respond with ONLY a valid JSON array in this exact format:
[
  { "week": "Week 1", "title": "Validation & Foundations", "tasks": ["Task 1", "Task 2", "Task 3"] },
  { "week": "Week 2", "title": "MVP Build (Core)", "tasks": ["Task 1", "Task 2", "Task 3"] },
  { "week": "Week 3", "title": "Launch & Feedback", "tasks": ["Task 1", "Task 2", "Task 3"] },
  { "week": "Week 4", "title": "Iterate & Scale", "tasks": ["Task 1", "Task 2", "Task 3"] }
]`;

    try {
        const completion = await client.chat.completions.create({
            model: MODEL_NAME,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Create a detailed roadmap for: "${idea}"` }
            ],
            temperature: 0.7,
            max_tokens: 1500,
        });

        const response = completion.choices[0]?.message?.content || "";
        const cleanContent = response.replace(/```json\n?|\n?```/g, "").trim();
        
        return JSON.parse(cleanContent);
    } catch (error: any) {
        console.error("Roadmap Error:", error);
        throw new Error("Failed to generate roadmap.");
    }
}

