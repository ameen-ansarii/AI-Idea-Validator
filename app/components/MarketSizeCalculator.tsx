"use client";

import { motion } from "framer-motion";
import { DollarSign, TrendingUp, Target } from "lucide-react";
import { MarketSize } from "../types";

interface MarketSizeCalculatorProps {
    data: MarketSize;
}

export default function MarketSizeCalculator({ data }: MarketSizeCalculatorProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="macos-card p-8 mt-6"
        >
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-400" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white">Market Size Analysis</h3>
                    <p className="text-sm text-gray-400">TAM, SAM, SOM & Revenue Projections</p>
                </div>
            </div>

            {/* Market Funnel Visualization */}
            <div className="mb-8 space-y-3">
                {/* TAM */}
                <div className="relative">
                    <div className="w-full p-4 rounded-xl border border-blue-500/20 bg-blue-500/5">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Target className="w-5 h-5 text-blue-400" />
                                <span className="font-bold text-white">TAM</span>
                                <span className="text-xs text-gray-500">(Total Addressable Market)</span>
                            </div>
                            <span className="text-2xl font-bold text-blue-400">{data.tam}</span>
                        </div>
                        <p className="text-sm text-gray-400">{data.tamJustification}</p>
                    </div>
                </div>

                {/* SAM */}
                <div className="relative pl-6 md:pl-12">
                    <div className="w-full p-4 rounded-xl border border-purple-500/20 bg-purple-500/5">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Target className="w-5 h-5 text-purple-400" />
                                <span className="font-bold text-white">SAM</span>
                                <span className="text-xs text-gray-500">(Serviceable Addressable Market)</span>
                            </div>
                            <span className="text-2xl font-bold text-purple-400">{data.sam}</span>
                        </div>
                        <p className="text-sm text-gray-400">{data.samJustification}</p>
                    </div>
                </div>

                {/* SOM */}
                <div className="relative pl-12 md:pl-24">
                    <div className="w-full p-4 rounded-xl border border-green-500/20 bg-green-500/5">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Target className="w-5 h-5 text-green-400" />
                                <span className="font-bold text-white">SOM</span>
                                <span className="text-xs text-gray-500">(Serviceable Obtainable Market)</span>
                            </div>
                            <span className="text-2xl font-bold text-green-400">{data.som}</span>
                        </div>
                        <p className="text-sm text-gray-400">{data.somJustification}</p>
                    </div>
                </div>
            </div>

            {/* Revenue Projections */}
            <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
                <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="w-5 h-5 text-orange-400" />
                    <h4 className="font-bold text-white">3-Year Revenue Projection</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 rounded-lg bg-[#0f0f0f] border border-white/10">
                        <p className="text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wider">Year 1</p>
                        <p className="text-2xl font-bold text-white">{data.revenueProjection.year1}</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-[#0f0f0f] border border-white/10">
                        <p className="text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wider">Year 2</p>
                        <p className="text-2xl font-bold text-white">{data.revenueProjection.year2}</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-[#0f0f0f] border border-white/10">
                        <p className="text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wider">Year 3</p>
                        <p className="text-2xl font-bold text-white">{data.revenueProjection.year3}</p>
                    </div>
                </div>
            </div>

            {/* Info note */}
            <div className="mt-4 p-4 rounded-lg border border-blue-500/20 bg-blue-500/5">
                <p className="text-xs text-gray-400">
                    💡 <strong>Note:</strong> These projections are AI-generated estimates based on market analysis.
                    Actual results may vary. Use this as a starting point for deeper research.
                </p>
            </div>
        </motion.div>
    );
}
