"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

export default function FAQItem({ question, answer, index }: { question: string, answer: string, index: number }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="macos-card bg-white/40 backdrop-blur-md border border-white/20 shadow-sm rounded-2xl overflow-hidden group"
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-left p-6 flex justify-between items-center text-lg font-medium text-black/80 group-hover:text-black transition-colors"
            >
                {question}
                <div className={clsx(
                    "w-8 h-8 rounded-full bg-black/5 flex items-center justify-center transition-all duration-300",
                    isOpen ? "bg-blue-500 text-white rotate-180" : "group-hover:bg-black/10 text-black/40"
                )}>
                    <ChevronDown className="w-4 h-4" />
                </div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="p-6 pt-0 text-black/60 leading-relaxed text-base border-t border-black/5">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
