"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { registerUser } from "@/app/actions/register";

/**
 * Boshqariladigan forma — xato chiqqanda kiritilgan ma'lumot saqlanib qoladi.
 */
export function RegisterForm({ callbackUrl }: { callbackUrl: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const formData = new FormData();
      formData.set("name", name);
      formData.set("email", email);
      formData.set("password", password);
      formData.set("confirm", confirm);

      const result = await registerUser({}, formData);

      if (result.error) {
        setError(result.error);
        return;
      }

      setDone(true);
      await signIn("password", { email, password, callbackUrl });
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="label">
        Ismingiz
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          placeholder="Aziz Rahimov"
          className="input"
        />
      </label>

      <label className="label">
        Email
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          autoComplete="email"
          placeholder="siz@example.com"
          className="input"
        />
      </label>

      <label className="label">
        Parol
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          autoComplete="new-password"
          placeholder="Kamida 8 belgi, harf va raqam"
          className="input"
        />
      </label>

      <label className="label">
        Parolni takrorlang
        <input
          type="password"
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
          required
          autoComplete="new-password"
          placeholder="••••••••"
          className="input"
        />
      </label>

      {error && (
        <p className="rounded-lg bg-anor-soft px-4 py-3 text-sm text-anor">{error}</p>
      )}

      {done && !error && (
        <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Hisob yaratildi, kirilmoqda...
        </p>
      )}

      <button
        type="submit"
        disabled={pending || done}
        className="btn-primary w-full"
      >
        {pending || done ? "Yaratilmoqda..." : "Hisob yaratish"}
      </button>

      <p className="text-center text-sm text-ink-soft">
        Hisobingiz bormi?{" "}
        <Link href="/login" className="font-semibold text-brass hover:underline">
          Kirish
        </Link>
      </p>
    </form>
  );
}
