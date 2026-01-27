"use client";

import { motion } from "framer-motion";
import { Lightbulb, Zap } from "lucide-react";

interface ExampleIdeasProps {
    onSelectIdea: (idea: string) => void;
}

const famousIdeas = [
    {
        name: "Airbnb",
        idea: "A platform where people can rent out their spare rooms or entire homes to travelers, offering a cheaper alternative to hotels.",
        color: "from-pink-500/20 to-rose-500/20",
        logo: "https://cdn.simpleicons.org/airbnb/white"
    },
    {
        name: "Uber",
        idea: "An app that connects passengers who need rides with drivers who have cars, providing on-demand transportation at the tap of a button.",
        color: "from-blue-500/20 to-cyan-500/20",
        logo: "https://cdn.simpleicons.org/uber/white"
    },
    {
        name: "Spotify",
        idea: "A music streaming service where users can listen to millions of songs for free with ads, or pay for an ad-free premium experience.",
        color: "from-green-500/20 to-emerald-500/20",
        logo: "https://cdn.simpleicons.org/spotify/white"
    },
    {
        name: "Notion",
        idea: "An all-in-one workspace that combines notes, databases, tasks, and wikis into a single collaborative platform for teams and individuals.",
        color: "from-gray-500/20 to-zinc-500/20",
        logo: "https://cdn.simpleicons.org/notion/white"
    },
    {
        name: "Duolingo",
        idea: "A gamified language learning app that makes education fun and accessible through bite-sized lessons and a streak-based reward system.",
        color: "from-yellow-500/20 to-orange-500/20",
        logo: "https://cdn.simpleicons.org/duolingo/white"
    },
    {
        name: "Discord",
        idea: "A communication platform originally for gamers, offering voice, video, and text chat organized into servers and channels for communities.",
        color: "from-indigo-500/20 to-blue-500/20",
        logo: "https://cdn.simpleicons.org/discord/white"
    }
];

export default function ExampleIdeas({ onSelectIdea }: ExampleIdeasProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-16 max-w-5xl mx-auto"
        >
            <div className="text-center mb-10 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 mb-2">
                    <Lightbulb className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-xs font-medium text-purple-300">Try Famous Ideas</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
                    See how unicorns would be validated
                </h3>
                <p className="text-gray-500 text-sm">
                    Click any idea below to run an instant validation
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {famousIdeas.map((example, idx) => (
                    <motion.button
                        key={example.name}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.9 + idx * 0.1 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onSelectIdea(example.idea)}
                        className={`group relative p-6 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all duration-300 text-left overflow-hidden`}
                    >
                        {/* Subtle gradient wash on hover */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${example.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                        <div className="relative z-10 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="w-10 h-10 flex items-center justify-start">
                                    <img
                                        src={example.logo}
                                        alt={`${example.name} logo`}
                                        className="w-8 h-8 opacity-80 group-hover:opacity-100 transition-opacity"
                                    />
                                </div>
                                <Zap className="w-4 h-4 text-gray-600 group-hover:text-yellow-400 transition-colors" />
                            </div>

                            <div>
                                <h4 className="font-semibold text-lg text-white mb-2">
                                    {example.name}
                                </h4>
                                <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">
                                    {example.idea}
                                </p>
                            </div>
                        </div>
                    </motion.button>
                ))}
            </div>
        </motion.div>
    );
}
