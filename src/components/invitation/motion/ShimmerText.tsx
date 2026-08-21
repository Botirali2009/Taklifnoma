"use client";

import { useReducedMotion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** Oltin tovlanish ranglari */
  from: string;
  via: string;
  to: string;
  style?: CSSProperties;
};

/**
 * Matn ustidan sekin o'tadigan yorug'lik — metall (oltin) taassuroti.
 * Animatsiya globals.css dagi @keyframes shimmer bilan ishlaydi.
 */
export function ShimmerText({
  children,
  className = "",
  from,
  via,
  to,
  style,
}: Props) {
  const reduced = useReducedMotion();

  return (
    <span
      className={`${className} ${reduced ? "" : "animate-shimmer"}`}
      style={{
        ...style,
        backgroundImage: `linear-gradient(100deg, ${from} 0%, ${via} 20%, ${to} 40%, ${via} 60%, ${from} 100%)`,
        backgroundSize: "300% 100%",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
      }}
    >
      {children}
    </span>
  );
}
