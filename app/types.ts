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
}
