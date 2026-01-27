"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Lightbulb, Target, Rocket } from "lucide-react";

export default function OnboardingTutorial() {
    const [showTutorial, setShowTutorial] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        // Check if user has seen the tutorial
        const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
        if (!hasSeenTutorial) {
            setTimeout(() => setShowTutorial(true), 1000);
        }
    }, []);

    const steps = [
        {
            title: "Welcome to Idea Validator! 👋",
            description: "Get brutal, honest AI feedback on your startup ideas in seconds. No fluff, just data-driven insights.",
            icon: <Lightbulb className="w-12 h-12 text-yellow-500" />,
            color: "from-yellow-500/20 to-orange-500/20"
        },
        {
            title: "How it works",
            description: "Simply describe your idea, and our AI will analyze market demand, competition, risks, and give you a final verdict with actionable next steps.",
            icon: <Target className="w-12 h-12 text-blue-500" />,
            color: "from-blue-500/20 to-purple-500/20"
        },
        {
            title: "Try Famous Ideas",
            description: "Not sure where to start? Scroll down to see how billion-dollar companies like Airbnb, Uber, and Spotify would be validated!",
            icon: <Rocket className="w-12 h-12 text-purple-500" />,
            color: "from-purple-500/20 to-pink-500/20"
        }
    ];

    const handleComplete = () => {
        localStorage.setItem('hasSeenTutorial', 'true');
        setShowTutorial(false);
    };

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleComplete();
        }
    };

    const handleSkip = () => {
        handleComplete();
    };

    return (
        <AnimatePresence>
            {showTutorial && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4"
                    onClick={handleSkip}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", damping: 25 }}
                        className="relative max-w-lg w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Card */}
                        <div className="macos-card p-1 shadow-2xl">
                            <div className={`rounded-[22px] p-8 md:p-12 relative overflow-hidden bg-[#0a0a0a]`}>

                                <div className={`absolute inset-0 bg-gradient-to-br ${steps[currentStep].color} opacity-10`} />

                                {/* Close button */}
                                <button
                                    onClick={handleSkip}
                                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all border border-white/5"
                                >
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>

                                {/* Content */}
                                <div className="space-y-6 text-center relative z-10">
                                    <div className="flex justify-center">
                                        {steps[currentStep].icon}
                                    </div>

                                    <div className="space-y-3">
                                        <h2 className="text-3xl md:text-4xl font-bold text-white">
                                            {steps[currentStep].title}
                                        </h2>
                                        <p className="text-lg text-gray-400 leading-relaxed">
                                            {steps[currentStep].description}
                                        </p>
                                    </div>

                                    {/* Progress dots */}
                                    <div className="flex justify-center gap-2 pt-4">
                                        {steps.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setCurrentStep(idx)}
                                                className={`h-2 rounded-full transition-all ${idx === currentStep
                                                        ? 'w-8 bg-white'
                                                        : 'w-2 bg-white/20 hover:bg-white/40'
                                                    }`}
                                            />
                                        ))}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3 pt-4">
                                        {currentStep > 0 && (
                                            <button
                                                onClick={() => setCurrentStep(currentStep - 1)}
                                                className="flex-1 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-all border border-white/10"
                                            >
                                                Back
                                            </button>
                                        )}
                                        <button
                                            onClick={handleNext}
                                            className="flex-1 px-6 py-3 rounded-xl bg-white hover:bg-gray-200 text-black font-semibold transition-all flex items-center justify-center gap-2"
                                        >
                                            {currentStep < steps.length - 1 ? (
                                                <>
                                                    Next
                                                    <ArrowRight className="w-5 h-5" />
                                                </>
                                            ) : (
                                                "Get Started"
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
