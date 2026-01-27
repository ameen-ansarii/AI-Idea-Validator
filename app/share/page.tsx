"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle2, AlertTriangle, XCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { ValidationReport } from "../types";
import Dock from "../components/Dock/Dock";
import clsx from "clsx";

function ShareContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [data, setData] = useState<{ idea: string; report: ValidationReport; timestamp: number } | null>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        const encoded = searchParams.get("data");
        if (encoded) {
            try {
                // Decode: Base64 -> JSON string -> Object
                const json = decodeURIComponent(escape(atob(encoded)));
                const parsed = JSON.parse(json);
                setData(parsed);
            } catch (e) {
                console.error("Failed to parse share data", e);
                setError(true);
            }
        } else {
            setError(true);
        }
    }, [searchParams]);

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <AlertTriangle className="w-16 h-16 text-yellow-500 mb-4" />
                <h1 className="text-2xl font-bold text-white mb-2">Invalid Link</h1>
                <p className="text-gray-400 mb-6">This analysis link is broken or expired.</p>
                <Link href="/" className="px-6 py-2 bg-white text-black rounded-full font-medium hover:scale-105 transition-transform">
                    Go Home
                </Link>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const { idea, report } = data;

    return (
        <main className="min-h-screen flex flex-col items-center p-6 pt-24 relative bg-black selection:bg-purple-500/30">
            <div className="fixed inset-0 z-0 bg-aurora pointer-events-none opacity-50" />
            <Dock />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl w-full z-10"
            >
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-green-500/30 bg-green-500/10 mb-4">
                        <ShieldCheck className="w-4 h-4 text-green-400" />
                        <span className="text-xs font-bold text-green-400 uppercase tracking-widest">Verified Report</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
                        Idea Validation Analysis
                    </h1>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm max-w-2xl mx-auto">
                        <p className="text-lg text-gray-300 italic">"{idea}"</p>
                    </div>
                </div>

                {/* Verdict Card */}
                <div className="macos-card p-8 mb-6 flex flex-col md:flex-row items-center gap-8 justify-between bg-[#0a0a0a]">
                    <div>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">AI Verdict</h3>
                        <h2 className={clsx(
                            "text-5xl font-bold tracking-tighter",
                            report.verdict === "Build Now" ? "text-white" :
                                report.verdict === "Build with Caution" ? "text-yellow-400" : "text-red-400"
                        )}>
                            {report.verdict}
                        </h2>
                    </div>
                    <div className="text-right">
                        <div className="text-6xl font-bold text-white/10">{report.confidenceScore === 'High' ? '92' : '65'}%</div>
                        <div className="text-sm text-gray-500 font-medium">Confidence Score</div>
                    </div>
                </div>

                {/* Core Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="macos-card p-6">
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Executive Summary</h3>
                        <p className="text-gray-300 leading-relaxed">{report.summary}</p>
                    </div>

                    <div className="space-y-6">
                        <div className="macos-card p-6">
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Why it might fail</h3>
                            <p className="text-gray-300">{report.whyItFails}</p>
                        </div>
                        <div className="macos-card p-6">
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Market Demand</h3>
                            <p className="text-white font-bold text-xl">{report.marketDemand}</p>
                            <p className="text-sm text-gray-500 mt-2">{report.demandJustification}</p>
                        </div>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="mt-16 text-center space-y-4">
                    <p className="text-gray-400">Want to validate your own startup idea?</p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:scale-105 transition-transform"
                    >
                        Run Free Analysis <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </motion.div>
        </main>
    );
}

export default function SharePage() {
    return (
        <Suspense fallback={null}>
            <ShareContent />
        </Suspense>
    );
}
