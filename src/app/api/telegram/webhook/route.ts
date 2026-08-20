import { webhookCallback } from "grammy";
import { NextResponse } from "next/server";
import { createBot } from "@/lib/telegram-bot";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Telegram webhook.
 *
 * Sozlash (bir marta):
 *   curl "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://<domen>/api/telegram/webhook&secret_token=<TELEGRAM_WEBHOOK_SECRET>"
 */
export async function POST(request: Request) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "TELEGRAM_BOT_TOKEN sozlanmagan." },
      { status: 503 },
    );
  }

  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (
    secret &&
    request.headers.get("x-telegram-bot-api-secret-token") !== secret
  ) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const handler = webhookCallback(createBot(token), "std/http");
  return handler(request);
}
