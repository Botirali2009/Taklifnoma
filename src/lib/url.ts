/**
 * Sayt manzili asosida to'liq URL quradi.
 *
 * APP_URL — server tomonda o'qiladi (runtime'da o'zgartirsa bo'ladi).
 * NEXT_PUBLIC_APP_URL — brauzer kodiga build vaqtida joylashadi.
 */
export function appUrl(path: string): string {
  const base =
    process.env.APP_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000";

  return `${base.replace(/\/$/, "")}${path}`;
}
