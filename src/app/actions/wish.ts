"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

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
