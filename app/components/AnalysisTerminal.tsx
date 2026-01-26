"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, Terminal, ShieldCheck, Database, Users, BrainCircuit } from "lucide-react";
import clsx from "clsx";

const STEPS = [
    { text: "Initializing analysis protocol...", icon: Terminal, duration: 800 },
    { text: "Scanning market signals...", icon: Database, duration: 1500 },
    { text: "Simulating user interviews...", icon: Users, duration: 1200 },
    { text: "Evaluating logic gaps...", icon: BrainCircuit, duration: 1500 },
    { text: "Calculating survival probability...", icon: ShieldCheck, duration: 1000 },
    { text: "Finalizing report...", icon: CheckCircle2, duration: 800 },
];

export default function AnalysisTerminal() {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    useEffect(() => {
        if (currentStepIndex >= STEPS.length - 1) return;

        const timeout = setTimeout(() => {
            setCurrentStepIndex((prev) => prev + 1);
        }, STEPS[currentStepIndex].duration);

        return () => clearTimeout(timeout);
    }, [currentStepIndex]);

    return (
        <div className="md:w-[500px] w-full max-w-lg mx-auto">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-black/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden font-mono text-sm group"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <div className="text-white/30 text-xs tracking-wider">SYSTEM_ANALYSIS_V2</div>
                    <div className="w-12" /> {/* Spacer for centering */}
                </div>

                {/* Content */}
                <div className="p-6 h-[300px] flex flex-col justify-end relative">
                    {/* Progress Bar Background */}
                    <div className="absolute top-0 left-0 h-1 bg-white/5 w-full" />
                    <motion.div
                        className="absolute top-0 left-0 h-1 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                        initial={{ width: "0%" }}
                        animate={{ width: `${((currentStepIndex + 1) / STEPS.length) * 100}%` }}
                        transition={{ duration: 0.5 }}
                    />

                    <div className="space-y-4">
                        {STEPS.map((step, index) => {
                            // Only show valid steps up to current + maybe 1 next? No, just up to current for clean log look
                            if (index > currentStepIndex) return null;

                            const isCurrent = index === currentStepIndex;
                            const isDone = index < currentStepIndex;
                            const Icon = step.icon;

                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={clsx(
                                        "flex items-center gap-3",
                                        isCurrent ? "text-blue-400" : isDone ? "text-green-500/50" : "text-white/20"
                                    )}
                                >
                                    <div className={clsx(
                                        "w-5 h-5 flex items-center justify-center rounded",
                                        isCurrent ? "bg-blue-500/10" : ""
                                    )}>
                                        {isCurrent ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Icon className="w-4 h-4" />
                                        )}
                                    </div>
                                    <span className={isCurrent ? "animate-pulse font-bold" : ""}>
                                        {step.text}
                                    </span>
                                </motion.div>
                            )
                        })}
                    </div>

                    {/* Cursor */}
                    {currentStepIndex < STEPS.length - 1 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ repeat: Infinity, duration: 0.8 }}
                            className="w-2 h-4 bg-blue-500 ml-1 mt-2 inline-block"
                        />
                    )}
                </div>

                {/* Footer info */}
                <div className="px-4 py-2 bg-white/5 border-t border-white/5 text-xs text-white/30 flex justify-between">
                    <span>CPU: 12%</span>
                    <span>MEM: 432MB</span>
                    <span>SECURE_CONNECTION</span>
                </div>

            </motion.div>
        </div>
    );
}
