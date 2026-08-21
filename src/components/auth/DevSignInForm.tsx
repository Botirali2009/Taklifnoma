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
      className="space-y-3 rounded-card border border-dashed border-line-strong bg-paper-raised p-5"
      onSubmit={(event) => {
        event.preventDefault();
        setPending(true);
        void signIn("dev", { name, admin: String(admin), callbackUrl });
      }}
    >
      <p className="text-sm font-semibold">Lokal test kirishi</p>
      <p className="text-xs text-ink-faint">
        Faqat ishlab chiqish uchun — production build&apos;da bu forma umuman
        ko&apos;rinmaydi.
      </p>

      <input
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Ism"
        className="input mt-0"
      />

      <label className="flex items-center gap-2 text-sm text-ink-soft">
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
        className="btn-primary w-full"
      >
        {pending ? "Kirilmoqda..." : "Kirish"}
      </button>
    </form>
  );
}
