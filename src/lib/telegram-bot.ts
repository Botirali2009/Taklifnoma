import { Bot, InlineKeyboard, type Context } from "grammy";
import { getTemplateMeta, TEMPLATES } from "@/data/templates";
import { prisma } from "@/lib/prisma";
import { generateUniqueSlug } from "@/lib/slug";
import { appUrl } from "@/lib/url";
import { EVENT_TYPE_LABELS, formatDate, formatTime } from "@/lib/format";

/**
 * Telegram bot (grammY).
 *
 * Ikki vazifa:
 *  1. Deep-link orqali RSVP: t.me/<bot>?start=<slug>
 *  2. Soddalashtirilgan taklifnoma yaratish oqimi (/yaratish)
 *
 * Suhbat holati BotSession jadvalida saqlanadi — serverless webhook'da ham
 * ishlashi uchun (xotira so'rovlar orasida saqlanmaydi).
 */

type SessionData = {
  brideName?: string;
  groomName?: string;
  date?: string;
  time?: string;
  locationName?: string;
  rsvpSlug?: string;
};

const STEP_IDLE = "idle";
const STEP_NAMES = "await_names";
const STEP_DATE = "await_date";
const STEP_TIME = "await_time";
const STEP_LOCATION = "await_location";
const STEP_RSVP_COUNT = "await_rsvp_count";

async function loadSession(chatId: string) {
  const session = await prisma.botSession.findUnique({ where: { chatId } });
  return {
    step: session?.step ?? STEP_IDLE,
    data: (session?.data ?? {}) as SessionData,
  };
}

async function saveSession(chatId: string, step: string, data: SessionData) {
  await prisma.botSession.upsert({
    where: { chatId },
    update: { step, data },
    create: { chatId, step, data },
  });
}

async function clearSession(chatId: string) {
  await prisma.botSession
    .delete({ where: { chatId } })
    .catch(() => undefined);
}

/** Telegram foydalanuvchisini bazadagi User bilan bog'laydi */
async function upsertUser(ctx: Context) {
  const from = ctx.from;
  if (!from) return null;

  const name =
    [from.first_name, from.last_name].filter(Boolean).join(" ") ||
    from.username ||
    "Telegram foydalanuvchi";

  return prisma.user.upsert({
    where: { telegramId: String(from.id) },
    update: { name, telegramUsername: from.username ?? null },
    create: {
      telegramId: String(from.id),
      telegramUsername: from.username ?? null,
      name,
    },
  });
}

function invitationSummary(invitation: {
  brideName: string;
  groomName: string;
  eventType: keyof typeof EVENT_TYPE_LABELS;
  events: Array<{ title: string; startsAt: Date; locationName: string }>;
}) {
  const lines = [
    `💍 *${invitation.brideName} & ${invitation.groomName}*`,
    EVENT_TYPE_LABELS[invitation.eventType],
    "",
  ];

  for (const event of invitation.events) {
    lines.push(
      `📅 ${event.title}: ${formatDate(event.startsAt)}, ${formatTime(event.startsAt)}`,
      `📍 ${event.locationName}`,
      "",
    );
  }

  return lines.join("\n");
}

