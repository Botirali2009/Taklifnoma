"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

/**
 * Lokal ishlab chiqish uchun kirish formasi.
 * Faqat ALLOW_DEV_LOGIN=true bo'lganda ko'rsatiladi.
 */
export function DevSignInForm({ callbackUrl }: { callbackUrl: string }) {
  const [name, setName] = useState("Test foydalanuvchi");
  const [admin, setAdmin] = useState(false);
  const [pending, setPending] = useState(false);

  return (
    <form
      className="space-y-3 rounded-2xl border border-dashed border-neutral-300 p-4"
      onSubmit={(event) => {
        event.preventDefault();
        setPending(true);
        void signIn("dev", { name, admin: String(admin), callbackUrl });
      }}
    >
      <p className="text-sm font-medium text-neutral-800">Lokal test kirishi</p>
      <p className="text-xs text-neutral-500">
        Faqat ishlab chiqish uchun — production build&apos;da bu forma umuman
        ko&apos;rinmaydi.
      </p>

      <input
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Ism"
        className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
      />

      <label className="flex items-center gap-2 text-sm text-neutral-700">
        <input
          type="checkbox"
          checked={admin}
          onChange={(event) => setAdmin(event.target.checked)}
        />
        Admin huquqi bilan kirish
      </label>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50"
      >
        {pending ? "Kirilmoqda..." : "Kirish"}
      </button>
    </form>
  );
}
