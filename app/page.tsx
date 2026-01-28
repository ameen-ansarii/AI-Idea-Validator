"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowRight, AlertTriangle, TrendingUp, Target, ShieldAlert, Layers, Sparkles, AlertOctagon, DollarSign, Users, Download, RefreshCw, Map, Lock, Share2, Check, BarChart3, Zap, Flame, Palette } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { validateIdea, pivotIdea, generateRoadmap, analyzeCompetitors, calculateMarketSize, roastIdea, generateBrandVibe } from "./actions";
import { ValidationReport, CompetitiveAnalysis as CompetitiveAnalysisType, MarketSize } from "./types";
import Dock from "./components/Dock/Dock";
import MaskedText from "./components/MaskedText";
import AnalysisTerminal from "./components/AnalysisTerminal";
import ExampleIdeas from "./components/ExampleIdeas";
import CompetitiveAnalysis from "./components/CompetitiveAnalysis";
import MarketSizeCalculator from "./components/MarketSizeCalculator";
import OnboardingTutorial from "./components/OnboardingTutorial";
import IdeaSlotMachine from "./components/IdeaSlotMachine";
import TrendTicker from "./components/TrendTicker";
import RoastCard from "./components/RoastCard";
import BrandVibe from "./components/BrandVibe";
import { generatePDF } from "./utils/generatePDF";

