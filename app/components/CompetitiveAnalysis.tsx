"use client";

import { motion } from "framer-motion";
import { Target, TrendingUp, Shield, AlertTriangle, ExternalLink as ExternalLinkIcon } from "lucide-react";
import { CompetitiveAnalysis as CompetitiveAnalysisType } from "../types";

interface CompetitiveAnalysisProps {
    data: CompetitiveAnalysisType;
}

export default function CompetitiveAnalysis({ data }: CompetitiveAnalysisProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="macos-card p-8 mt-6"
        >
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <Target className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white">Competitive Analysis</h3>
                    <p className="text-sm text-gray-500">Market positioning & competitive landscape</p>
                </div>
            </div>

            {/* Market Position */}
            <div className="mb-6 p-5 rounded-lg border border-white/5 bg-white/5">
                <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                        <h4 className="font-medium text-white mb-1">Market Position</h4>
                        <p className="text-sm text-gray-400 leading-relaxed">{data.marketPosition}</p>
                    </div>
                </div>
            </div>

            {/* Competitors */}
            {data.competitors.length > 0 && (
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-300 flex items-center gap-2 text-sm uppercase tracking-wider">
                            <Shield className="w-4 h-4" />
                            Key Competitors
                        </h4>
                        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-[10px] font-medium text-green-400">
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                            </span>
                            Live Results
                        </span>
                    </div>
                    <div className="grid gap-3">
                        {data.competitors.map((competitor, idx) => (
                            <div key={idx} className="p-5 rounded-lg border border-white/10 bg-[#0f0f0f] hover:border-white/20 transition-colors group">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        {/* Favicon Fetcher using Google's public service */}
                                        {competitor.url ? (
                                            <img
                                                src={`https://www.google.com/s2/favicons?domain=${competitor.url}&sz=128`}
                                                alt={`${competitor.name} icon`}
                                                className="w-6 h-6 rounded-md opacity-80"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                }}
                                            />
                                        ) : (
                                            <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center text-xs font-bold text-gray-400">
                                                {competitor.name.charAt(0)}
                                            </div>
                                        )}
                                        <h5 className="font-bold text-white text-lg">{competitor.name}</h5>
                                    </div>

                                    {competitor.url && (
                                        <a
                                            href={competitor.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                                            title="Visit Website"
                                        >
                                            <ExternalLinkIcon className="w-4 h-4" />
                                        </a>
                                    )}
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs font-semibold text-green-400 mb-2 uppercase tracking-wide">Strengths</p>
                                        <ul className="text-sm text-gray-400 space-y-1.5">
                                            {competitor.strengths.map((strength, i) => (
                                                <li key={i} className="flex items-start gap-2">
                                                    <span className="text-green-500/80 mt-0.5">✓</span>
                                                    <span>{strength}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-red-400 mb-2 uppercase tracking-wide">Weaknesses</p>
                                        <ul className="text-sm text-gray-400 space-y-1.5">
                                            {competitor.weaknesses.map((weakness, i) => (
                                                <li key={i} className="flex items-start gap-2">
                                                    <span className="text-red-500/80 mt-0.5">•</span>
                                                    <span>{weakness}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Differentiation Strategy */}
            <div className="mb-6 p-5 rounded-lg border border-purple-500/20 bg-purple-500/5">
                <h4 className="font-medium text-purple-200 mb-2">Differentiation Strategy</h4>
                <p className="text-sm text-purple-200/70">{data.differentiationStrategy}</p>
            </div>

            {/* Competitive Advantages */}
            <div className="mb-6">
                <h4 className="font-semibold text-gray-300 mb-3 text-sm uppercase tracking-wider">Your Competitive Advantages</h4>
                <div className="grid gap-2">
                    {data.competitiveAdvantages.map((advantage, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 rounded bg-green-500/5 border border-green-500/10">
                            <span className="text-green-400 font-bold">✓</span>
                            <span className="text-sm text-gray-300">{advantage}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Threats */}
            <div className="p-5 rounded-lg border border-red-500/20 bg-red-500/5">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
                    <div className="flex-1">
                        <h4 className="font-medium text-red-200 mb-2">Competitive Threats</h4>
                        <ul className="space-y-1.5">
                            {data.threats.map((threat, idx) => (
                                <li key={idx} className="text-sm text-red-200/70 flex items-start gap-2">
                                    <span className="text-red-400/80 mt-1">⚠</span>
                                    <span>{threat}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

