"use client";

import { useEffect, useState } from "react";

type Parts = { days: number; hours: number; minutes: number; seconds: number };

function diff(targetTime: number): Parts | null {
  const ms = targetTime - Date.now();
  if (ms <= 0) return null;

  return {
    days: Math.floor(ms / 86400000),
    hours: Math.floor((ms / 3600000) % 24),
    minutes: Math.floor((ms / 60000) % 60),
    seconds: Math.floor((ms / 1000) % 60),
  };
}

const LABELS: Array<[keyof Parts, string]> = [
  ["days", "kun"],
  ["hours", "soat"],
  ["minutes", "daqiqa"],
  ["seconds", "soniya"],
];

/** Tadbirgacha qolgan vaqt */
export function Countdown({ target }: { target: string | Date }) {
  // Raqamga aylantiramiz — har renderda yangi Date obyekti effektni qayta ishga tushirmasin
  const targetTime =
    typeof target === "string" ? Date.parse(target) : target.getTime();
  const [parts, setParts] = useState<Parts | null>(null);

  useEffect(() => {
    setParts(diff(targetTime));
    const timer = setInterval(() => setParts(diff(targetTime)), 1000);
    return () => clearInterval(timer);
  }, [targetTime]);

  if (!parts) return null;

  return (
    <div className="flex justify-center gap-4 sm:gap-7">
      {LABELS.map(([key, label]) => (
        <div key={key} className="min-w-14 text-center">
          <p
            className="text-3xl tabular-nums sm:text-4xl"
            style={{ fontFamily: "var(--tpl-display)", color: "var(--tpl-accent)" }}
          >
            {String(parts[key]).padStart(2, "0")}
          </p>
          <p
            className="mt-1.5 text-[10px] uppercase tracking-[0.2em]"
            style={{ color: "var(--tpl-soft)" }}
          >
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}
