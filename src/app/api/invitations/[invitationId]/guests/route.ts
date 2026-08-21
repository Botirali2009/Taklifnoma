import { NextResponse } from "next/server";
import {
  GUEST_SIDE_LABELS,
  RSVP_STATUS_LABELS,
  formatDateTime,
} from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** CSV katagi: qo'shtirnoq va vergul xavfsiz bo'lsin */
function cell(value: string | number | null | undefined): string {
  const text = value === null || value === undefined ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

/** Mehmonlar ro'yxatini CSV qilib beradi (Excel uchun BOM bilan) */
export async function GET(
  _request: Request,
  { params }: { params: { invitationId: string } },
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Avval tizimga kiring." }, { status: 401 });
  }

  const invitation = await prisma.invitation.findFirst({
    where: {
      id: params.invitationId,
      ...(user.role === "ADMIN" ? {} : { userId: user.id }),
    },
    select: { slug: true },
  });

  if (!invitation) {
    return NextResponse.json({ error: "Taklifnoma topilmadi." }, { status: 404 });
  }

  const guests = await prisma.guest.findMany({
    where: { invitation: { slug: invitation.slug } },
    orderBy: { createdAt: "desc" },
  });

  const header = [
    "Ism",
    "Tomon",
    "Guruh",
    "Javob",
    "Kishi soni",
    "Telefon",
    "Izoh",
    "Javob vaqti",
  ];

  const rows = guests.map((guest) =>
    [
      cell(guest.name),
      cell(GUEST_SIDE_LABELS[guest.side]),
      cell(guest.groupName),
      cell(RSVP_STATUS_LABELS[guest.rsvpStatus]),
      cell(guest.guestCount),
      cell(guest.phone),
      cell(guest.note),
      cell(guest.respondedAt ? formatDateTime(guest.respondedAt) : ""),
    ].join(","),
  );

  const csv = [header.map(cell).join(","), ...rows].join("\r\n");

  return new NextResponse("﻿" + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="mehmonlar-${invitation.slug}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
