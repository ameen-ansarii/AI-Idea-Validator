"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Copy, Plus, Sparkles, RefreshCcw, ArrowRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import clsx from "clsx";

interface IdeaSlotMachineProps {
    onValidate: (idea: string) => void;
}

const industries = [
    "Fintech", "Edtech", "Healthtech", "Agrotech", "Logistics",
    "Cybersecurity", "E-commerce", "Social Media", "Real Estate",
    "Clean Energy", "Gaming", "LegalTech", "HR Tech", "Travel"
];

const targets = [
    "Toddlers", "Students", "Remote Workers", "Enterprises",
    "Farmers", "Gamers", "Doctors", "Freelancers", "Retirees",
    "Pet Owners", "Developers", "Small Businesses", "Artists"
];

const models = [
    "Subscription", "Marketplace", "On-Demand", "Freemium",
    "Pay-per-use", "AI-Powered", "Blockchain-based", "DAO",
    "Peer-to-Peer", "API-First", "Open Source", "Mobile-First"
];

export default function IdeaSlotMachine({ onValidate }: IdeaSlotMachineProps) {
    const [isSpinning, setIsSpinning] = useState(false);
    const [result, setResult] = useState({ industry: "Fintech", target: "Students", model: "AI-Powered" });
    const [generatedIdea, setGeneratedIdea] = useState("");

    const spinDuration = 2000; // ms

    const handleSpin = () => {
        if (isSpinning) return;
        setIsSpinning(true);

        // Simulate spinning by rapidly changing state (visually handled by motion keyframes ideally, but state updates work for simple slot feel)
        // Actually, for a true slot effect, we usually just animate the visual column.
        // For simplicity in this text-based implementation, we'll use a CSS blur animation and random text shuffling.

        const interval = setInterval(() => {
            setResult({
                industry: industries[Math.floor(Math.random() * industries.length)],
                target: targets[Math.floor(Math.random() * targets.length)],
                model: models[Math.floor(Math.random() * models.length)],
            });
        }, 100);

        setTimeout(() => {
            clearInterval(interval);
            const finalResult = {
                industry: industries[Math.floor(Math.random() * industries.length)],
                target: targets[Math.floor(Math.random() * targets.length)],
                model: models[Math.floor(Math.random() * models.length)],
            };
            setResult(finalResult);
            generateSentence(finalResult);
            setIsSpinning(false);
        }, spinDuration);
    };

    const generateSentence = (res: typeof result) => {
        const vowel = ['A', 'E', 'I', 'O', 'U'].includes(res.model[0]) ? 'An' : 'A';
        setGeneratedIdea(`${vowel} ${res.model} ${res.industry} solution tailored for ${res.target}.`);
    };

    // Initial generation
    useEffect(() => {
        generateSentence(result);
    }, []);

    return (
        <div className="w-full max-w-4xl mx-auto mt-24 mb-12 relative z-10">

            <div className="flex flex-col items-center justify-center mb-10 text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-pink-500/30 bg-pink-500/10 mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                    <span className="text-xs font-medium text-pink-300">Idea Generator</span>
                </div>
                <h3 className="text-3xl font-semibold text-white tracking-tight">Need Inspiration?</h3>
                <p className="text-gray-500 max-w-lg">Spin the wheels to generate a random startup concept, then validate it instantly.</p>
            </div>

            <div className="hidden md:flex justify-center gap-4 mb-8">
                {/* Slot 1: Model */}
                <SlotColumn label="Model" value={result.model} isSpinning={isSpinning} delay={0} />
                {/* Connector */}
                <div className="flex items-center text-gray-600 font-serif italic text-xl">for</div>
                {/* Slot 2: Target */}
                <SlotColumn label="Target Audience" value={result.target} isSpinning={isSpinning} delay={0.1} />
                {/* Connector */}
                <div className="flex items-center text-gray-600 font-serif italic text-xl">in</div>
                {/* Slot 3: Industry */}
                <SlotColumn label="Industry" value={result.industry} isSpinning={isSpinning} delay={0.2} />
            </div>

            {/* Mobile simplified view */}
            <div className="md:hidden flex flex-col items-center gap-4 mb-8 bg-white/5 p-6 rounded-2xl border border-white/10">
                <div className="text-xl font-medium text-white text-center">
                    {isSpinning ? (
                        <span className="animate-pulse text-gray-500">Spinning...</span>
                    ) : (
                        <span className="leading-relaxed">
                            {generatedIdea}
                        </span>
                    )}
                </div>
            </div>

            <div className="flex justify-center gap-4">
                <button
                    onClick={handleSpin}
                    disabled={isSpinning}
                    className={clsx(
                        "liquid-button px-8 py-4 flex items-center gap-3 text-base font-semibold transition-all shadow-[0_0_20px_-5px_rgba(236,72,153,0.3)]",
                        isSpinning && "opacity-80 scale-95 cursor-not-allowed"
                    )}
                >
                    <RefreshCcw className={clsx("w-5 h-5", isSpinning && "animate-spin")} />
                    {isSpinning ? "Randomizing..." : "Spin New Idea"}
                </button>

                <button
                    onClick={() => onValidate(generatedIdea)}
                    disabled={isSpinning}
                    className="liquid-button secondary px-8 py-4 flex items-center gap-3 text-base font-semibold group hover:bg-white/10 hover:border-white/20"
                >
                    <span>Validate This</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
}

function SlotColumn({ label, value, isSpinning, delay }: { label: string, value: string, isSpinning: boolean, delay: number }) {
    return (
        <div className="flex flex-col items-center gap-3">
            <span className="text-[10px] uppercase tracking-widest text-gray-600 font-medium">{label}</span>
            <div className="w-64 h-24 bg-[#0a0a0a] border border-white/10 rounded-xl flex items-center justify-center relative overflow-hidden shadow-inner inset-shadow-black">
                {/* Gradient Masks */}
                <div className="absolute top-0 left-0 w-full h-6 bg-gradient-to-b from-[#0a0a0a] to-transparent z-10" />
                <div className="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-t from-[#0a0a0a] to-transparent z-10" />

                <motion.div
                    key={isSpinning ? 'spinning' : value}
                    initial={{ y: isSpinning ? 0 : -20, opacity: 0, filter: "blur(8px)" }}
                    animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                    transition={{ duration: 0.5, delay: isSpinning ? 0 : delay, type: "spring" }}
                    className="text-xl font-bold text-white tracking-tight"
                >
                    {value}
                </motion.div>
            </div>
        </div>
    )
}