function HomeContent() {
  const [idea, setIdea] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<ValidationReport | null>(null);
  const [pivot, setPivot] = useState<string | null>(null);
  const [isPivoting, setIsPivoting] = useState(false);
  const [roadmap, setRoadmap] = useState<any[] | null>(null);
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showRoadmapModal, setShowRoadmapModal] = useState(false);
  const [competitiveAnalysis, setCompetitiveAnalysis] = useState<CompetitiveAnalysisType | null>(null);
  const [isAnalyzingCompetitors, setIsAnalyzingCompetitors] = useState(false);
  const [marketSize, setMarketSize] = useState<MarketSize | null>(null);
  const [isCalculatingMarket, setIsCalculatingMarket] = useState(false);
  const [isRoastMode, setIsRoastMode] = useState(false);
  const [brandVibeResult, setBrandVibeResult] = useState<{ colors: string[], fontPair: string, slogan: string, designStyle: string } | null>(null);
  const [isGeneratingVibe, setIsGeneratingVibe] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const historyId = searchParams.get('historyId');

  // ... existing useEffects ...

  const handleShare = async () => {
    // ... existing share logic ...
    if (!report) return;
    try {
      const shareData = { idea, report, timestamp: Date.now() };
      const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(shareData))));
      const url = `${window.location.origin}/share?data=${encoded}`;
      if (navigator.share) {
        await navigator.share({
          title: 'Idea Validator Report',
          text: `Check out this validation report for: ${idea.substring(0, 50)}...`,
          url: url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    } catch (err) {
      console.error("Share failed", err);
    }
  };

  const handleAnalyze = async () => {
    if (!idea.trim()) return;

    setIsAnalyzing(true);
    setReport(null);
    setPivot(null);
    setRoadmap(null);
    setCompetitiveAnalysis(null);
    setMarketSize(null);
    setBrandVibeResult(null);

    try {
      // Minimum 5s wait for the "Theater" effect, slightly faster
      const [result] = await Promise.all([
        validateIdea(idea, isRoastMode ? 'roast' : 'default'),
        new Promise(resolve => setTimeout(resolve, 5000))
      ]);

      setReport(result);
    } catch (error) {
      console.error("Validation failed", error);
      alert("Analysis failed. Please check your API usage or try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateBrandVibe = async () => {
    if (!idea) return;
    setIsGeneratingVibe(true);
    try {
      const vibe = await generateBrandVibe(idea);
      setBrandVibeResult(vibe);
    } catch (e) {
      console.error(e);
      alert("Failed to generate brand vibe.");
    } finally {
      setIsGeneratingVibe(false);
    }
  };

  const handlePivot = async () => {
    if (!idea) return;
    setIsPivoting(true);
    try {
      const newIdea = await pivotIdea(idea);
      setPivot(newIdea);
    } catch (e) {
      console.error(e);
    } finally {
      setIsPivoting(false);
    }
  };

  const handleGenerateRoadmap = async () => {
    if (!idea) return;
    setIsGeneratingRoadmap(true);
    try {
      const plan = await generateRoadmap(idea);
      setRoadmap(plan);
      setShowRoadmapModal(true);
      // Smooth scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      console.error(e);
      alert("Could not generate roadmap. Please try again.");
    } finally {
      setIsGeneratingRoadmap(false);
    }
  };

  const handleAnalyzeCompetitors = async () => {
    if (!idea) return;
    setIsAnalyzingCompetitors(true);
    try {
      const analysis = await analyzeCompetitors(idea);
      setCompetitiveAnalysis(analysis);
    } catch (e) {
      console.error(e);
      alert("Could not analyze competitors. Please try again.");
    } finally {
      setIsAnalyzingCompetitors(false);
    }
  };

  const handleCalculateMarketSize = async () => {
    if (!idea) return;
    setIsCalculatingMarket(true);
    try {
      const size = await calculateMarketSize(idea);
      setMarketSize(size);
    } catch (e) {
      console.error(e);
      alert("Could not calculate market size. Please try again.");
    } finally {
      setIsCalculatingMarket(false);
    }
  };

  const handleSelectExampleIdea = (exampleIdea: string) => {
    setIdea(exampleIdea);
    // Auto-scroll to input
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-6 relative pb-24 font-sans selection:bg-blue-500/30">

      {/* Roast Result Overlay */}


      <Dock />

      <div className="bg-aurora" />

      <div className="max-w-6xl w-full z-10 transition-all duration-700 ease-[0.16,1,0.3,1] flex flex-col items-center">

        {/* Header - Linear Style */}
        {!report && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 md:mb-10 space-y-4 relative w-full max-w-4xl mx-auto"
          >
            {/* Minimal Pill */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-4 hover:bg-white/10 transition-colors cursor-default"
            >
              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400">
                <Zap className="w-3 h-3 fill-indigo-400/50" />
              </div>
              <span className="text-xs font-semibold text-gray-200 tracking-wide uppercase">
                Idea Intelligence <span className="text-gray-600 mx-1">//</span> v2.4
              </span>
            </motion.div>

            <div className="relative z-10 space-y-3">
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-semibold tracking-tighter text-white leading-[1.1]">
                <MaskedText text="Validate" delay={0.1} />
                <span className="text-gray-500 ml-2 md:ml-3 block md:inline">Instantly</span>
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-base sm:text-lg text-gray-400 max-w-xl mx-auto font-normal leading-relaxed px-4"
              >
                Data-driven feedback on your startup idea.{" "}
                <span className="text-gray-200 block md:inline">No sugar coating. Just truth.</span>
              </motion.p>
            </div>
          </motion.div>
        )}

        {/* Input Section */}
        <AnimatePresence mode="wait">
          {!report && !isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, filter: "blur(10px)" }}
              transition={{ duration: 0.5, ease: "circOut" }}
              className="max-w-2xl mx-auto w-full"
            >
              <div className="macos-card p-1.5 rounded-2xl relative overflow-visible">
                <div className={clsx(
                  "bg-[#050505] rounded-[10px] p-4 md:p-6 border transition-colors duration-500 relative",
                  isRoastMode ? "border-red-500/20" : "border-white/5"
                )}>
                  {isRoastMode && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent opacity-50" />
                  )}

                  <textarea
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    placeholder={isRoastMode ? "Give me your worst idea... I dare you." : "Describe your startup idea..."}
                    className={clsx(
                      "w-full h-16 md:h-24 bg-transparent border-none text-base md:text-xl placeholder-gray-700 resize-none focus:ring-0 focus:outline-none font-medium leading-relaxed tracking-tight transition-colors",
                      isRoastMode ? "text-red-50" : "text-white"
                    )}
                  />

                  <div className="flex flex-row justify-between items-center mt-3 pt-3 md:mt-4 md:pt-4 border-t border-white/5 gap-4">
                    <div className="flex items-center gap-3 text-xs font-medium text-gray-600 w-auto justify-start">
                      {/* Simple Clean Toggle */}
                      <div
                        onClick={() => setIsRoastMode(!isRoastMode)}
                        className="flex items-center gap-3 cursor-pointer group select-none"
                      >
                        <div className={clsx(
                          "w-10 h-5 rounded-full p-0.5 transition-colors duration-300 relative border",
                          isRoastMode
                            ? "bg-red-900/20 border-red-500/50"
                            : "bg-white/5 border-white/10 group-hover:border-white/30"
                        )}>
                          <motion.div
                            layout
                            transition={{ type: "spring", stiffness: 700, damping: 30 }}
                            className={clsx(
                              "w-4 h-4 rounded-full shadow-sm",
                              isRoastMode ? "bg-red-500" : "bg-gray-400"
                            )}
                            animate={{ x: isRoastMode ? 20 : 0 }}
                          />
                        </div>
                        <span className={clsx(
                          "transition-colors duration-300",
                          isRoastMode ? "text-red-400 font-semibold" : "text-gray-500 group-hover:text-gray-300"
                        )}>
                          {isRoastMode ? "🔥 Roast Mode Active" : "Safe Mode"}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleAnalyze}
                      disabled={!idea.trim() || isAnalyzing}
                      className={clsx(
                        "liquid-button px-4 py-2.5 md:px-6 md:py-3 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300",
                        isRoastMode ? "bg-red-600 hover:bg-red-700 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] text-white border-red-500/50" : ""
                      )}
                    >
                      {isAnalyzing ? (
                        <>
                          <span>{isRoastMode ? "Roasting..." : "Analyzing..."}</span>
                          <Flame className={clsx("w-4 h-4", isRoastMode ? "animate-pulse" : "hidden")} />
                          {!isRoastMode && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                        </>
                      ) : isRoastMode ? (
                        <>
                          <span>Roast My Idea</span>
                          <Flame className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          <span>Validate Idea</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Terminal Loading State */}
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/50 backdrop-blur-md"
          >
            <AnalysisTerminal />
          </motion.div>
        )}

        {/* Results - Linear Grid */}
        {report && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 grid-rows-[auto] gap-4 pb-20 max-w-[1400px] mx-auto"
          >
            {/* Top Actions Header */}
            <motion.div
              className="md:col-span-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 mt-8 border-b border-white/10 pb-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div>
                <h2 className="text-3xl font-semibold text-white tracking-tight">Analysis Report</h2>
                <p className="text-gray-500 text-sm mt-1">Generated {new Date().toLocaleDateString()}</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleShare}
                  className="liquid-button secondary px-4 py-2 text-sm flex items-center gap-2"
                >
                  {isCopied ? <Check className="w-3 h-3 text-green-400" /> : <Share2 className="w-3 h-3" />}
                  {isCopied ? "Copied" : "Share"}
                </button>

                <button
                  onClick={() => generatePDF(report, idea)}
                  className="liquid-button secondary px-4 py-2 text-sm flex items-center gap-2"
                >
                  <Download className="w-3 h-3" />
                  PDF
                </button>

                <button
                  onClick={() => setReport(null)}
                  className="liquid-button px-4 py-2 text-sm flex items-center gap-2"
                >
                  <Sparkles className="w-3 h-3" />
                  New Analysis
                </button>
              </div>
            </motion.div>

            {/* ROAST MODE CARDS */}
            {report.roast && (
              <>
                {/* 1. Sarcastic Verdict (Full Width) */}
                <motion.div
                  className="col-span-1 sm:col-span-2 md:col-span-4 macos-card p-8 bg-gradient-to-br from-[#2a0505] via-[#1a0505] to-black border-red-500/50 relative overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.2)]"
                  initial={{ scale: 0.98, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.05 }}
                >
                  {/* Animated Fire Effect (CSS Only approximation) */}
                  <div className="absolute top-0 right-0 p-4 opacity-50 mix-blend-screen animate-pulse">
                    <Flame className="w-24 h-24 text-red-600 blur-xl" />
                  </div>
                  <div className="absolute -bottom-10 -left-10 p-4 opacity-30 mix-blend-screen">
                    <Flame className="w-48 h-48 text-orange-600 blur-2xl" />
                  </div>

                  <h3 className="text-sm font-bold uppercase tracking-widest text-red-500 mb-2 flex items-center gap-2">
                    <Flame className="w-4 h-4" /> The Reality Check
                  </h3>
                  <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 tracking-tight mb-6 mt-2 leading-[1.2]">
                    {report.roast.sarcasticVerdict}
                  </h2>
                  <div className="p-4 bg-red-950/30 border-l-4 border-red-500 rounded-r-lg backdrop-blur-sm">
                    <p className="text-lg text-red-100 italic font-medium leading-relaxed">
                      "{report.roast.burn}"
                    </p>
                  </div>
                </motion.div>

                {/* 2. Humorous Analogy */}
                <motion.div
                  className="col-span-1 md:col-span-2 macos-card p-6 bg-[#120505] border-red-500/30 shadow-[0_0_30px_rgba(220,38,38,0.1)] hover:border-red-500/50 transition-colors"
                  initial={{ scale: 0.98, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <h3 className="text-xs font-bold uppercase tracking-wider text-orange-400 mb-3 flex items-center gap-2">
                    <Sparkles className="w-3 h-3" /> The "Analogy"
                  </h3>
                  <p className="text-gray-200 text-lg font-medium leading-relaxed">
                    {report.roast.humorousAnalogy}
                  </p>
                </motion.div>

                {/* 3. Roast Summary */}
                <motion.div
                  className="col-span-1 md:col-span-2 macos-card p-6 bg-[#120505] border-red-500/30 shadow-[0_0_30px_rgba(220,38,38,0.1)] hover:border-red-500/50 transition-colors"
                  initial={{ scale: 0.98, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.15 }}
                >
                  <h3 className="text-xs font-bold uppercase tracking-wider text-orange-400 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-3 h-3" /> Why It Hurts
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {report.roast.summary}
                  </p>
                </motion.div>
              </>
            )}

            {/* 1. Verdict (Large) */}
            <motion.div
              className={clsx(
                "md:col-span-2 md:row-span-2 macos-card p-8 flex flex-col justify-between",
                // Conditional styling based on report verdict OR mode
                report.roast ? "border-red-500/20 bg-[#0f0505]" : ""
              )}
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Verdict</h3>
                <h2 className={clsx(
                  "text-5xl font-semibold tracking-tighter",
                  report.verdict === "Build Now" ? "text-white" :
                    report.verdict === "Build with Caution" ? "text-gray-200" : "text-gray-400"
                )}>
                  {report.verdict}
                </h2>
                <div className={clsx("h-1 w-20 mt-4 rounded-full",
                  report.verdict === "Build Now" ? "bg-green-500" :
                    report.verdict === "Build with Caution" ? "bg-yellow-500" : "bg-red-500"
                )} />
              </div>
              <p className="text-lg text-gray-400 leading-relaxed mt-6">
                {report.verdictJustification}
              </p>
            </motion.div>

            {/* 2. Viability Score (was Confidence) */}
            <motion.div
              className={clsx(
                "md:col-span-1 md:row-span-1 macos-card p-6 flex flex-col justify-between",
                report.roast ? "border-red-500/20 bg-[#0a0202]" : ""
              )}
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Viability Score</h3>
                  <p className="text-[10px] text-gray-600 font-medium">Likelihood of success</p>
                </div>
                <span className="text-2xl font-bold text-white">
                  {report.confidenceScore === 'High' ? '92' : report.confidenceScore === 'Medium' ? '65' : '30'}%
                </span>
              </div>
              <div className="w-full bg-white/5 h-1 md:h-2 rounded-full mt-4 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: report.confidenceScore === 'High' ? '92%' : report.confidenceScore === 'Medium' ? '65%' : '30%' }}
                  className={clsx("h-full", report.roast ? "bg-red-500" : "bg-white")}
                />
              </div>
            </motion.div>

            {/* 3. Problem Urgency (was Pain Level) */}
            <motion.div
              className={clsx(
                "md:col-span-1 md:row-span-1 macos-card p-6 flex flex-col justify-between",
                report.roast ? "border-red-500/20 bg-[#0a0202]" : ""
              )}
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Problem Urgency</h3>
                  <p className="text-[10px] text-gray-600 font-medium">Do users *need* this?</p>
                </div>
                <span className="text-2xl font-bold text-white">{report.problemSeverity}/10</span>
              </div>
              <div className="flex gap-1 mt-4">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className={clsx("h-2 flex-1 rounded-sm",
                    i < report.problemSeverity ? (report.roast ? "bg-red-500" : "bg-white") : "bg-white/10"
                  )} />
                ))}
              </div>
            </motion.div>

            {/* 4. Main Challenge (was Failure Risk) */}
            <motion.div
              className={clsx(
                "md:col-span-2 macos-card p-8",
                report.roast ? "bg-[#1f0505] border-red-500/30" : "bg-[#1a1212] border-white/10"
              )}
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="flex items-center gap-2 text-red-400 font-semibold uppercase tracking-wider text-xs mb-4">
                <ShieldAlert className="w-3 h-3" /> Biggest Challenge
              </h3>
              <p className="text-lg text-gray-300">
                {report.whyItFails}
              </p>
            </motion.div>

            {/* 5. Summary */}
            <motion.div
              className={clsx(
                "md:col-span-2 md:row-span-2 macos-card p-8",
                report.roast ? "border-red-500/20 bg-[#0f0a0a]" : ""
              )}
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-6">Executive Summary</h3>
              <p className="text-gray-300 leading-7 mb-8">
                {report.summary}
              </p>

              <div className="border-t border-white/5 pt-6">
                <h4 className="text-xs text-gray-500 uppercase font-semibold mb-2">Target Audience</h4>
                <p className="text-white">{report.targetUsers}</p>
              </div>
            </motion.div>

            {/* 6. Demand Strength (was Market Demand) */}
            <motion.div
              className={clsx(
                "macos-card p-6 flex flex-col justify-between",
                report.roast ? "border-red-500/20 bg-[#0a0202]" : ""
              )}
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Demand Strength</h3>
                <p className="text-[10px] text-gray-600 font-medium">Are people searching?</p>
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-bold text-white mb-1">{report.marketDemand}</h3>
                <div className="flex gap-1 mt-2">
                  <div className={clsx("h-1 w-8 rounded-full", report.roast ? "bg-red-500" : "bg-white")} />
                  <div className={clsx("h-1 w-8 rounded-full",
                    ["Medium", "High"].includes(report.marketDemand) ? (report.roast ? "bg-red-500" : "bg-white") : "bg-white/10"
                  )} />
                  <div className={clsx("h-1 w-8 rounded-full",
                    report.marketDemand === "High" ? (report.roast ? "bg-red-500" : "bg-white") : "bg-white/10"
                  )} />
                </div>
              </div>
            </motion.div>

            {/* 7. Roadmap Button */}
            <motion.div
              className={clsx(
                "macos-card p-6 flex flex-col justify-center items-center text-center cursor-pointer transition-colors group",
                report.roast ? "border-red-500/20 bg-[#0f0505] hover:bg-red-950/30" : "hover:bg-white/5"
              )}
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.7 }}
              onClick={roadmap ? () => setShowRoadmapModal(true) : handleGenerateRoadmap}
            >
              <Map className={clsx(
                "w-8 h-8 transition-colors mb-2",
                report.roast ? "text-red-400 group-hover:text-red-300" : "text-gray-400 group-hover:text-white"
              )} />
              <span className="font-medium text-white">{roadmap ? "View Roadmap" : "Create Roadmap"}</span>
              {isGeneratingRoadmap && <div className={clsx("mt-2 w-4 h-4 border-2 border-t-transparent rounded-full animate-spin", report.roast ? "border-red-500" : "border-white")} />}
            </motion.div>

            {/* 8. Risks */}
            <motion.div
              className={clsx(
                "md:col-span-2 macos-card p-8",
                report.roast ? "border-red-500/20 bg-[#0f0a0a]" : ""
              )}
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Potential Risks</h3>
              <p className="text-gray-300">
                {report.risks}
              </p>
            </motion.div>

            {/* 9. Monetization */}
            <motion.div
              className={clsx(
                "md:col-span-2 macos-card p-8",
                report.roast ? "border-red-500/20 bg-[#0f0a0a]" : ""
              )}
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <h3 className={clsx("text-xs font-semibold uppercase tracking-wider mb-4", report.roast ? "text-red-400/80" : "text-green-500/80")}>Monetization</h3>
              <div className="flex flex-wrap gap-2">
                {report.monetizationPaths?.map((path, i) => (
                  <span key={i} className={clsx("px-3 py-1.5 border rounded-md text-sm text-gray-300", report.roast ? "border-red-500/20 bg-red-950/10" : "border-white/10")}>
                    {path}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* 10. Competitors */}
            <motion.div
              className={clsx(
                "md:col-span-2 macos-card p-8",
                report.roast ? "border-red-500/20 bg-[#0f0a0a]" : ""
              )}
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.0 }}
            >
              <h3 className={clsx("text-xs font-semibold uppercase tracking-wider mb-4", report.roast ? "text-red-400/80" : "text-blue-500/80")}>Competitors</h3>
              <div className="flex flex-wrap gap-3">
                {report.alternatives?.map((alt, i) => (
                  <div key={i} className={clsx(
                    "pl-1.5 pr-3 py-1.5 border rounded-full text-sm text-gray-300 flex items-center gap-2 transition-colors cursor-default",
                    report.roast ? "border-red-500/10 bg-red-950/10 hover:bg-red-900/20" : "border-white/10 bg-white/5 hover:bg-white/10"
                  )}>
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${alt.toLowerCase().replace(/\s+/g, '')}.com&sz=64`}
                      alt={alt}
                      className="w-5 h-5 rounded-full opacity-90"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <span>{alt}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* New Analysis Sections - refined to Linear style */}
            <motion.div
              className="md:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-4 mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
            >
              <button
                onClick={handleAnalyzeCompetitors}
                disabled={isAnalyzingCompetitors}
                className="macos-card p-6 flex items-center justify-between hover:bg-white/5 transition-all disabled:opacity-50 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-white/20 transition-colors">
                    <Target className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-white">Competitive Analysis</h4>
                    <p className="text-sm text-gray-500">Analyze market positioning</p>
                  </div>
                </div>
                {isAnalyzingCompetitors ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                )}
              </button>

              <button
                onClick={handleCalculateMarketSize}
                disabled={isCalculatingMarket}
                className="macos-card p-6 flex items-center justify-between hover:bg-white/5 transition-all disabled:opacity-50 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-white/20 transition-colors">
                    <BarChart3 className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-white">Market Size Calculator</h4>
                    <p className="text-sm text-gray-500">TAM, SAM, SOM analysis</p>
                  </div>
                </div>
                {isCalculatingMarket ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                )}
              </button>

              <button
                onClick={handleGenerateBrandVibe}
                disabled={isGeneratingVibe}
                className="macos-card p-6 flex items-center justify-between hover:bg-white/5 transition-all disabled:opacity-50 group md:col-span-2"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:border-indigo-500/40 transition-colors">
                    <Palette className="w-5 h-5 text-indigo-400 group-hover:text-indigo-200 transition-colors" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-white">Brand Vibe Check</h4>
                    <p className="text-sm text-gray-500">Generate aesthetic & slogan</p>
                  </div>
                </div>
                {isGeneratingVibe ? (
                  <div className="w-5 h-5 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin" />
                ) : (
                  <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                )}
              </button>
            </motion.div>

            {/* Brand Vibe Result */}
            {brandVibeResult && (
              <BrandVibe data={brandVibeResult} />
            )}

            {/* AI Pivot Generator - Linear Style */}
            <motion.div
              className="md:col-span-4 macos-card p-8 mt-6 relative overflow-hidden group"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">
                      AI Pivot Engine
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold text-white mb-2">
                    {pivot ? "Your Pivot Strategy" : "Need a better angle?"}
                  </h2>

                  {!pivot && (
                    <p className="text-gray-400 text-sm max-w-lg">
                      Generate a stronger, more viable direction for your startup idea instantly.
                    </p>
                  )}
                </div>

                <div className="flex-shrink-0">
                  <button
                    onClick={handlePivot}
                    disabled={isPivoting}
                    className="px-6 py-3 rounded-lg bg-white text-black font-semibold text-sm hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center gap-2"
                  >
                    <RefreshCw className={clsx("w-4 h-4", isPivoting && "animate-spin")} />
                    {isPivoting ? "Generating..." : pivot ? "Regenerate" : "Generate Pivot"}
                  </button>
                </div>
              </div>

              {pivot && (
                <div className="mt-6 p-6 rounded-xl border border-white/10 bg-white/5">
                  <p className="text-lg text-gray-200 leading-relaxed font-medium">
                    "{pivot}"
                  </p>
                </div>
              )}
            </motion.div>




          </motion.div>
        )}

        {/* Competitive Analysis Section */}
        {competitiveAnalysis && (
          <CompetitiveAnalysis data={competitiveAnalysis} />
        )}

        {/* Market Size Section */}
        {marketSize && (
          <MarketSizeCalculator data={marketSize} />
        )}

        {/* Example Ideas Section - Show when no report */}
        {!report && !isAnalyzing && (
          <>
            <ExampleIdeas onSelectIdea={handleSelectExampleIdea} />
            <IdeaSlotMachine onValidate={(generatedIdea) => {
              setIdea(generatedIdea);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} />
          </>
        )}
      </div>

      {/* Fixed Bottom Ticker */}
      <div className="fixed bottom-0 left-0 w-full z-40 pointer-events-none">
        <div className="pointer-events-auto">
          <TrendTicker />
        </div>
      </div>

      {/* Fullscreen Roadmap Modal */}
      <AnimatePresence>
        {showRoadmapModal && roadmap && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-6"
            onClick={() => setShowRoadmapModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-black/40 border border-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header - Linear Style */}
              <div className="sticky top-0 bg-[#0a0a0a]/95 backdrop-blur-md p-4 md:p-8 border-b border-white/10 z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                      <Map className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">Execution Roadmap</h2>
                      <p className="text-xs md:text-sm text-gray-500">From concept to MVP in 4 weeks</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowRoadmapModal(false)}
                    className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors text-gray-400 hover:text-white"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 overflow-y-auto max-h-[calc(90vh-100px)]">
                <div className="space-y-0">
                  {roadmap.map((week, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="relative pl-8 md:pl-0"
                    >
                      {/* Connector Line (Desktop) */}
                      {i < roadmap.length - 1 && (
                        <div className="hidden md:block absolute left-1/2 top-full bottom-0 w-px bg-white/10 h-10 -ml-px z-0 transformed -translate-y-4" />
                      )}

                      {/* Week Card */}
                      <div className="mb-10 relative">
                        <div className="flex flex-col md:items-center gap-6 mb-6">
                          <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-sm font-medium text-gray-300 font-mono">
                            {week.week}
                          </span>
                          <h3 className="text-3xl md:text-4xl font-bold text-white text-center tracking-tight">
                            {week.title}
                          </h3>
                        </div>

                        <div className="bg-[#0f0f0f] rounded-xl border border-white/10 p-6 md:p-8 relative z-10">
                          {/* Tasks */}
                          <div className="space-y-3 mb-8">
                            {week.tasks.map((task: string, j: number) => (
                              <div key={j} className="flex items-start gap-3 group">
                                <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:border-white transition-colors">
                                  <div className="w-2.5 h-2.5 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <p className="text-gray-400 group-hover:text-gray-200 transition-colors leading-relaxed">
                                  {task}
                                </p>
                              </div>
                            ))}
                          </div>

                          {/* Metrics Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-white/5">
                            <div className="p-4 rounded-lg bg-white/5 border border-white/5">
                              <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 mb-1">Estimated Cost</p>
                              <p className="text-lg font-medium text-white font-mono">{week.estimatedCost}</p>
                            </div>
                            <div className="p-4 rounded-lg bg-white/5 border border-white/5">
                              <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 mb-1">Team Size</p>
                              <p className="text-lg font-medium text-white">{week.teamSize} members</p>
                            </div>
                            <div className="p-4 rounded-lg bg-white/5 border border-white/5">
                              <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 mb-2">Skills Needed</p>
                              <div className="flex flex-wrap gap-1.5">
                                {week.skillsRequired?.map((skill: string, k: number) => (
                                  <span key={k} className="text-xs px-2 py-0.5 bg-white/10 text-gray-300 rounded border border-white/5">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Milestones */}
                          {week.keyMilestones && week.keyMilestones.length > 0 && (
                            <div className="mt-4 p-4 rounded-lg border border-dashed border-white/10 bg-black/20">
                              <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 mb-3 flex items-center gap-2">
                                <Check className="w-3 h-3" /> Key Deliverables
                              </p>
                              <ul className="space-y-2">
                                {week.keyMilestones.map((milestone: string, m: number) => (
                                  <li key={m} className="text-sm text-gray-400 flex items-center gap-2">
                                    <span className="w-1 h-1 rounded-full bg-green-500/50" />
                                    {milestone}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Onboarding Tutorial */}
      <OnboardingTutorial />
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}
