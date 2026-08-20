"use client";

import { useState } from "react";

type Props = {
  value: string;
  label?: string;
  className?: string;
};

export function CopyButton({ value, label = "Nusxalash", className = "" }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API mavjud bo'lmasa (eski brauzer) — jim o'tamiz
    }
  }

  return (
    <button type="button" onClick={handleCopy} className={className}>
      {copied ? "Nusxalandi ✓" : label}
    </button>
  );
}
