"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowRight, AlertTriangle, TrendingUp, Target, ShieldAlert, Layers, Sparkles, AlertOctagon, DollarSign, Users, Download, RefreshCw, Map, Lock, Share2, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { validateIdea, pivotIdea, generateRoadmap } from "./actions";
import { ValidationReport } from "./types";
import Dock from "./components/Dock/Dock";
import MaskedText from "./components/MaskedText";
import AnalysisTerminal from "./components/AnalysisTerminal";
import { generatePDF } from "./utils/generatePDF";

export default function Home() {
  const [idea, setIdea] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<ValidationReport | null>(null);
  const [pivot, setPivot] = useState<string | null>(null);
  const [isPivoting, setIsPivoting] = useState(false);
  const [roadmap, setRoadmap] = useState<any[] | null>(null);
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showRoadmapModal, setShowRoadmapModal] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const historyId = searchParams.get('historyId');

  // Load History Logic
  useEffect(() => {
    if (historyId) {
      try {
        const history = JSON.parse(localStorage.getItem('idea_history') || '[]');
        const entry = history.find((h: any) => h.id === historyId);
        if (entry) {
          setIdea(entry.idea);
          // Directly set report to skip analysis animation, or maybe separate state?
          // For now, simple restore.
          setReport(entry.report);
          // Clear URL param
          router.replace('/', { scroll: false });
        }
      } catch (e) {
        console.error("Failed to load history item", e);
      }
    }
  }, [historyId, router]);

  // Save to History Vault
  useEffect(() => {
    if (report && idea) {
      try {
        const history = JSON.parse(localStorage.getItem('idea_history') || '[]');
        // Check if report already exists to avoid duplicates on re-renders
        const exists = history.some((h: any) => h.report.summary === report.summary);
        if (!exists) {
          const newEntry = {
            idea,
            report,
            date: new Date().toISOString(),
            id: Date.now().toString()
          };
          const updated = [newEntry, ...history].slice(0, 50); // Keep last 50
          localStorage.setItem('idea_history', JSON.stringify(updated));
        }
      } catch (e) {
        console.error("Failed to save history", e);
      }
    }
  }, [report]);

  const handleShare = async () => {
    if (!report) return;
    const text = `🚀 Idea Validator Report\n\n💡 Idea: ${idea}\n🏆 Verdict: ${report.verdict}\n⭐ Score: ${report.confidenceScore}/10\n\nCheck out IdeaValidator!`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Idea Validator Report',
          text: text,
        });
      } else {
        await navigator.clipboard.writeText(text);
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
    setRoadmap(null); // Reset roadmap on new analysis

    try {
      // Minimum 7s wait for the "Theater" effect
      const [result] = await Promise.all([
        validateIdea(idea),
        new Promise(resolve => setTimeout(resolve, 7000))
      ]);

      setReport(result);
    } catch (error) {
      console.error("Validation failed", error);
      alert("Analysis failed. Please check your API usage or try again."); // Simple feedback
    } finally {
      setIsAnalyzing(false);
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

  return (
    <main className="min-h-screen flex flex-col items-center p-6 relative pt-32 font-sans selection:bg-blue-500/30">

      <Dock />

      <div className="bg-aurora" />

      <div className="max-w-6xl w-full z-10 transition-all duration-700 ease-[0.16,1,0.3,1]">

        {/* Header - Apple Style */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-center mb-20 space-y-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 border border-white/60 backdrop-blur-md shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-semibold tracking-wide uppercase text-black/60">Intelligence V2.0</span>
          </motion.div>

          <h1 className="text-7xl md:text-9xl font-bold tracking-tighter text-black/90">
            <MaskedText text="Validate." delay={0.1} />
            <MaskedText text="Instantly." delay={0.3} className="text-black/30" />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-2xl md:text-3xl text-black/60 max-w-2xl mx-auto font-light leading-snug"
          >
            Brutal, data-driven feedback for your startup idea.
            <span className="text-black font-medium"> No fluff.</span>
          </motion.p>
        </motion.div>

        {/* Input Section */}
        <AnimatePresence mode="wait">
          {!report && !isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(20px)" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-4xl mx-auto"
            >
              <div className="macos-card p-1 relative overflow-hidden group">
                <div className="relative bg-white/40 rounded-[24px] p-8 md:p-12">
                  <textarea
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    placeholder="Describe your idea based on first principles..."
                    className="w-full h-40 bg-transparent border-none text-2xl md:text-4xl text-black/90 placeholder-black/20 resize-none focus:ring-0 focus:outline-none font-medium leading-tight selection:bg-blue-200"
                  />

                  <div className="flex justify-between items-center mt-12 pt-8 border-t border-black/5">
                    <div className="flex items-center gap-6 text-sm font-medium text-black/40">
                      <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Live Analysis</span>
                      <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Market Data</span>
                    </div>

                    <button
                      onClick={handleAnalyze}
                      disabled={!idea.trim()}
                      className="liquid-button px-10 py-4 text-lg flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                      Validate Idea
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/60 backdrop-blur-xl"
          >
            <AnalysisTerminal />
          </motion.div>
        )}

        {/* Results - Bento Grid */}
        {report && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-4 grid-rows-[auto] gap-6 pb-32"
          >
            {/* Top Actions Header */}
            <motion.div
              className="md:col-span-4 flex flex-col md:flex-row justify-between items-center gap-4 mb-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex flex-col items-start w-full md:w-auto">
                <h2 className="text-3xl font-bold text-black/80 tracking-tight">Analysis Report</h2>
                <p className="text-black/40 text-sm">Generated by AI Validator</p>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                <button
                  onClick={handleShare}
                  className="px-6 py-2.5 rounded-full bg-white text-black hover:bg-gray-50 transition-all font-medium flex items-center gap-2 shadow-sm hover:shadow-md border border-black/5 active:scale-95 text-sm"
                >
                  {isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4 text-blue-500" />}
                  {isCopied ? "Copied" : "Share"}
                </button>

                <button
                  onClick={() => generatePDF(report, idea)}
                  className="px-6 py-2.5 rounded-full bg-black text-white hover:bg-black/80 transition-all font-medium flex items-center gap-2 shadow-lg hover:shadow-xl active:scale-95 text-sm"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>

                <button
                  onClick={() => setReport(null)}
                  className="px-6 py-2.5 rounded-full bg-white text-black hover:bg-gray-50 transition-all font-medium flex items-center gap-2 shadow-sm hover:shadow-md border border-black/5 active:scale-95 text-sm"
                >
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  New Idea
                </button>
              </div>
            </motion.div>

            {/* 1. Verdict (Large Square) */}
            <motion.div
              className={clsx(
                "md:col-span-2 md:row-span-2 macos-card p-10 flex flex-col justify-between relative overflow-hidden group",
                report.verdict === "Build Now" ? "shadow-[0_20px_40px_-10px_rgba(16,185,129,0.1)]" :
                  report.verdict === "Build with Caution" ? "shadow-[0_20px_40px_-10px_rgba(245,158,11,0.1)]" :
                    "shadow-[0_20px_40px_-10px_rgba(239,68,68,0.1)]"
              )}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className={clsx(
                "absolute top-0 right-0 w-64 h-64 blur-[80px] opacity-20 rounded-full -mr-20 -mt-20",
                report.verdict === "Build Now" ? "bg-green-500" :
                  report.verdict === "Build with Caution" ? "bg-yellow-500" : "bg-red-500"
              )} />

              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-black/40 mb-2">Final Verdict</h3>
                <h2 className={clsx(
                  "text-5xl md:text-6xl font-bold tracking-tighter leading-none",
                  report.verdict === "Build Now" ? "text-green-600" :
                    report.verdict === "Build with Caution" ? "text-yellow-600" : "text-red-600"
                )}>
                  {report.verdict}
                </h2>
              </div>
              <p className="text-xl text-black/70 font-medium leading-relaxed mt-8 relative z-10">
                "{report.verdictJustification}"
              </p>
            </motion.div>

            {/* 2. Pivot Generator - High Contrast Design */}
            <motion.div
              className="md:col-span-2 md:row-span-2 macos-card p-1 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden group shadow-2xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="absolute inset-0 bg-black/40" />
              <div className="bg-gradient-to-br from-black/50 to-black/30 backdrop-blur-xl h-full w-full p-10 flex flex-col justify-between relative z-10">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-white" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">
                      AI PIVOT ENGINE
                    </h3>
                  </div>
                  
                  <h2 className="text-5xl font-bold text-white leading-tight drop-shadow-lg">
                    {pivot ? "✨ Your Unicorn Pivot" : "💡 Not Satisfied?"}
                  </h2>
                  
                  {pivot ? (
                    <p className="text-2xl text-white font-semibold leading-relaxed animate-in fade-in slide-in-from-bottom-2 bg-black/30 p-6 rounded-2xl border border-white/30 shadow-xl">
                      "{pivot}"
                    </p>
                  ) : (
                    <p className="text-white text-xl leading-relaxed font-medium">
                      Transform your idea into something 10x better. Get deeper insights, new angles, and viable alternatives instantly.
                    </p>
                  )}
                </div>

                <button
                  onClick={handlePivot}
                  disabled={isPivoting}
                  className="mt-6 w-full py-5 rounded-2xl bg-white text-black hover:bg-gray-100 text-xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50 shadow-2xl"
                >
                  <RefreshCw className={clsx("w-6 h-6", isPivoting && "animate-spin")} />
                  {isPivoting ? "Generating Pivot..." : pivot ? "Generate Another" : "Generate Pivot"}
                </button>
              </div>
            </motion.div>

            {/* 2. Confidence (Small Square) */}
            <motion.div
              className="md:col-span-1 md:row-span-1 macos-card p-6 flex flex-col items-center justify-center relative"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="56" className="stroke-black/5" strokeWidth="8" fill="none" />
                  <motion.circle
                    cx="64" cy="64" r="56"
                    className={clsx(
                      "stroke-current",
                      report.confidenceScore === 'High' ? 'text-green-500' :
                        report.confidenceScore === 'Medium' ? 'text-yellow-500' : 'text-red-500'
                    )}
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray="351"
                    strokeDashoffset="351"
                    animate={{ strokeDashoffset: report.confidenceScore === 'High' ? 35 : report.confidenceScore === 'Medium' ? 175 : 280 }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-bold text-black/80">
                    {report.confidenceScore === 'High' ? '92' : report.confidenceScore === 'Medium' ? '65' : '30'}%
                  </span>
                </div>
              </div>
              <h3 className="text-sm font-semibold text-black/50">AI Confidence</h3>
            </motion.div>

            {/* 3. Pain Level (Small Square) */}
            <motion.div
              className="md:col-span-1 md:row-span-1 macos-card p-8 flex flex-col justify-between"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <AlertTriangle className="w-8 h-8 text-orange-500 mb-4" />
              <div>
                <h3 className="text-4xl font-bold text-black/80 mb-1">{report.problemSeverity}/10</h3>
                <div className="w-full h-2 bg-black/5 rounded-full mt-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${report.problemSeverity * 10}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className={clsx("h-full rounded-full", report.problemSeverity > 7 ? "bg-red-500" : report.problemSeverity > 4 ? "bg-orange-500" : "bg-blue-500")}
                  />
                </div>
                <p className="text-sm font-medium text-black/40 mt-2">Pain Severity</p>
              </div>
            </motion.div>

            {/* 4. Kill Switch (Wide Rectangle) */}
            <motion.div
              className="md:col-span-2 macos-card p-8 flex flex-col justify-center bg-red-50/50 relative overflow-hidden"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="absolute top-0 right-0 p-20 bg-red-500/5 blur-3xl -mr-10 -mt-10" />
              <h3 className="flex items-center gap-2 text-red-500 font-bold uppercase tracking-widest text-xs mb-4">
                <ShieldAlert className="w-4 h-4" /> Why It Fails
              </h3>
              <p className="text-xl text-black/80 font-medium leading-relaxed">
                "{report.whyItFails}"
              </p>
              <p className="mt-4 text-sm text-black/50 border-l-2 border-red-500/20 pl-4 py-1">
                ⛔ Not for: {report.whoShouldNotBuild}
              </p>
            </motion.div>

            {/* 5. Summary (Tall Rectangle) */}
            <motion.div
              className="md:col-span-2 md:row-span-2 macos-card p-8 flex flex-col gap-6"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-sm font-bold uppercase tracking-widest text-black/40 flex items-center gap-2">
                <Layers className="w-4 h-4" /> Executive Summary
              </h3>
              <p className="text-lg text-black/70 leading-relaxed">
                {report.summary}
              </p>

              <div className="p-6 bg-white/40 rounded-2xl border border-white/40 shadow-sm">
                <h4 className="text-xs text-black/40 uppercase font-bold mb-3">Target Users</h4>
                <p className="text-black/80">{report.targetUsers}</p>
              </div>
            </motion.div>

            {/* 6. Market Demand (Small) */}
            <motion.div
              className="macos-card p-8 flex flex-col justify-center"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <TrendingUp className="w-8 h-8 text-blue-500 mb-auto" />
              <div>
                <div className="flex items-end gap-1 h-8 mb-2">
                  {['Low', 'Medium', 'High'].map((level, i) => {
                    const targetIndex = ['Low', 'Medium', 'High'].indexOf(report.marketDemand);
                    return (
                      <motion.div
                        key={level}
                        initial={{ height: '20%', opacity: 0.3 }}
                        animate={{ height: i <= targetIndex ? '100%' : '20%', opacity: i <= targetIndex ? 1 : 0.3 }}
                        transition={{ delay: 0.6 + (i * 0.1) }}
                        className={clsx("w-3 rounded-sm", i === 0 ? "bg-red-400" : i === 1 ? "bg-yellow-400" : "bg-green-400")}
                      />
                    )
                  })}
                </div>
                <h3 className="text-2xl font-bold text-black/80 mb-1">{report.marketDemand}</h3>
                <p className="text-sm font-medium text-black/40">Demand</p>
              </div>
            </motion.div>

            {/* 7. Roadmap Launch Button */}
            <motion.div
              className="macos-card p-8 flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.7 }}
              onClick={roadmap ? () => setShowRoadmapModal(true) : handleGenerateRoadmap}
            >
              <Map className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-2xl font-bold text-black/80 mb-2 text-center">
                {roadmap ? "View Roadmap" : "Generate Roadmap"}
              </h3>
              <p className="text-sm text-black/50 text-center mb-4">
                {roadmap ? "4-week execution plan ready" : "Get your 4-week launch plan"}
              </p>
              {isGeneratingRoadmap && (
                <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
              )}
            </motion.div>

            {/* 8. Risks (Wide Rectangle - Fills the gap next to Summary) */}
            <motion.div
              className="md:col-span-2 macos-card p-8 flex flex-col justify-between bg-orange-50/50"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div>
                <h3 className="flex items-center gap-2 text-orange-600 font-bold uppercase tracking-widest text-xs mb-4">
                  <AlertOctagon className="w-4 h-4" /> Venture Risks
                </h3>
                <p className="text-lg text-black/80 font-medium leading-relaxed">
                  "{report.risks}"
                </p>
              </div>
            </motion.div>

            {/* 9. Monetization (Wide) */}
            <motion.div
              className="md:col-span-2 macos-card p-8"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <h3 className="flex items-center gap-2 text-green-600 font-bold uppercase tracking-widest text-xs mb-6">
                <DollarSign className="w-4 h-4" /> Monetization Models
              </h3>
              <div className="flex flex-wrap gap-3">
                {report.monetizationPaths?.map((path, i) => (
                  <span key={i} className="px-4 py-2 bg-white/60 border border-green-200/50 rounded-lg text-sm font-medium text-black/70 shadow-sm">
                    {path}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* 10. Competitors (Wide) */}
            <motion.div
              className="md:col-span-2 macos-card p-8"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.0 }}
            >
              <h3 className="flex items-center gap-2 text-blue-600 font-bold uppercase tracking-widest text-xs mb-6">
                <Users className="w-4 h-4" /> Known Competitors
              </h3>
              <div className="flex flex-wrap gap-3">
                {report.alternatives?.map((alt, i) => (
                  <span key={i} className="px-4 py-2 bg-white/60 border border-blue-200/50 rounded-lg text-sm font-medium text-black/70 shadow-sm flex items-center gap-2">
                    <img src={`https://www.google.com/s2/favicons?domain=${alt.replace(/\s+/g, '').toLowerCase()}.com&sz=128`} alt="" className="w-4 h-4 opacity-50" onError={(e) => (e.currentTarget.style.display = 'none')} />
                    {alt}
                  </span>
                ))}
              </div>
            </motion.div>





          </motion.div>
        )}
      </div>

      {/* Fullscreen Roadmap Modal */}
      <AnimatePresence>
        {showRoadmapModal && roadmap && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xl p-6"
            onClick={() => setShowRoadmapModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <Map className="w-10 h-10" />
                    <div>
                      <h2 className="text-4xl font-bold tracking-tight">Your 4-Week Roadmap</h2>
                      <p className="text-white/80 text-lg mt-1">From idea to launch</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowRoadmapModal(false)}
                    className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 overflow-y-auto max-h-[calc(90vh-180px)]">
                <div className="space-y-12">
                  {roadmap.map((week, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="relative"
                    >
                      {/* Week Card */}
                      <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-100 shadow-lg">
                        {/* Week Badge */}
                        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-full mb-6 shadow-md">
                          <span className="text-2xl font-bold">{week.week}</span>
                        </div>

                        {/* Week Title */}
                        <h3 className="text-3xl font-bold text-black/90 mb-6">
                          {week.title}
                        </h3>

                        {/* Tasks */}
                        <div className="space-y-4">
                          {week.tasks.map((task: string, j: number) => (
                            <motion.div
                              key={j}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 + j * 0.05 }}
                              className="flex items-start gap-4 bg-white p-4 rounded-xl border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all group"
                            >
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 group-hover:scale-110 transition-transform">
                                {j + 1}
                              </div>
                              <p className="text-lg text-black/80 leading-relaxed flex-1">
                                {task}
                              </p>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Connector Line */}
                      {i < roadmap.length - 1 && (
                        <div className="flex justify-center my-8">
                          <div className="w-1 h-12 bg-gradient-to-b from-purple-300 to-blue-300 rounded-full" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
