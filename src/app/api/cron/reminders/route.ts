import { Bot } from "grammy";
import { NextResponse } from "next/server";
import { formatDate, formatTime } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { appUrl } from "@/lib/url";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Tadbirdan ~1 kun oldin "keladi" degan mehmonlarga Telegram eslatmasi.
 *
 * Vercel Cron kuniga bir marta chaqiradi (vercel.json).
 * Himoya: Authorization: Bearer <CRON_SECRET>.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const header = request.headers.get("authorization");
    if (header !== `Bearer ${secret}`) {
      return new NextResponse("Forbidden", { status: 403 });
    }
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "TELEGRAM_BOT_TOKEN sozlanmagan." },
      { status: 503 },
    );
  }

  // 24-48 soat oralig'ida boshlanadigan tadbirlar
  const from = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const to = new Date(Date.now() + 48 * 60 * 60 * 1000);

  const events = await prisma.event.findMany({
    where: { startsAt: { gte: from, lt: to } },
    include: {
      invitation: {
        select: { id: true, slug: true, brideName: true, groomName: true },
      },
    },
  });

  const bot = new Bot(token, {
    client: process.env.TELEGRAM_API_ROOT
      ? { apiRoot: process.env.TELEGRAM_API_ROOT }
      : undefined,
  });
  let sent = 0;
  const failed: string[] = [];

  for (const event of events) {
    const guests = await prisma.guest.findMany({
      where: {
        invitationId: event.invitation.id,
        rsvpStatus: "KELADI",
        telegramId: { not: null },
        reminderSentAt: null,
      },
      select: { id: true, telegramId: true, name: true },
    });

    for (const guest of guests) {
      const message =
        `🔔 Eslatma: ertaga *${event.invitation.brideName} & ${event.invitation.groomName}* tantanasi!\n\n` +
        `📅 ${formatDate(event.startsAt)}, ${formatTime(event.startsAt)}\n` +
        `📍 ${event.locationName}\n\n` +
        appUrl(`/i/${event.invitation.slug}`);

      try {
        await bot.api.sendMessage(guest.telegramId!, message, {
          parse_mode: "Markdown",
        });

        await prisma.guest.update({
          where: { id: guest.id },
          data: { reminderSentAt: new Date() },
        });

        sent++;
      } catch (cause) {
        console.error("Eslatma yuborilmadi:", guest.id, cause);
        failed.push(guest.id);
      }
    }
  }

  return NextResponse.json({
    events: events.length,
    sent,
    failed: failed.length,
  });
}
