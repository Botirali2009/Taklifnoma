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
    <div className="flex justify-center gap-3 sm:gap-6">
      {LABELS.map(([key, label]) => (
        <div key={key} className="min-w-16 text-center">
          <p className="font-serif text-3xl tabular-nums">{parts[key]}</p>
          <p className="mt-1 text-xs uppercase tracking-wider opacity-70">{label}</p>
        </div>
      ))}
    </div>
  );
}
