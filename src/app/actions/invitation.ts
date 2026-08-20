"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { generateUniqueSlug } from "@/lib/slug";
import { getTemplateMeta } from "@/data/templates";
import type { EventType } from "@/generated/prisma/enums";

export type CreateInvitationState = { error?: string };

/**
 * Yaratish formasi (/create/[templateId]) uchun server action.
 * Taklifnoma + birinchi tadbirni yaratadi va dashboard'ga yo'naltiradi.
 */
export async function createInvitation(
  _prevState: CreateInvitationState,
  formData: FormData,
): Promise<CreateInvitationState> {
  const templateCode = String(formData.get("templateCode") ?? "");
  const brideName = String(formData.get("brideName") ?? "").trim();
  const groomName = String(formData.get("groomName") ?? "").trim();
  const eventType = String(formData.get("eventType") ?? "TOY") as EventType;
  const greeting = String(formData.get("greeting") ?? "").trim();
  const cardNumber = String(formData.get("cardNumber") ?? "").trim();
  const cardHolder = String(formData.get("cardHolder") ?? "").trim();

  const eventTitle = String(formData.get("eventTitle") ?? "").trim();
  const eventDate = String(formData.get("eventDate") ?? "");
  const eventTime = String(formData.get("eventTime") ?? "");
  const locationName = String(formData.get("locationName") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();

  if (!getTemplateMeta(templateCode)) {
    return { error: "Bunday shablon topilmadi." };
  }

  if (!brideName || !groomName) {
    return { error: "Kelin va kuyov ismini kiriting." };
  }

  if (!eventDate || !eventTime || !locationName) {
    return { error: "Tadbir sanasi, vaqti va manzilini kiriting." };
  }

  const startsAt = new Date(`${eventDate}T${eventTime}`);
  if (Number.isNaN(startsAt.getTime())) {
    return { error: "Sana yoki vaqt noto'g'ri kiritilgan." };
  }

  const user = await requireUser();

  // Shablon DB'da bo'lmasa — katalogdan yaratamiz (seed o'rniga)
  const meta = getTemplateMeta(templateCode)!;
  const template = await prisma.template.upsert({
    where: { code: meta.code },
    update: {},
    create: { code: meta.code, name: meta.name, category: meta.category },
  });

  const slug = await generateUniqueSlug(`${brideName}-${groomName}`);

  const invitation = await prisma.invitation.create({
    data: {
      userId: user.id,
      templateId: template.id,
      slug,
      brideName,
      groomName,
      eventType,
      greeting: greeting || null,
      cardNumber: cardNumber || null,
      cardHolder: cardHolder || null,
      events: {
        create: {
          title: eventTitle || "To'y marosimi",
          startsAt,
          locationName,
          address: address || null,
          order: 0,
        },
      },
    },
  });

  revalidatePath("/my-invitations");
  redirect(`/dashboard/${invitation.id}`);
}
