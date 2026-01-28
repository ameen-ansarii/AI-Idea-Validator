"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";

interface RoastCardProps {
    roast: string;
    onClose: () => void;
}

export default function RoastCard({ roast, onClose }: RoastCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
            onClick={onClose}
        >
            <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                className="max-w-xl w-full bg-[#1a0505] border border-red-500/30 rounded-2xl p-8 relative overflow-hidden shadow-[0_0_50px_-10px_rgba(220,38,38,0.3)]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Fire Animation Background - simplified */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-red-600/10 to-transparent pointer-events-none" />

                <div className="relative z-10 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-6 border border-red-500/20">
                        <Flame className="w-8 h-8 text-red-500 fill-red-500/50" />
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Roasted.</h2>
                    <p className="text-red-400 text-sm uppercase tracking-widest font-semibold mb-8">Viewer Discretion Advised</p>

                    <div className="bg-black/30 rounded-xl p-6 border border-white/5">
                        <p className="text-lg md:text-xl text-gray-200 font-medium leading-relaxed italic">
                            "{roast || "Your idea is so bland I couldn't even roast it."}"
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="mt-8 px-8 py-3 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg transition-colors w-full md:w-auto"
                    >
                        I Can Handle The Truth
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}
