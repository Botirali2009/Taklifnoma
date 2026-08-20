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

export type UpdateInvitationInput = {
  invitationId: string;
  brideName: string;
  groomName: string;
  eventType: EventType;
  greeting?: string;
  cardNumber?: string;
  cardHolder?: string;
  events: Array<{
    id?: string;
    title: string;
    date: string;
    time: string;
    locationName: string;
    address?: string;
    lat?: number | null;
    lng?: number | null;
  }>;
};

export type ActionResult = { ok: true } | { ok: false; error: string };

/** Taklifnoma egasini tekshiradi */
async function ownedInvitation(invitationId: string) {
  const user = await requireUser();

  const invitation = await prisma.invitation.findFirst({
    where: { id: invitationId, userId: user.id },
    select: { id: true, slug: true },
  });

  return invitation;
}

/** Sozlamalar sahifasidagi tahrirlash formasi */
export async function updateInvitation(
  input: UpdateInvitationInput,
): Promise<ActionResult> {
  const invitation = await ownedInvitation(input.invitationId);
  if (!invitation) return { ok: false, error: "Taklifnoma topilmadi." };

  const brideName = input.brideName?.trim();
  const groomName = input.groomName?.trim();
  if (!brideName || !groomName) {
    return { ok: false, error: "Kelin va kuyov ismini kiriting." };
  }

  if (!input.events?.length) {
    return { ok: false, error: "Kamida bitta tadbir bo'lishi kerak." };
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
      id: event.id,
      title: event.title?.trim() || "To'y marosimi",
      startsAt,
      locationName,
      address: event.address?.trim() || null,
      lat: event.lat ?? null,
      lng: event.lng ?? null,
      order: index,
    });
  }

  const keptIds = events.map((event) => event.id).filter(Boolean) as string[];

  await prisma.$transaction([
    prisma.invitation.update({
      where: { id: invitation.id },
      data: {
        brideName,
        groomName,
        eventType: input.eventType,
        greeting: input.greeting?.trim() || null,
        cardNumber: input.cardNumber?.trim() || null,
        cardHolder: input.cardHolder?.trim() || null,
      },
    }),
    // Formadan olib tashlangan tadbirlarni o'chiramiz
    prisma.event.deleteMany({
      where: { invitationId: invitation.id, id: { notIn: keptIds } },
    }),
    ...events.map((event) =>
      event.id
        ? prisma.event.update({
            where: { id: event.id },
            data: { ...event, id: undefined },
          })
        : prisma.event.create({
            data: { ...event, id: undefined, invitationId: invitation.id },
          }),
    ),
  ]);

  revalidatePath(`/i/${invitation.slug}`);
  revalidatePath(`/dashboard/${invitation.id}`);
  revalidatePath("/my-invitations");
  return { ok: true };
}

/** Taklifnomani o'chirish (mehmonlar, suratlar, tilaklar ham o'chadi) */
export async function deleteInvitation(
  invitationId: string,
): Promise<ActionResult> {
  const invitation = await ownedInvitation(invitationId);
  if (!invitation) return { ok: false, error: "Taklifnoma topilmadi." };

  await prisma.invitation.delete({ where: { id: invitation.id } });

  revalidatePath("/my-invitations");
  return { ok: true };
}

/** Sozlamalarda yangi surat qo'shish */
export async function addPhoto(
  invitationId: string,
  url: string,
): Promise<ActionResult> {
  const invitation = await ownedInvitation(invitationId);
  if (!invitation) return { ok: false, error: "Taklifnoma topilmadi." };

  const count = await prisma.photo.count({
    where: { invitationId: invitation.id },
  });

  await prisma.photo.create({
    data: { invitationId: invitation.id, url, order: count },
  });

  revalidatePath(`/i/${invitation.slug}`);
  revalidatePath(`/dashboard/${invitation.id}/settings`);
  return { ok: true };
}

/** Suratni o'chirish */
export async function removePhoto(photoId: string): Promise<ActionResult> {
  const user = await requireUser();

  const photo = await prisma.photo.findFirst({
    where: { id: photoId, invitation: { userId: user.id } },
    select: { id: true, invitationId: true, invitation: { select: { slug: true } } },
  });

  if (!photo) return { ok: false, error: "Surat topilmadi." };

  await prisma.photo.delete({ where: { id: photo.id } });

  revalidatePath(`/i/${photo.invitation.slug}`);
  revalidatePath(`/dashboard/${photo.invitationId}/settings`);
  return { ok: true };
}

/** Fon musiqasini almashtirish yoki o'chirish */
export async function setMusic(
  invitationId: string,
  musicUrl: string | null,
): Promise<ActionResult> {
  const invitation = await ownedInvitation(invitationId);
  if (!invitation) return { ok: false, error: "Taklifnoma topilmadi." };

  await prisma.invitation.update({
    where: { id: invitation.id },
    data: { musicUrl },
  });

  revalidatePath(`/i/${invitation.slug}`);
  revalidatePath(`/dashboard/${invitation.id}/settings`);
  return { ok: true };
}
