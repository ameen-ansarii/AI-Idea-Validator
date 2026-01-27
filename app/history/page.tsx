"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trash2, Calendar, Award, ArrowRight } from "lucide-react";
import Dock from "../components/Dock/Dock";
import MaskedText from "../components/MaskedText";

export default function HistoryPage() {
    const [history, setHistory] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        try {
            const stored = JSON.parse(localStorage.getItem('idea_history') || '[]');
            setHistory(stored);
        } catch (e) {
            console.error(e);
        }
    }, []);

    const clearHistory = () => {
        if (confirm("Are you sure you want to delete all history?")) {
            localStorage.removeItem('idea_history');
            setHistory([]);
        }
    };

    const loadIdea = (id: string) => {
        router.push(`/?historyId=${id}`);
    };

    return (
        <main className="min-h-screen flex flex-col items-center p-6 pt-32 relative overflow-hidden font-sans selection:bg-purple-500/30">
            <Dock />
            {/* Background */}
            <div className="fixed inset-0 z-0 bg-aurora pointer-events-none" />

            <div className="max-w-4xl w-full z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white">
                            <MaskedText text="Validation" delay={0.1} />
                        </h1>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-gray-600">
                            <MaskedText text="Vault." delay={0.3} />
                        </h1>
                    </div>
                    {history.length > 0 && (
                        <button
                            onClick={clearHistory}
                            className="group px-5 py-2 rounded-full bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 transition-all text-sm font-medium text-gray-400 hover:text-red-400 flex items-center gap-2"
                        >
                            <Trash2 className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                            Clear Vault
                        </button>
                    )}
                </div>

                <div className="grid gap-4 pb-20">
                    {history.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-20 px-6 macos-card"
                        >
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Calendar className="w-8 h-8 text-gray-600" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">No Validations Yet</h3>
                            <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">Your validated ideas will be securely stored here for future reference.</p>
                            <Link href="/" className="px-8 py-3 rounded-full bg-white text-black font-medium hover:scale-105 transition-transform inline-flex items-center gap-2">
                                Start New Validation <ArrowRight className="w-4 h-4" />
                            </Link>
                        </motion.div>
                    ) : (
                        history.map((item, i) => (
                            <motion.div
                                key={item.id || i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                onClick={() => loadIdea(item.id)}
                                className="group relative macos-card p-6 md:p-8 hover:border-white/20 transition-all cursor-pointer flex flex-col md:flex-row justify-between gap-6"
                            >
                                <div className="space-y-3 flex-1">
                                    <div className="flex items-center gap-3 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                        <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {new Date(item.date).toLocaleDateString()}</span>
                                        {/* Dynamic Badge based on Score */}
                                        {item.report.confidenceScore === 'High' && (
                                            <span className="bg-green-500/10 text-green-400 px-2 py-0.5 rounded text-[10px] tracking-wide flex items-center gap-1 border border-green-500/20">
                                                <Award className="w-3 h-3" /> GEM
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-2xl font-bold text-white line-clamp-1 group-hover:text-blue-400 transition-colors">{item.idea}</h3>
                                    <p className="text-sm text-gray-400 line-clamp-2 max-w-2xl leading-relaxed">{item.report.summary}</p>
                                </div>
                                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 min-w-[120px] pl-0 md:pl-6 md:border-l border-white/5">
                                    <div className="flex flex-col items-end">
                                        <div className="text-3xl font-black text-white/20 group-hover:text-white transition-colors tracking-tight">
                                            {item.report.confidenceScore === 'High' ? '92' : item.report.confidenceScore === 'Medium' ? '65' : '30'}<span className="text-lg text-white/10">%</span>
                                        </div>
                                        <span className="text-[10px] uppercase font-bold text-white/20 tracking-wider">Confidence</span>
                                    </div>

                                    <div className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border ${item.report.verdict === 'Build Now' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                        item.report.verdict === 'Not Worth Pursuing' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                            'bg-orange-500/10 text-orange-400 border-orange-500/20'
                                        }`}>
                                        {item.report.verdict}
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </main>
    );
}
