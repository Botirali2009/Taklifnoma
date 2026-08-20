"use server";

import { revalidatePath } from "next/cache";
import { getTemplateMeta } from "@/data/templates";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { generateUniqueSlug } from "@/lib/slug";
import type { EventType } from "@/generated/prisma/enums";

export type CreateInvitationInput = {
  templateCode: string;
  brideName: string;
  groomName: string;
  eventType: EventType;
  greeting?: string;
  cardNumber?: string;
  cardHolder?: string;
  musicUrl?: string;
  photoUrls?: string[];
  events: Array<{
    title: string;
    date: string; // YYYY-MM-DD
    time: string; // HH:mm
    locationName: string;
    address?: string;
    lat?: number | null;
    lng?: number | null;
  }>;
};

export type CreateInvitationResult =
  | { ok: true; invitationId: string; slug: string }
  | { ok: false; error: string };

/** Wizard formasi yuborganda chaqiriladi */
export async function createInvitation(
  input: CreateInvitationInput,
): Promise<CreateInvitationResult> {
  const user = await requireUser();

  const meta = getTemplateMeta(input.templateCode);
  if (!meta) return { ok: false, error: "Bunday shablon topilmadi." };

  const brideName = input.brideName?.trim();
  const groomName = input.groomName?.trim();
  if (!brideName || !groomName) {
    return { ok: false, error: "Kelin va kuyov ismini kiriting." };
  }

  if (!input.events?.length) {
    return { ok: false, error: "Kamida bitta tadbir qo'shing." };
  }

  const events = [];
  for (let index = 0; index < input.events.length; index++) {
    const event = input.events[index];
    const locationName = event.locationName?.trim();
    if (!event.date || !event.time || !locationName) {
      return { ok: false, error: "Tadbir sanasi, vaqti va manzilini kiriting." };
    }

    const startsAt = new Date(`${event.date}T${event.time}`);
    if (Number.isNaN(startsAt.getTime())) {
      return { ok: false, error: "Sana yoki vaqt noto'g'ri kiritilgan." };
    }

    events.push({
      title: event.title?.trim() || "To'y marosimi",
      startsAt,
      locationName,
      address: event.address?.trim() || null,
      lat: event.lat ?? null,
      lng: event.lng ?? null,
      order: index,
    });
  }

  // Shablon bazada bo'lmasa katalogdan yaratamiz (seed o'rniga)
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
      eventType: input.eventType,
      greeting: input.greeting?.trim() || null,
      cardNumber: input.cardNumber?.trim() || null,
      cardHolder: input.cardHolder?.trim() || null,
      musicUrl: input.musicUrl || null,
      events: { create: events },
      photos: {
        create: (input.photoUrls ?? []).map((url, order) => ({ url, order })),
      },
    },
  });

  revalidatePath("/my-invitations");
  return { ok: true, invitationId: invitation.id, slug: invitation.slug };
}
