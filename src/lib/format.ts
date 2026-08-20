import type { EventType, RsvpStatus } from "@/generated/prisma/enums";

const MONTHS = [
  "yanvar", "fevral", "mart", "aprel", "may", "iyun",
  "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr",
];

const WEEKDAYS = [
  "yakshanba", "dushanba", "seshanba", "chorshanba",
  "payshanba", "juma", "shanba",
];

/** 2026-09-12T17:00:00 -> "12-sentabr, shanba" */
export function formatDate(date: Date): string {
  return `${date.getDate()}-${MONTHS[date.getMonth()]}, ${WEEKDAYS[date.getDay()]}`;
}

/** 2026-09-12T17:00:00 -> "17:00" */
export function formatTime(date: Date): string {
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

/** 2026-09-12T17:00:00 -> "12.09.2026 17:00" */
export function formatDateTime(date: Date): string {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `${dd}.${mm}.${date.getFullYear()} ${formatTime(date)}`;
}

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  TOY: "To'y",
  NIKOH: "Nikoh to'yi",
  SUNNAT: "Sunnat to'yi",
  BESHIK_TOY: "Beshik to'y",
};

export const RSVP_STATUS_LABELS: Record<RsvpStatus, string> = {
  KUTILMOQDA: "Kutilmoqda",
  KELADI: "Keladi",
  KELMAYDI: "Kelmaydi",
};

export const GUEST_SIDE_LABELS = {
  KELIN: "Kelin tomoni",
  KUYOV: "Kuyov tomoni",
  UMUMIY: "Umumiy",
} as const;
