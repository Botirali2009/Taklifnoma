"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { GuestSide, RsvpStatus } from "@/generated/prisma/enums";

export type RsvpState = { error?: string; success?: boolean };

/** Mehmon javobi (/i/[slug]/rsvp) — Guest yozuvini yaratadi */
export async function submitRsvp(
  _prevState: RsvpState,
  formData: FormData,
): Promise<RsvpState> {
  const slug = String(formData.get("slug") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const side = String(formData.get("side") ?? "UMUMIY") as GuestSide;
  const rsvpStatus = String(formData.get("rsvpStatus") ?? "") as RsvpStatus;
  const guestCount = Number(formData.get("guestCount") ?? 1);
  const note = String(formData.get("note") ?? "").trim();

  if (!name) {
    return { error: "Ismingizni kiriting." };
  }

  if (rsvpStatus !== "KELADI" && rsvpStatus !== "KELMAYDI") {
    return { error: "Javobni tanlang." };
  }

  const invitation = await prisma.invitation.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (!invitation) {
    return { error: "Taklifnoma topilmadi." };
  }

  await prisma.guest.create({
    data: {
      invitationId: invitation.id,
      name,
      phone: phone || null,
      side,
      rsvpStatus,
      guestCount:
        rsvpStatus === "KELADI" && Number.isFinite(guestCount)
          ? Math.min(Math.max(Math.trunc(guestCount), 1), 20)
          : 0,
      note: note || null,
      respondedAt: new Date(),
    },
  });

  revalidatePath(`/dashboard/${invitation.id}`);
  return { success: true };
}
