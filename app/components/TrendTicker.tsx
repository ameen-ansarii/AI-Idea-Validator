"use client";

import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

const trends = [
    "Generative AI", "Sustainable Tech", "Longevity", "Micro-SaaS",
    "No-Code Tools", "Web3 Gaming", "Smart Home", "Health Wearables",
    "EdTech for Adults", "Remote Work Infra", "Cybersecurity", "Clean Energy",
    "Personalized Nutrition", "Mental Health Apps", "Vertical Marketplaces"
];

export default function TrendTicker() {
    return (
        <div className="w-full border-y border-white/5 bg-[#050505]/50 backdrop-blur-sm overflow-hidden py-3 flex relative z-10">
            <div className="flex-shrink-0 flex items-center gap-2 px-6 border-r border-white/5 bg-[#050505] z-20">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-xs font-semibold text-white tracking-wider uppercase">Live Trends</span>
            </div>

            <div className="flex overflow-hidden relative w-full mask-gradient">
                <motion.div
                    className="flex gap-8 items-center whitespace-nowrap pl-8"
                    animate={{ x: [0, -1000] }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 40
                    }}
                >
                    {[...trends, ...trends, ...trends].map((trend, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-400 hover:text-white transition-colors cursor-default">#{trend}</span>
                            <span className="w-1 h-1 rounded-full bg-white/10" />
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
