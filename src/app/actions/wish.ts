"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

export type WishState = { error?: string; success?: boolean };

/** Mehmon tilagi (public taklifnoma sahifasidagi forma) */
export async function submitWish(
  _prevState: WishState,
  formData: FormData,
): Promise<WishState> {
  const slug = String(formData.get("slug") ?? "");
  const authorName = String(formData.get("authorName") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!authorName || !message) {
    return { error: "Ism va tilak matnini kiriting." };
  }

  if (message.length > 500) {
    return { error: "Tilak juda uzun (maksimum 500 belgi)." };
  }

  const invitation = await prisma.invitation.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (!invitation) {
    return { error: "Taklifnoma topilmadi." };
  }

  await prisma.wish.create({
    data: { invitationId: invitation.id, authorName, message },
  });

  revalidatePath(`/i/${slug}`);
  return { success: true };
}

export type WishActionResult = { ok: true } | { ok: false; error: string };

/** Egasi tilakni yashiradi yoki qayta ko'rsatadi */
export async function toggleWishVisibility(
  wishId: string,
): Promise<WishActionResult> {
  const user = await requireUser();

  const wish = await prisma.wish.findFirst({
    where: { id: wishId, invitation: { userId: user.id } },
    select: {
      id: true,
      isVisible: true,
      invitationId: true,
      invitation: { select: { slug: true } },
    },
  });

  if (!wish) return { ok: false, error: "Tilak topilmadi." };

  await prisma.wish.update({
    where: { id: wish.id },
    data: { isVisible: !wish.isVisible },
  });

  revalidatePath(`/i/${wish.invitation.slug}`);
  revalidatePath(`/dashboard/${wish.invitationId}`);
  return { ok: true };
}

/** Tilakni butunlay o'chirish */
export async function deleteWish(wishId: string): Promise<WishActionResult> {
  const user = await requireUser();

  const wish = await prisma.wish.findFirst({
    where: { id: wishId, invitation: { userId: user.id } },
    select: { id: true, invitationId: true, invitation: { select: { slug: true } } },
  });

  if (!wish) return { ok: false, error: "Tilak topilmadi." };

  await prisma.wish.delete({ where: { id: wish.id } });

  revalidatePath(`/i/${wish.invitation.slug}`);
  revalidatePath(`/dashboard/${wish.invitationId}`);
  return { ok: true };
}
