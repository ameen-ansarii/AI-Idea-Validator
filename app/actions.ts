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

export async function validateIdea(idea: string, mode: "default" | "roast" = "default"): Promise<ValidationReport> {
    const client = getGroq();

    let systemPrompt = `You are an expert startup analyst and product validator. 
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

    if (mode === 'roast') {
        systemPrompt = `You are a savage, cynical, witty, and brutally honest startup validator (ROAST MODE ACTIVE).
Your task is to provide a strict, realistic evaluation, but wrapped in top-tier sarcasm, internet culture references, and dark humor.

Rules:
- ⚡ USE SIMPLE LANGUAGE: Write like a savvy Twitter/X user or a direct friend. No academic words. No complex jargon. Keep it punchy.
- Be Witty & Sarcastic: Use modern internet slang (e.g., "vaporware", "mid", "touch grass", "skill issue").
- Be Brutally Honest: If the idea sucks, say it sucks. Don't sugarcoat.
- One-Liners: Use short, cutting sentences.
- ACCURACY IS KEY: Even though you are roasting, the *ratings* (score, demand, etc.) must be realistic based on market data. Rate it accurately, but describe it with sass.
- NO BOOMER TALK: Do not sound like a corporate robot trying to be funny. Sound like a real internet native.

You MUST respond with ONLY a valid JSON object matching this exact schema:
{
  "summary": "string (A short, stinging paragraph roasting the concept - keep it simple and savage)",
  "targetUsers": "string",
  "problemSeverity": number (1-10),
  "severityJustification": "string (Why this problem doesn't matter)",
  "marketDemand": "string (High/Medium/Low)",
  "demandJustification": "string (Why no one wants this)",
  "monetizationPaths": ["string"],
  "alternatives": ["string"],
  "risks": "string",
  "mvpScope": "string",
  "verdict": "string (Promising/Questionable/Weak)",
  "verdictJustification": "string",
  "confidenceScore": "string (1-10)",
  "confidenceJustification": "string",
  "whyItFails": "string",
  "whoShouldNotBuild": "string",
  "roast": {
    "summary": "Full roast paragraph (simple english, savage tone)",
    "sarcasticVerdict": "Funny title (e.g., 'Tinder for Rocks')",
    "humorousAnalogy": "Analogy (e.g., 'Like Uber but for people who hate themselves')",
    "burn": "Savage one-liner (under 15 words)"
  }
}`;
    }

    try {
        console.log("🚀 Starting validation with Groq...");
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

        console.log("✅ Received response from Groq");
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
        console.error("❌ Groq Validation Error:");
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
Create a strict 4-Week Execution Plan (Roadmap) for this idea with enhanced details.

You MUST respond with ONLY a valid JSON array in this exact format:
[
  { 
    "week": "Week 1", 
    "title": "Validation & Foundations", 
    "tasks": ["Task 1", "Task 2", "Task 3"],
    "estimatedCost": "$500-1000",
    "teamSize": 2,
    "skillsRequired": ["Product Design", "Market Research"],
    "keyMilestones": ["User interviews completed", "MVP scope defined"]
  },
  { 
    "week": "Week 2", 
    "title": "MVP Build (Core)", 
    "tasks": ["Task 1", "Task 2", "Task 3"],
    "estimatedCost": "$2000-5000",
    "teamSize": 3,
    "skillsRequired": ["Full-stack Development", "UI/UX Design"],
    "keyMilestones": ["Core feature working", "Basic UI complete"]
  },
  { 
    "week": "Week 3", 
    "title": "Launch & Feedback", 
    "tasks": ["Task 1", "Task 2", "Task 3"],
    "estimatedCost": "$1000-2000",
    "teamSize": 2,
    "skillsRequired": ["Marketing", "Customer Success"],
    "keyMilestones": ["First 50 users", "Feedback loop established"]
  },
  { 
    "week": "Week 4", 
    "title": "Iterate & Scale", 
    "tasks": ["Task 1", "Task 2", "Task 3"],
    "estimatedCost": "$3000-7000",
    "teamSize": 4,
    "skillsRequired": ["DevOps", "Growth Marketing", "Engineering"],
    "keyMilestones": ["Product-market fit signal", "Scaling infrastructure"]
  }
]`;

    try {
        const completion = await client.chat.completions.create({
            model: MODEL_NAME,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Create a detailed roadmap for: "${idea}"` }
            ],
            temperature: 0.7,
            max_tokens: 2000,
        });

        const response = completion.choices[0]?.message?.content || "";
        const cleanContent = response.replace(/```json\n?|\n?```/g, "").trim();

        return JSON.parse(cleanContent);
    } catch (error: any) {
        console.error("Roadmap Error:", error);
        throw new Error("Failed to generate roadmap.");
    }
}

export async function analyzeCompetitors(idea: string) {
    const client = getGroq();

    const systemPrompt = `You are a market research analyst and competitive intelligence expert.
Analyze the competitive landscape for this startup idea.

IMPORTANT: You must attempt to identify REAL, EXISTING competitors and provide their actual Website URLs.
If you cannot find a specific URL, leave the field empty string "".

You MUST respond with ONLY a valid JSON object in this exact format:
{
  "competitors": [
    {
      "name": "Competitor Name",
      "url": "https://competitor.com (or empty if unknown)",
      "strengths": ["Strength 1", "Strength 2"],
      "weaknesses": ["Weakness 1", "Weakness 2"]
    }
  ],
  "marketPosition": "Description of where this idea fits in the market",
  "differentiationStrategy": "How to stand out from competitors",
  "competitiveAdvantages": ["Advantage 1", "Advantage 2", "Advantage 3"],
  "threats": ["Threat 1", "Threat 2"]
}`;

    try {
        const completion = await client.chat.completions.create({
            model: MODEL_NAME,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Analyze competitors for: "${idea}"` }
            ],
            temperature: 0.7,
            max_tokens: 2000,
        });

        const response = completion.choices[0]?.message?.content || "";
        const cleanContent = response.replace(/```json\n?|\n?```/g, "").trim();

        return JSON.parse(cleanContent);
    } catch (error: any) {
        console.error("Competitive Analysis Error:", error);
        throw new Error("Failed to analyze competitors.");
    }
}

