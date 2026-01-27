"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "./Loader";

const MESSAGES = [
    "Analyzing your vision...",
    "Consulting startup oracles...",
    "Simulating 1000 user interviews...",
    "Checking if it's been done before...",
    "Running brutally honest evaluation...",
    "Predicting failure scenarios...",
    "Calculating unicorn probability...",
    "Almost there, brewing insights...",
    "Finalizing your reality check..."
];

const HUMOR_MESSAGES = [
    "Spoiler: It's probably been tried...",
    "Finding your competitors (sorry)...",
    "Checking if VCs would laugh...",
    "Measuring hype vs substance...",
    "This might hurt a little..."
];

export default function AnalysisTerminal() {
    const [currentMessage, setCurrentMessage] = useState(0);
    const [showHumor, setShowHumor] = useState(false);
    const [humorMessage, setHumorMessage] = useState("");

    useEffect(() => {
        const messageInterval = setInterval(() => {
            setCurrentMessage((prev) => (prev + 1) % MESSAGES.length);

            // Random humor injection
            if (Math.random() > 0.7) {
                setHumorMessage(HUMOR_MESSAGES[Math.floor(Math.random() * HUMOR_MESSAGES.length)]);
                setShowHumor(true);
                setTimeout(() => setShowHumor(false), 2000);
            }
        }, 2000);

        return () => clearInterval(messageInterval);
    }, []);

    return (
        <div className="w-full h-full flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
            >
                <div className="relative z-10 flex flex-col items-center gap-8 md:gap-12">
                    {/* Spinning Icon */}
                    <div className="scale-75 md:scale-100">
                        <Loader />
                    </div>

                    {/* Main Message */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentMessage}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="text-center"
                        >
                            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3 md:mb-4 tracking-tight">
                                {MESSAGES[currentMessage]}
                            </h2>
                        </motion.div>
                    </AnimatePresence>

                    {/* Humor Messages */}
                    <AnimatePresence>
                        {showHumor && (
                            <motion.p
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="text-gray-500 text-sm md:text-base italic"
                            >
                                {humorMessage}
                            </motion.p>
                        )}
                    </AnimatePresence>

                    {/* Progress Dots */}
                    <div className="flex gap-2">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.3, 1, 0.3]
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    delay: i * 0.2
                                }}
                                className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-white"
                            />
                        ))}
                    </div>

                    {/* Subtle Text */}
                    <p className="text-gray-600 text-xs md:text-sm tracking-widest uppercase font-medium">
                        Powered by AI Intelligence
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
