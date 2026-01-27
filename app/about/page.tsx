"use client";

import { motion } from "framer-motion";
import FAQItem from "../components/FAQItem";
import MaskedText from "../components/MaskedText";
import Dock from "../components/Dock/Dock";

const faqs = [
    {
        question: "How reliable is the AI validation?",
        answer: "We use advanced LLMs (Google Gemma 2) configured with strict parameters. It acts as a neutral third-party critic, free from the emotional bias that friends and family have."
    },
    {
        question: "Is my idea safe?",
        answer: "Yes. Your submission is processed statelessly. We do not store your idea after the session ends, ensuring your intellectual property remains yours."
    },
    {
        question: "Who is this for?",
        answer: "Solopreneurs, hackathon teams, and early-stage founders who want to test assumptions before writing a single line of code."
    },
    {
        question: "What if the verdict is wrong?",
        answer: "The AI provides a probability-based assessment. Use it as a signal, not a law. If it flags risks, you now know what to fix."
    }
];

export default function AboutPage() {
    return (
        <main className="min-h-screen flex flex-col items-center p-6 pt-32 relative overflow-hidden">
            <Dock />
            <div className="bg-aurora" />

            <div className="max-w-4xl w-full z-10">
                <div className="text-center mb-16 space-y-6">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white">
                        <MaskedText text="About the" delay={0.1} />
                        <MaskedText text="Validator." delay={0.3} className="text-gray-500" />
                    </h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
                    >
                        We built this tool to help builders stop wasting time on ideas that won't work, so they can focus on the ones that will.
                    </motion.p>
                </div>

                <div className="grid gap-4 max-w-2xl mx-auto">
                    {faqs.map((faq, index) => (
                        <FAQItem key={index} question={faq.question} answer={faq.answer} index={index} />
                    ))}
                </div>
            </div>
        </main>
    );
}