export async function calculateMarketSize(idea: string) {
    const client = getGroq();

    const systemPrompt = `You are a venture capital analyst and market sizing expert.
Calculate TAM, SAM, SOM and revenue projections for this startup idea.

You MUST respond with ONLY a valid JSON object in this exact format:
{
  "tam": "$10B",
  "sam": "$1B",
  "som": "$50M",
  "tamJustification": "Explanation of total addressable market calculation",
  "samJustification": "Explanation of serviceable addressable market",
  "somJustification": "Explanation of serviceable obtainable market",
  "revenueProjection": {
    "year1": "$100K",
    "year2": "$500K",
    "year3": "$2M"
  }
}`;

    try {
        const completion = await client.chat.completions.create({
            model: MODEL_NAME,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Calculate market size for: "${idea}"` }
            ],
            temperature: 0.7,
            max_tokens: 1500,
        });

        const response = completion.choices[0]?.message?.content || "";
        const cleanContent = response.replace(/```json\n?|\n?```/g, "").trim();

        return JSON.parse(cleanContent);
    } catch (error: any) {
        console.error("Market Size Error:", error);
        throw new Error("Failed to calculate market size.");
    }
}

export async function roastIdea(idea: string): Promise<string> {
    const client = getGroq();
    const prompt = `
    You are a savage, cynical, and brutally honest startup venture capitalist who has seen it all. 
    Roast the following startup idea. Be mean, funny, and devastatingly accurate about why it might fail. 
    Don't hold back. Use slang like "vaporware", "feature not a product", "solution in search of a problem".
    Keep it under 300 characters.

    Idea: "${idea}"
  `;

    try {
        const completion = await client.chat.completions.create({
            model: MODEL_NAME,
            messages: [{ role: "user", content: prompt }],
            temperature: 1, // High temp for creativity
            max_tokens: 300,
        });
        return completion.choices[0]?.message?.content || "Your idea is so bad I can't even roast it. (AI Error)";
    } catch (error) {
        console.error("Roast error:", error);
        return "Your idea is so bad I can't even roast it. (AI Error)";
    }
}

export async function generateBrandVibe(idea: string): Promise<{ colors: string[], fontPair: string, slogan: string, designStyle: string }> {
    const client = getGroq();
    const prompt = `
    For the following startup idea, generate a "Brand Vibe" kit.
    Return strictly a JSON object with these fields:
    - colors: array of 4 hex codes (e.g. ["#ffffff", ...]) that fit the mood.
    - fontPair: a string describing a font pairing (e.g. "Space Mono + Inter").
    - slogan: a punchy, 3-5 word slogan.
    - designStyle: a short 2-3 word description of the aesthetic (e.g. "Corporate Memphis", "Cyberpunk Neon", "Minimalist Swiss").

    Idea: "${idea}"
    
    Response must be valid JSON only. Do not wrap in markdown blocks.
  `;

    try {
        const completion = await client.chat.completions.create({
            model: MODEL_NAME,
            messages: [{ role: "user", content: prompt }],
            temperature: 0.8,
            max_tokens: 500,
        });

        const response = completion.choices[0]?.message?.content || "{}";
        const cleanContent = response.replace(/```json\n?|\n?```/g, "").trim();
        return JSON.parse(cleanContent);
    } catch (error) {
        console.error("Brand vibe error:", error);
        return {
            colors: ["#000000", "#333333", "#666666", "#999999"],
            fontPair: "Arial + Times",
            slogan: "Just build it.",
            designStyle: "Generic Fallback"
        };
    }
}

