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
            className="macos-card rounded-xl overflow-hidden group"
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-left p-6 flex justify-between items-center text-lg font-medium text-gray-200 group-hover:text-white transition-colors"
            >
                {question}
                <div className={clsx(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 border",
                    isOpen ? "bg-white text-black border-white rotate-180" : "bg-white/5 border-white/10 text-gray-400 group-hover:bg-white/10 group-hover:border-white/20"
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
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="overflow-hidden"
                    >
                        <div className="p-6 pt-0 text-gray-400 leading-relaxed text-base border-t border-white/5">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
