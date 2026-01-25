"use client";

import { useState } from "react";
import { ArrowRight, AlertTriangle, TrendingUp, Target, ShieldAlert, Layers, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { validateIdea } from "./actions";
import { ValidationReport } from "./types";
import Dock from "./components/Dock/Dock";
import MaskedText from "./components/MaskedText";

export default function Home() {
  const [idea, setIdea] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<ValidationReport | null>(null);

  const handleAnalyze = async () => {
    if (!idea.trim()) return;
    setIsAnalyzing(true);
    setReport(null);

    try {
      const result = await validateIdea(idea);
      setReport(result);
    } catch (error) {
      console.error("Validation failed", error);
    } finally {
      setIsAnalyzing(false);
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

        {/* Siri Loading State */}
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-3xl"
          >
            <div className="siri-container mb-12">
              <div className="siri-orb" />
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold text-black/80 tracking-tight mb-2">Thinking...</h2>
            <p className="text-black/40 text-lg animate-pulse">Running rigorous feasibility checks</p>
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
                <p className="text-sm font-medium text-black/40">Pain Severity</p>
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
                <h3 className="text-2xl font-bold text-black/80 mb-1">{report.marketDemand}</h3>
                <p className="text-sm font-medium text-black/40">Demand</p>
              </div>
            </motion.div>

            {/* 7. MVP Scope (Small) */}
            <motion.div
              className="macos-card p-8 flex flex-col justify-center"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <Target className="w-8 h-8 text-purple-500 mb-auto" />
              <div>
                <p className="text-sm text-black/80 font-medium line-clamp-3 leading-relaxed">
                  {report.mvpScope}
                </p>
                <p className="text-xs font-bold text-black/30 mt-4 uppercase tracking-wider">MVP Scope</p>
              </div>
            </motion.div>

            <motion.div
              className="md:col-span-4 flex justify-center pt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <button
                onClick={() => setReport(null)}
                className="liquid-button px-8 py-3 bg-white text-blue-600 hover:bg-gray-50 border border-gray-200 shadow-sm"
              >
                Validate another idea
              </button>
            </motion.div>

          </motion.div>
        )}
      </div>
    </main>
  );
}