export function createBot(token: string): Bot {
  // TELEGRAM_API_ROOT — lokal Bot API serveri yoki testlar uchun
  const bot = new Bot(token, {
    client: process.env.TELEGRAM_API_ROOT
      ? { apiRoot: process.env.TELEGRAM_API_ROOT }
      : undefined,
  });

  // /start — deep-link bo'lsa RSVP, aks holda menyu
  bot.command("start", async (ctx) => {
    const chatId = String(ctx.chat.id);
    const slug = ctx.match?.trim();

    await upsertUser(ctx);

    if (!slug) {
      await clearSession(chatId);
      await ctx.reply(
        "Assalomu alaykum! Bu — Taklifnoma boti.\n\n" +
          "• /yaratish — yangi taklifnoma yaratish\n" +
          "• /mening — mening taklifnomalarim\n\n" +
          "Mehmon bo'lsangiz, taklifnomadagi havola orqali kiring.",
      );
      return;
    }

    const invitation = await prisma.invitation.findUnique({
      where: { slug },
      include: { events: { orderBy: { order: "asc" } } },
    });

    if (!invitation) {
      await ctx.reply("Bunday taklifnoma topilmadi.");
      return;
    }

    await saveSession(chatId, STEP_IDLE, { rsvpSlug: slug });

    const keyboard = new InlineKeyboard()
      .text("✅ Boraman", `rsvp:${slug}:yes`)
      .text("❌ Bormayman", `rsvp:${slug}:no`)
      .row()
      .url("Taklifnomani ochish", appUrl(`/i/${slug}`));

    await ctx.reply(invitationSummary(invitation) + "\nKela olasizmi?", {
      parse_mode: "Markdown",
      reply_markup: keyboard,
    });
  });

  // RSVP tugmalari
  bot.callbackQuery(/^rsvp:(.+):(yes|no)$/, async (ctx) => {
    const [, slug, answer] = ctx.match as RegExpMatchArray;
    const chatId = String(ctx.chat?.id ?? "");

    const invitation = await prisma.invitation.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!invitation) {
      await ctx.answerCallbackQuery("Taklifnoma topilmadi.");
      return;
    }

    if (answer === "no") {
      await upsertGuest(ctx, invitation.id, "KELMAYDI", 0);
      await ctx.answerCallbackQuery();
      await ctx.reply("Javobingiz qabul qilindi. Rahmat!");
      await clearSession(chatId);
      return;
    }

    await saveSession(chatId, STEP_RSVP_COUNT, { rsvpSlug: slug });

    const keyboard = new InlineKeyboard();
    for (const count of [1, 2, 3, 4, 5]) {
      keyboard.text(String(count), `count:${slug}:${count}`);
    }

    await ctx.answerCallbackQuery();
    await ctx.reply("Necha kishi bilan kelasiz?", { reply_markup: keyboard });
  });

  bot.callbackQuery(/^count:(.+):(\d+)$/, async (ctx) => {
    const [, slug, count] = ctx.match as RegExpMatchArray;

    const invitation = await prisma.invitation.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!invitation) {
      await ctx.answerCallbackQuery("Taklifnoma topilmadi.");
      return;
    }

    await upsertGuest(ctx, invitation.id, "KELADI", Number(count));
    await clearSession(String(ctx.chat?.id ?? ""));

    await ctx.answerCallbackQuery();
    await ctx.reply(
      `Rahmat! Javobingiz yozildi: ${count} kishi bilan kelasiz. Kutamiz! 🎉`,
    );
  });

  // Taklifnoma yaratish oqimi
  bot.command("yaratish", async (ctx) => {
    const chatId = String(ctx.chat.id);
    await upsertUser(ctx);
    await saveSession(chatId, STEP_NAMES, {});
    await ctx.reply(
      "Yangi taklifnoma yaratamiz.\n\n" +
        "1/4. Kelin va kuyov ismini yuboring.\n" +
        "Masalan: *Malika va Aziz*",
      { parse_mode: "Markdown" },
    );
  });

  bot.command("mening", async (ctx) => {
    const user = await upsertUser(ctx);
    if (!user) return;

    const invitations = await prisma.invitation.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { _count: { select: { guests: true } } },
    });

    if (invitations.length === 0) {
      await ctx.reply("Sizda hali taklifnoma yo'q. /yaratish buyrug'ini yuboring.");
      return;
    }

    const lines = invitations.map(
      (invitation) =>
        `• ${invitation.brideName} & ${invitation.groomName} — ${invitation._count.guests} javob\n${appUrl(`/i/${invitation.slug}`)}`,
    );

    await ctx.reply(lines.join("\n\n"));
  });

  bot.command("bekor", async (ctx) => {
    await clearSession(String(ctx.chat.id));
    await ctx.reply("Bekor qilindi.");
  });

  // Matnli javoblar — yaratish oqimining bosqichlari
  bot.on("message:text", async (ctx) => {
    const chatId = String(ctx.chat.id);
    const text = ctx.message.text.trim();
    const { step, data } = await loadSession(chatId);

    if (step === STEP_NAMES) {
      const parts = text.split(/\s+va\s+|,|&/i).map((part) => part.trim());
      if (parts.length < 2 || !parts[0] || !parts[1]) {
        await ctx.reply("Iltimos, ikkala ismni yuboring. Masalan: Malika va Aziz");
        return;
      }

      await saveSession(chatId, STEP_DATE, {
        ...data,
        brideName: parts[0],
        groomName: parts[1],
      });
      await ctx.reply("2/4. Tadbir sanasini yuboring: *KUN.OY.YIL* (12.09.2026)", {
        parse_mode: "Markdown",
      });
      return;
    }

    if (step === STEP_DATE) {
      const match = text.match(/^(\d{1,2})[.\-/](\d{1,2})[.\-/](\d{4})$/);
      if (!match) {
        await ctx.reply("Sanani shu ko'rinishda yuboring: 12.09.2026");
        return;
      }

      const [, day, month, year] = match;
      const iso = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

      if (Number.isNaN(new Date(`${iso}T12:00`).getTime())) {
        await ctx.reply("Bunday sana yo'q. Qaytadan yuboring: 12.09.2026");
        return;
      }

      await saveSession(chatId, STEP_TIME, { ...data, date: iso });
      await ctx.reply("3/4. Boshlanish vaqtini yuboring: *SOAT:DAQIQA* (17:00)", {
        parse_mode: "Markdown",
      });
      return;
    }

    if (step === STEP_TIME) {
      const match = text.match(/^(\d{1,2}):(\d{2})$/);
      if (!match || Number(match[1]) > 23 || Number(match[2]) > 59) {
        await ctx.reply("Vaqtni shu ko'rinishda yuboring: 17:00");
        return;
      }

      await saveSession(chatId, STEP_LOCATION, {
        ...data,
        time: `${match[1].padStart(2, "0")}:${match[2]}`,
      });
      await ctx.reply("4/4. To'yxona nomi va manzilini yuboring.");
      return;
    }

    if (step === STEP_LOCATION) {
      const user = await upsertUser(ctx);
      if (!user) return;

      const meta = getTemplateMeta(TEMPLATES[0].code)!;
      const template = await prisma.template.upsert({
        where: { code: meta.code },
        update: {},
        create: { code: meta.code, name: meta.name, category: meta.category },
      });

      const slug = await generateUniqueSlug(
        `${data.brideName}-${data.groomName}`,
      );

      const invitation = await prisma.invitation.create({
        data: {
          userId: user.id,
          templateId: template.id,
          slug,
          brideName: data.brideName!,
          groomName: data.groomName!,
          events: {
            create: {
              title: "To'y marosimi",
              startsAt: new Date(`${data.date}T${data.time}`),
              locationName: text,
              order: 0,
            },
          },
        },
      });

      await clearSession(chatId);

      await ctx.reply(
        "Tayyor! 🎉 Taklifnomangiz havolasi:\n" +
          appUrl(`/i/${invitation.slug}`) +
          "\n\nSuratlar, musiqa va boshqa sozlamalarni saytda qo'shishingiz mumkin:\n" +
          appUrl(`/dashboard/${invitation.id}`),
      );
      return;
    }

    await ctx.reply(
      "Buyruqlar:\n/yaratish — yangi taklifnoma\n/mening — taklifnomalarim\n/bekor — bekor qilish",
    );
  });

  return bot;
}

/** Bot orqali kelgan RSVP javobini yozadi (takroriy javob yangilanadi) */
async function upsertGuest(
  ctx: Context,
  invitationId: string,
  rsvpStatus: "KELADI" | "KELMAYDI",
  guestCount: number,
) {
  const from = ctx.from;
  if (!from) return;

  const telegramId = String(from.id);
  const name =
    [from.first_name, from.last_name].filter(Boolean).join(" ") ||
    from.username ||
    "Mehmon";

  const existing = await prisma.guest.findFirst({
    where: { invitationId, telegramId },
    select: { id: true },
  });

  if (existing) {
    await prisma.guest.update({
      where: { id: existing.id },
      data: { name, rsvpStatus, guestCount, respondedAt: new Date() },
    });
    return;
  }

  await prisma.guest.create({
    data: {
      invitationId,
      telegramId,
      name,
      rsvpStatus,
      guestCount,
      respondedAt: new Date(),
    },
  });
}
