import { customAlphabet } from "nanoid";
import { prisma } from "@/lib/prisma";

/** Chalkashmaydigan alifbo: 0/O va 1/l/I olib tashlangan */
const ALPHABET = "23456789abcdefghijkmnpqrstuvwxyz";
const DEFAULT_LENGTH = 8;
const MAX_ATTEMPTS = 10;

const nanoid = customAlphabet(ALPHABET, DEFAULT_LENGTH);

/** Ismni URL uchun xavfsiz ko'rinishga keltiradi: "Aziz & Malika" -> "aziz-malika" */
export function slugify(input: string): string {
  const translit: Record<string, string> = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "j",
    з: "z", и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o",
    п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "s",
    ч: "ch", ш: "sh", щ: "sh", ъ: "", ы: "i", ь: "", э: "e", ю: "yu",
    я: "ya", ў: "o", қ: "q", ғ: "g", ҳ: "h",
  };

  return input
    .toLowerCase()
    .replace(/[Ѐ-ӿ]/g, (char) => translit[char] ?? "")
    .replace(/['`’ʻʼ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

/**
 * Unikal slug yaratadi: "aziz-malika-k7m2xq9p".
 * Bazada bor-yo'qligini tekshiradi, to'qnashuv bo'lsa qaytadan urinadi.
 */
export async function generateUniqueSlug(base?: string): Promise<string> {
  const prefix = base ? slugify(base) : "";

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const candidate = prefix ? `${prefix}-${nanoid()}` : nanoid();

    const existing = await prisma.invitation.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });

    if (!existing) return candidate;
  }

  throw new Error(
    `Unikal slug yaratib bo'lmadi (${MAX_ATTEMPTS} marta urinildi)`,
  );
}
