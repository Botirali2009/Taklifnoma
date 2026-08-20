import { prisma } from "@/lib/prisma";
import type { UserModel } from "@/generated/prisma/models";

/**
 * TODO: NextAuth (Telegram login) ulanganda shu funksiya sessiyadan
 * foydalanuvchini oladi. Hozircha skelet uchun demo foydalanuvchi
 * qaytariladi, shunda yaratish/dashboard oqimini sinab ko'rish mumkin.
 */
const DEMO_PHONE = "+998900000000";

export async function getCurrentUser(): Promise<UserModel> {
  return prisma.user.upsert({
    where: { phone: DEMO_PHONE },
    update: {},
    create: { phone: DEMO_PHONE, name: "Demo foydalanuvchi" },
  });
}
