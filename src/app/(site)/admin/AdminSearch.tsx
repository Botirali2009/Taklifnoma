"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type Props = {
  basePath: string;
  placeholder: string;
};

export function AdminSearch({ basePath, placeholder }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") ?? "");

  return (
    <form
      className="flex gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        router.push(value ? `${basePath}?q=${encodeURIComponent(value)}` : basePath);
      }}
    >
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        className="rounded-lg border border-line-strong bg-paper-raised px-3 py-2 text-sm outline-none transition focus:border-brass focus:ring-2 focus:ring-brass-soft"
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
