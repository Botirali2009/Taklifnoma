import type { TemplateCategory } from "@/generated/prisma/enums";

export type TemplateMeta = {
  /** Template.code — DB yozuvi bilan bog'laydi */
  code: string;
  name: string;
  description: string;
  category: TemplateCategory;
  /** Sahifadagi rang sxemasi (preview kartochkasi uchun) */
  accent: string;
};

/**
 * Shablonlar katalogi. Har bir code uchun
 * src/components/templates ichida React komponenti bo'lishi kerak.
 */
export const TEMPLATES: TemplateMeta[] = [
  {
    code: "classic",
    name: "Klassik",
    description: "Oq fon, oltin bezaklar, an'anaviy va bexato tanlov.",
    category: "MILLIY",
    accent: "#b98a3f",
  },
  // TODO: keyingi shablonlar (zamonaviy, lux, minimalist) shu yerga qo'shiladi
];

export function getTemplateMeta(code: string): TemplateMeta | undefined {
  return TEMPLATES.find((template) => template.code === code);
}
