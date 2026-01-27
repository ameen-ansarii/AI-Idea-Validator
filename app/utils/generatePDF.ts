import jsPDF from "jspdf";
import { ValidationReport } from "../types";

export const generatePDF = (report: ValidationReport, ideaText: string) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let y = 30;

    // --- UTILS ---
    const addLine = (yPos: number) => {
        doc.setDrawColor(230, 230, 230);
        doc.setLineWidth(0.5);
        doc.line(margin, yPos, pageWidth - margin, yPos);
    };

    const addSectionTitle = (text: string, yPos: number) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(150, 150, 150); // Muted gray for labels
        doc.text(text.toUpperCase(), margin, yPos);
        return 6;
    };

    const addBodyText = (text: string, yPos: number, isBold = false) => {
        doc.setFont("helvetica", isBold ? "bold" : "normal");
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0); // Strict black for content
        const lines = doc.splitTextToSize(text, pageWidth - margin * 2);
        doc.text(lines, margin, yPos);
        return lines.length * 6; // approximate line height
    };

    // --- HEADER (Linear Style: Clean, Minimal, Black/White) ---
    // Instead of a block, use a sharp logo/title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.text("Validation Report", margin, y);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth - margin - 50, y);

    y += 15;
    addLine(y);
    y += 15;

    // --- VERDICT SECTION ---
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text("AI VERDICT", margin, y);
    y += 8;

    const verdictColor = report.verdict === "Build Now" ? [0, 0, 0] : [50, 50, 50];
    doc.setFont("helvetica", "bold");
    doc.setFontSize(32);
    doc.setTextColor(verdictColor[0], verdictColor[1], verdictColor[2]);
    doc.text(report.verdict, margin, y + 5);
    y += 20;

    // Score Badges (Simulated)
    // 1. Viability
    doc.setDrawColor(0, 0, 0);
    doc.setFillColor(255, 255, 255);
    // doc.rect(margin, y, 50, 20, "S");
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text("VIABILITY SCORE", margin, y);
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    // Fix: Safely handle non-string confidenceScore
    const scoreText = String(report.confidenceScore).toUpperCase();
    const scoreVal = scoreText === 'HIGH' ? '92%' : scoreText === 'MEDIUM' ? '65%' : '30%';
    doc.text(scoreVal, margin, y + 8);

    // 2. Problem Urgency
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text("PROBLEM URGENCY", margin + 60, y);
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`${report.problemSeverity}/10`, margin + 60, y + 8);

    // 3. Demand Strength
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text("DEMAND STRENGTH", margin + 120, y);
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(String(report.marketDemand), margin + 120, y + 8);

    y += 25;
    addLine(y);
    y += 15;

    // --- EXECUTIVE SUMMARY ---
    y += addSectionTitle("Executive Summary", y);
    y += addBodyText(report.summary, y);
    y += 10;

    // --- BIGGEST CHALLENGE (formerly Why It Fails) ---
    y += addSectionTitle("Biggest Challenge", y);
    y += addBodyText(report.whyItFails, y);
    y += 10;

    // --- MVP SCOPE ---
    y += addSectionTitle("Recommended MVP Scope", y);
    y += addBodyText(report.mvpScope, y);
    y += 10;

    // --- TARGET AUDIENCE ---
    y += addSectionTitle("Target Audience", y);
    y += addBodyText(report.targetUsers, y);
    y += 10;

    // --- GRID: Monetization & Competitors ---
    const startY = y;

    // Left Col
    y += addSectionTitle("Monetization", y);
    report.monetizationPaths.forEach(path => {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`• ${path}`, margin, y);
        y += 6;
    });

    // Right Col (reset Y, move X)
    let rightY = startY;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text("COMPETITORS", margin + 90, rightY);
    rightY += 6;

    report.alternatives.forEach(alt => {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`• ${alt}`, margin + 90, rightY);
        rightY += 6;
    });

    // --- FOOTER ---
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("IdeaValidator // Private & Confidential", margin, pageHeight - 10);

    doc.save("IdeaValidator_Report.pdf");
};
