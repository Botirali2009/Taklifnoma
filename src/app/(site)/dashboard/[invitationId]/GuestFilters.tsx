"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import type { GuestSide, RsvpStatus } from "@/generated/prisma/enums";

type Props = {
  invitationId: string;
  side?: GuestSide;
  status?: RsvpStatus;
  query: string;
};

const SIDE_OPTIONS: Array<[string, string]> = [
  ["", "Barcha tomon"],
  ["KELIN", "Kelin tomoni"],
  ["KUYOV", "Kuyov tomoni"],
  ["UMUMIY", "Umumiy"],
];

const STATUS_OPTIONS: Array<[string, string]> = [
  ["", "Barcha javoblar"],
  ["KELADI", "Keladi"],
  ["KELMAYDI", "Kelmaydi"],
  ["KUTILMOQDA", "Kutilmoqda"],
];

const CONTROL =
  "rounded-lg border border-line-strong bg-paper-raised px-3 py-2 text-sm text-ink outline-none transition focus:border-brass focus:ring-2 focus:ring-brass-soft";

export function GuestFilters({ invitationId, side, status, query }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(query);

  function apply(next: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());

    for (const [key, value] of Object.entries(next)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }

    router.push(`/dashboard/${invitationId}?${params.toString()}`);
  }

  return (
    <form
      className="flex flex-wrap gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        apply({ q: search });
      }}
    >
      <select
        className={CONTROL}
        value={side ?? ""}
        onChange={(event) => apply({ side: event.target.value })}
      >
        {SIDE_OPTIONS.map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <select
        className={CONTROL}
        value={status ?? ""}
        onChange={(event) => apply({ status: event.target.value })}
      >
        {STATUS_OPTIONS.map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <input
        className={CONTROL}
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Ism bo'yicha qidirish"
      />

      <button
        type="submit"
        className="btn-primary btn-sm"
      >
        Qidirish
      </button>
    </form>
  );
}
