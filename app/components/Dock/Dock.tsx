"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import Link from "next/link";
import { Home, Info, Scale, ExternalLink } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Dock() {
    const pathname = usePathname();

    const dockItems = [
        { label: "Validator", icon: Home, href: "/" },
        { label: "About", icon: Info, href: "/about" },
        { label: "Legal", icon: Scale, href: "/legal" },
    ];

    return (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.3, duration: 0.8 }}
                className={clsx(
                    "flex items-center gap-2 p-2 rounded-full border border-white/40 shadow-xl",
                    "bg-mac-glass backdrop-blur-3xl saturate-150 transition-all duration-300",
                    "hover:scale-105 hover:shadow-2xl hover:border-white/60"
                )}
                style={{
                    background: "rgba(255, 255, 255, 0.65)",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)"
                }}
            >
                {dockItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link key={item.href} href={item.href}>
                            <div className="relative group px-4 py-2.5 rounded-full flex items-center gap-2 cursor-pointer transition-all duration-300">

                                {/* Active Pill Background */}
                                {isActive && (
                                    <motion.div
                                        layoutId="dock-pill"
                                        className="absolute inset-0 bg-white shadow-sm rounded-full border border-black/5"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}

                                {/* Hover Effect */}
                                {!isActive && (
                                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/40 rounded-full transition-colors duration-200" />
                                )}

                                <span className={clsx("relative z-10 flex items-center gap-2", isActive ? "text-black font-semibold" : "text-gray-500 group-hover:text-black")}>
                                    <Icon className={clsx("w-4 h-4", isActive && "text-blue-600")} />
                                    <span className="text-sm tracking-tight">{item.label}</span>
                                </span>
                            </div>
                        </Link>
                    );
                })}

                {/* Separator */}
                <div className="w-px h-6 bg-black/10 mx-1" />

                <a
                    href="#"
                    className="relative px-3 py-2 rounded-full text-gray-500 hover:text-black hover:bg-white/40 transition-all flex items-center gap-2"
                >
                    <span className="text-xs font-medium">GITHUB</span>
                    <ExternalLink className="w-3 h-3" />
                </a>

            </motion.div>
        </div>
    );
}
