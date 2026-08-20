"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import type { TemplateCategory } from "@/generated/prisma/enums";

export type AdminResult = { ok: true } | { ok: false; error: string };

/** Admin: istalgan taklifnomani o'chirish */
export async function adminDeleteInvitation(
  invitationId: string,
): Promise<AdminResult> {
  await requireAdmin();

  const invitation = await prisma.invitation.findUnique({
    where: { id: invitationId },
    select: { id: true },
  });

  if (!invitation) return { ok: false, error: "Taklifnoma topilmadi." };

  await prisma.invitation.delete({ where: { id: invitation.id } });

  revalidatePath("/admin/invitations");
  return { ok: true };
}

export type TemplateInput = {
  id?: string;
  code: string;
  name: string;
  category: TemplateCategory;
  previewUrl?: string;
  isActive: boolean;
};

/** Admin: shablon qo'shish yoki tahrirlash */
export async function saveTemplate(input: TemplateInput): Promise<AdminResult> {
  await requireAdmin();

  const code = input.code?.trim().toLowerCase();
  const name = input.name?.trim();

  if (!code || !name) return { ok: false, error: "Kod va nomni kiriting." };
  if (!/^[a-z0-9-]+$/.test(code)) {
    return { ok: false, error: "Kod faqat lotin harflari, raqam va '-' dan iborat bo'lsin." };
  }

  const data = {
    code,
    name,
    category: input.category,
    previewUrl: input.previewUrl?.trim() || null,
    isActive: input.isActive,
  };

  const duplicate = await prisma.template.findUnique({ where: { code } });
  if (duplicate && duplicate.id !== input.id) {
    return { ok: false, error: "Bu kod bilan shablon allaqachon bor." };
  }

  if (input.id) {
    await prisma.template.update({ where: { id: input.id }, data });
  } else {
    await prisma.template.create({ data });
  }

  revalidatePath("/admin/templates");
  revalidatePath("/templates");
  return { ok: true };
}

/** Admin: shablonni o'chirish (ishlatilayotgan bo'lsa taqiqlanadi) */
export async function deleteTemplate(templateId: string): Promise<AdminResult> {
  await requireAdmin();

  const used = await prisma.invitation.count({ where: { templateId } });
  if (used > 0) {
    return {
      ok: false,
      error: `Bu shablon ${used} ta taklifnomada ishlatilmoqda — o'chirib bo'lmaydi. Uni "faol emas" qiling.`,
    };
  }

  await prisma.template.delete({ where: { id: templateId } });

  revalidatePath("/admin/templates");
  revalidatePath("/templates");
  return { ok: true };
}
