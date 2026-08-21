"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** Tebranish kuchi (daraja) */
  amount?: number;
  duration?: number;
  delay?: number;
};

/** Bezaklarning sekin, tinch tebranishi — "jonli" tuyg'u beradi */
export function Sway({
  children,
  className = "",
  amount = 1.6,
  duration = 9,
  delay = 0,
}: Props) {
  const reduced = useReducedMotion();

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ rotate: -amount / 2, y: 0 }}
      animate={{ rotate: [-amount / 2, amount / 2, -amount / 2], y: [0, -6, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
      style={{ originX: 0.5, originY: 0.5 }}
    >
      {children}
    </motion.div>
  );
}
