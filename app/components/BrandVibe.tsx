"use client";

import { motion } from "framer-motion";
import { Palette, Share2 } from "lucide-react";

interface BrandVibeProps {
    data: {
        colors: string[];
        fontPair: string;
        slogan: string;
        designStyle: string;
    } | null;
}

export default function BrandVibe({ data }: BrandVibeProps) {
    if (!data) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="macos-card p-6 md:col-span-4"
        >
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                        <Palette className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white">Brand Vibe Check</h3>
                        <p className="text-xs text-indigo-300/80 uppercase tracking-widest font-medium">{data.designStyle}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Slogan & Typography */}
                <div className="space-y-6">
                    <div>
                        <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold block mb-2">Generated Slogan</span>
                        <h2 className="text-2xl md:text-3xl font-serif italic text-white leading-tight">
                            "{data.slogan}"
                        </h2>
                    </div>

                    <div>
                        <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold block mb-2">Typography Pair</span>
                        <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                            <span className="font-mono text-sm text-gray-300">{data.fontPair}</span>
                        </div>
                    </div>
                </div>

                {/* Color Palette */}
                <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold block mb-4">Color Palette</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {data.colors.map((color, idx) => (
                            <div key={idx} className="space-y-2 group cursor-pointer">
                                <div
                                    className="h-20 w-full rounded-xl shadow-lg transform transition-transform group-hover:scale-105 border border-white/10"
                                    style={{ backgroundColor: color }}
                                />
                                <p className="text-center font-mono text-xs text-gray-400 uppercase group-hover:text-white transition-colors">
                                    {color}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
