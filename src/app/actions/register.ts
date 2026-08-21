"use server";

import { prisma } from "@/lib/prisma";
import {
  hashPassword,
  normalizeEmail,
  validatePassword,
} from "@/lib/password";

export type RegisterState = { error?: string; success?: boolean };

/** Yangi hisob yaratish (email + parol) */
export async function registerUser(
  _prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = normalizeEmail(String(formData.get("email") ?? ""));
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (!name) return { error: "Ismingizni kiriting." };
  if (!email) return { error: "Email manzil noto'g'ri kiritilgan." };

  const passwordError = validatePassword(password);
  if (passwordError) return { error: passwordError };

  if (password !== confirm) return { error: "Parollar mos kelmadi." };

  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true, passwordHash: true },
  });

  if (existing?.passwordHash) {
    return { error: "Bu email allaqachon ro'yxatdan o'tgan. Kirishga urinib ko'ring." };
  }

  const passwordHash = await hashPassword(password);

  if (existing) {
    // Google orqali kirgan hisobga parol qo'shiladi
    await prisma.user.update({
      where: { id: existing.id },
      data: { passwordHash, name },
    });
  } else {
    await prisma.user.create({ data: { email, name, passwordHash } });
  }

  return { success: true };
}
