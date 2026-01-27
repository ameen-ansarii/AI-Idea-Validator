"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import Link from "next/link";
import { Home, Info, Scale, ExternalLink, History as HistoryIcon, Menu, X, Github } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Dock() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const dockItems = [
        { label: "Validator", icon: Home, href: "/" },
        { label: "History", icon: HistoryIcon, href: "/history" },
        { label: "About", icon: Info, href: "/about" },
        { label: "Legal", icon: Scale, href: "/legal" },
    ];

    return (
        <>
            {/* Desktop Dock (Hidden on Mobile) */}
            <div className="hidden md:block fixed top-6 left-1/2 -translate-x-1/2 z-50">
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", bounce: 0.3, duration: 0.8 }}
                    className={clsx(
                        "flex items-center gap-1 p-1.5 rounded-full border border-white/10 shadow-lg",
                        "bg-[#0a0a0a]/80 backdrop-blur-md transition-all duration-300"
                    )}
                >
                    {dockItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link key={item.href} href={item.href}>
                                <div className="relative group px-4 py-2 rounded-full flex items-center gap-2 cursor-pointer transition-all duration-200">
                                    {isActive && (
                                        <motion.div
                                            layoutId="dock-pill"
                                            className="absolute inset-0 bg-white/10 rounded-full border border-white/5"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    {!isActive && (
                                        <div className="absolute inset-0 bg-transparent group-hover:bg-white/5 rounded-full transition-colors duration-200" />
                                    )}
                                    <span className={clsx("relative z-10 flex items-center gap-2", isActive ? "text-white font-medium" : "text-gray-400 group-hover:text-gray-200")}>
                                        <Icon className={clsx("w-4 h-4", isActive && "text-white")} />
                                        <span className="text-sm tracking-tight">{item.label}</span>
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                    <div className="w-px h-4 bg-white/10 mx-2" />
                    <a href="https://github.com" target="_blank" className="relative px-3 py-2 rounded-full text-gray-500 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2">
                        <span className="text-xs font-medium">GITHUB</span>
                        <ExternalLink className="w-3 h-3" />
                    </a>
                </motion.div>
            </div>

            {/* Mobile Hamburger (Visible on small screens) */}
            <div className="md:hidden fixed top-4 right-4 z-50">
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-3 rounded-full bg-black/50 border border-white/10 backdrop-blur-md text-white shadow-lg active:scale-95 transition-transform"
                >
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl flex flex-col p-6"
                    >
                        <div className="flex justify-end mb-8">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-3 rounded-full bg-white/10 text-white"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <nav className="flex flex-col gap-6 mt-10 px-4">
                            {dockItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={clsx(
                                        "text-3xl font-bold tracking-tight flex items-center gap-4",
                                        pathname === item.href ? "text-white" : "text-gray-500"
                                    )}
                                >
                                    <item.icon className="w-8 h-8" />
                                    {item.label}
                                </Link>
                            ))}

                            <div className="h-px bg-white/10 my-4" />

                            <a href="https://github.com" target="_blank" className="text-xl font-medium text-gray-500 flex items-center gap-4">
                                <Github className="w-6 h-6" />
                                GitHub
                            </a>
                        </nav>

                        <div className="mt-auto text-center text-gray-600 text-sm pb-8">
                            Idea Validator &copy; {new Date().getFullYear()}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
