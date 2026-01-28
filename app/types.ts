export interface ValidationReport {
    summary: string;
    targetUsers: string;
    problemSeverity: number;
    severityJustification: string;
    marketDemand: "Low" | "Medium" | "High";
    demandJustification: string;
    monetizationPaths: string[];
    alternatives: string[];
    risks: string;
    mvpScope: string;
    verdict: "Build Now" | "Build with Caution" | "Pivot Required" | "Not Worth Pursuing";
    verdictJustification: string;

    // New fields
    confidenceScore: "Low" | "Medium" | "High";
    confidenceJustification: string;
    whyItFails: string; // "Why this usually fails"
    whoShouldNotBuild: string; // "Who should NOT build this"
    roast?: {
        summary: string;
        sarcasticVerdict: string;
        humorousAnalogy: string;
        burn: string;
    };
}

export interface CompetitiveAnalysis {
    competitors: Array<{
        name: string;
        strengths: string[];
        weaknesses: string[];
        url?: string;
    }>;
    marketPosition: string;
    differentiationStrategy: string;
    competitiveAdvantages: string[];
    threats: string[];
}

export interface MarketSize {
    tam: string; // Total Addressable Market
    sam: string; // Serviceable Addressable Market
    som: string; // Serviceable Obtainable Market
    tamJustification: string;
    samJustification: string;
    somJustification: string;
    revenueProjection: {
        year1: string;
        year2: string;
        year3: string;
    };
}

export interface EnhancedRoadmap {
    week: string;
    title: string;
    tasks: string[];
    estimatedCost: string;
    teamSize: number;
    skillsRequired: string[];
    keyMilestones: string[];
}
