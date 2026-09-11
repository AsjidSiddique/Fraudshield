"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Lightweight scroll-triggered fade/slide-in wrapper. Animates once per element the first time
 * it enters the viewport, then leaves it alone — respects `prefers-reduced-motion` automatically
 * via framer-motion's built-in handling.
 */
export function FadeIn({
  children,
  delay = 0,
  duration = 0.55,
  y = 16,
  className,
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
