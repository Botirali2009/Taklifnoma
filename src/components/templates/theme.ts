import type { CSSProperties } from "react";

/**
 * Shablon mavzusi — ranglar va shriftlar CSS o'zgaruvchilariga aylanadi,
 * umumiy bo'limlar (countdown, galereya, tilaklar) shularni o'qiydi.
 * Shu tufayli bo'limlar bir marta yoziladi, shablonlar esa faqat
 * mavzu va bezaklari bilan farq qiladi.
 */
export type TemplateTheme = {
  /** Sahifa foni */
  bg: string;
  /** Karta/blok foni */
  surface: string;
  /** Asosiy matn */
  ink: string;
  /** Ikkilamchi matn */
  soft: string;
  /** Urg'u rangi (chiziqlar, sanalar, tugmalar) */
  accent: string;
  /** Urg'uning yumshoq varianti (fon sifatida) */
  accentSoft: string;
  /** Chegara chiziqlari */
  line: string;
  /** Urg'u ustidagi matn rangi */
  onAccent: string;
  /** Sarlavha shrifti */
  displayFont: string;
  /** Matn shrifti */
  bodyFont: string;
  /** Burchak radiusi */
  radius: string;
};

export function themeStyle(theme: TemplateTheme): CSSProperties {
  return {
    "--tpl-bg": theme.bg,
    "--tpl-surface": theme.surface,
    "--tpl-ink": theme.ink,
    "--tpl-soft": theme.soft,
    "--tpl-accent": theme.accent,
    "--tpl-accent-soft": theme.accentSoft,
    "--tpl-line": theme.line,
    "--tpl-on-accent": theme.onAccent,
    "--tpl-display": theme.displayFont,
    "--tpl-body": theme.bodyFont,
    "--tpl-radius": theme.radius,
    backgroundColor: theme.bg,
    color: theme.ink,
    fontFamily: theme.bodyFont,
  } as CSSProperties;
}

const SERIF_FALLBACK = "Georgia, 'Times New Roman', serif";
const SANS_FALLBACK = "system-ui, -apple-system, 'Segoe UI', sans-serif";

/** Klassik — fil suyagi va oltin, an'anaviy */
export const CLASSIC_THEME: TemplateTheme = {
  bg: "#fdfbf7",
  surface: "#ffffff",
  ink: "#3a3128",
  soft: "#6f6555",
  accent: "#a9762c",
  accentSoft: "#f4e8d4",
  line: "#e7dcc6",
  onAccent: "#ffffff",
  displayFont: `"Cormorant Garamond", ${SERIF_FALLBACK}`,
  bodyFont: `"Manrope", ${SANS_FALLBACK}`,
  radius: "1rem",
};

/** Zamonaviy — oq, keng bo'shliq, minimal */
export const MODERN_THEME: TemplateTheme = {
  bg: "#ffffff",
  surface: "#f7f7f5",
  ink: "#17171a",
  soft: "#6b6b70",
  accent: "#17171a",
  accentSoft: "#ededea",
  line: "#e4e4e0",
  onAccent: "#ffffff",
  displayFont: `"Manrope", ${SANS_FALLBACK}`,
  bodyFont: `"Manrope", ${SANS_FALLBACK}`,
  radius: "0.25rem",
};

/** Milliy — zumrad va oltin, naqshli */
export const MILLIY_THEME: TemplateTheme = {
  bg: "#f6f3ea",
  surface: "#fffdf7",
  ink: "#1f3b31",
  soft: "#55695f",
  accent: "#0f5c46",
  accentSoft: "#dfe9e2",
  line: "#cfdbd3",
  onAccent: "#fdf6e3",
  displayFont: `"Marcellus", ${SERIF_FALLBACK}`,
  bodyFont: `"Manrope", ${SANS_FALLBACK}`,
  radius: "0.75rem",
};

/** Lux — to'q tun va shampan oltini */
export const LUX_THEME: TemplateTheme = {
  bg: "#121110",
  surface: "#1c1a18",
  ink: "#f2ece2",
  soft: "#a89f92",
  accent: "#c9a227",
  accentSoft: "#2a2620",
  line: "#332f29",
  onAccent: "#141210",
  displayFont: `"Playfair Display", ${SERIF_FALLBACK}`,
  bodyFont: `"Manrope", ${SANS_FALLBACK}`,
  radius: "0.5rem",
};
