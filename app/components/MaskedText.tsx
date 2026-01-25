"use client";

import { motion } from "framer-motion";
import clsx from "clsx";

export default function MaskedText({ text, delay = 0, className = "" }: { text: string, delay?: number, className?: string }) {
    return (
        <span className={clsx("masked-text-container block overflow-hidden", className)}>
            <motion.span
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
                className="block"
            >
                {text}
            </motion.span>
        </span>
    );
}
