import type { TemplateCategory } from "@/generated/prisma/enums";

export type TemplateMeta = {
  /** Template.code — DB yozuvi va React komponentini bog'laydi */
  code: string;
  name: string;
  description: string;
  category: TemplateCategory;
  /** Katalog kartochkasidagi rang sxemasi */
  preview: {
    bg: string;
    ink: string;
    accent: string;
    /** Sarlavha shrifti (katalogda ham bir xil ko'rinsin) */
    font: string;
  };
};

/**
 * Shablonlar katalogi. Har bir code uchun
 * src/components/templates ichida komponent bo'lishi shart.
 */
export const TEMPLATES: TemplateMeta[] = [
  {
    code: "classic",
    name: "Klassik",
    description:
      "Fil suyagi rangidagi qog'oz, oltin ramka va bezaklar. An'anaviy, bexato tanlov.",
    category: "MILLIY",
    preview: {
      bg: "#fdfbf7",
      ink: "#3a3128",
      accent: "#a9762c",
      font: '"Cormorant Garamond", Georgia, serif',
    },
  },
  {
    code: "modern",
    name: "Zamonaviy",
    description:
      "Oq fon, yirik sarlavha va keng bo'shliq. Bezaksiz, toza va shahar uslubida.",
    category: "MINIMALIST",
    preview: {
      bg: "#ffffff",
      ink: "#17171a",
      accent: "#17171a",
      font: '"Manrope", system-ui, sans-serif',
    },
  },
  {
    code: "milliy",
    name: "Milliy",
    description:
      "Zumrad va oltin, naqshli lentalar, ravoq shaklidagi suratlar — milliy ruhda.",
    category: "MILLIY",
    preview: {
      bg: "#f6f3ea",
      ink: "#1f3b31",
      accent: "#0f5c46",
      font: '"Marcellus", Georgia, serif',
    },
  },
  {
    code: "lux",
    name: "Lux",
    description:
      "To'q tun fonida shampan oltini, keng harf oralig'i. Kechki tantana uchun.",
    category: "LUX",
    preview: {
      bg: "#121110",
      ink: "#f2ece2",
      accent: "#c9a227",
      font: '"Playfair Display", Georgia, serif',
    },
  },
];

export function getTemplateMeta(code: string): TemplateMeta | undefined {
  return TEMPLATES.find((template) => template.code === code);
}
