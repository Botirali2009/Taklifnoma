"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

type Props = {
  /** Gulbarg rangi */
  color: string;
  /** Nechta gulbarg tushsin */
  count?: number;
  /** Shaffoflik */
  opacity?: number;
};

type Petal = {
  left: number;
  size: number;
  delay: number;
  duration: number;
  drift: number;
  spin: number;
};

/** Ekran bo'ylab sekin tushib turadigan gulbarglar */
export function FallingPetals({ color, count = 14, opacity = 0.5 }: Props) {
  const reduced = useReducedMotion();

  const petals = useMemo<Petal[]>(() => {
    // Har safar bir xil bo'lishi uchun oddiy determinated tasodif
    let seed = 42;
    const random = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };

    return Array.from({ length: count }, () => ({
      left: random() * 100,
      size: 10 + random() * 16,
      delay: random() * 12,
      duration: 14 + random() * 12,
      drift: (random() - 0.5) * 120,
      spin: 180 + random() * 360,
    }));
  }, [count]);

  if (reduced) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-10 overflow-hidden"
      aria-hidden
    >
      {petals.map((petal, index) => (
        <motion.svg
          key={index}
          viewBox="0 0 20 28"
          style={{
            position: "absolute",
            left: `${petal.left}%`,
            width: petal.size,
            height: petal.size * 1.4,
            color,
            opacity,
          }}
          initial={{ y: "-15vh", x: 0, rotate: 0 }}
          animate={{
            y: "115vh",
            x: [0, petal.drift * 0.6, petal.drift],
            rotate: petal.spin,
          }}
          transition={{
            duration: petal.duration,
            delay: petal.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <path
            d="M10 0 C16 8, 20 16, 10 28 C0 16, 4 8, 10 0 Z"
            fill="currentColor"
          />
        </motion.svg>
      ))}
    </div>
  );
}
