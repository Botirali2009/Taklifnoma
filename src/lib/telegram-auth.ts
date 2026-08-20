import { createHash, createHmac, timingSafeEqual } from "crypto";

export type TelegramAuthPayload = {
  id: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: string;
  hash: string;
};

/** Widget ma'lumoti 1 kundan eski bo'lsa qabul qilinmaydi */
const MAX_AUTH_AGE_SECONDS = 24 * 60 * 60;

/**
 * Telegram Login Widget imzosini tekshiradi.
 * Hujjat: https://core.telegram.org/widgets/login#checking-authorization
 */
export function verifyTelegramAuth(
  payload: TelegramAuthPayload,
  botToken: string,
): boolean {
  const { hash, ...fields } = payload;
  if (!hash || !botToken) return false;

  const dataCheckString = Object.entries(fields)
    .filter(([, value]) => value !== undefined && value !== "")
    .map(([key, value]) => `${key}=${value}`)
    .sort()
    .join("\n");

  const secretKey = createHash("sha256").update(botToken).digest();
  const computed = createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  const a = Buffer.from(computed, "hex");
  const b = Buffer.from(hash, "hex");
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;

  const authDate = Number(payload.auth_date);
  if (!Number.isFinite(authDate)) return false;

  return Date.now() / 1000 - authDate < MAX_AUTH_AGE_SECONDS;
}
