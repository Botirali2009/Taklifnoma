"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";

export function PasswordSignInForm({ callbackUrl }: { callbackUrl: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const result = await signIn("password", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Email yoki parol noto'g'ri.");
      setPending(false);
      return;
    }

    window.location.href = callbackUrl;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          autoComplete="current-password"
          placeholder="••••••••"
          className="input"
        />
      </label>

      {error && (
        <p className="rounded-lg bg-anor-soft px-4 py-3 text-sm text-anor">
          {error}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending ? "Kirilmoqda..." : "Kirish"}
      </button>

      <p className="text-center text-sm text-ink-soft">
        Hisobingiz yo&apos;qmi?{" "}
        <Link href="/register" className="font-semibold text-brass hover:underline">
          Ro&apos;yxatdan o&apos;ting
        </Link>
      </p>
    </form>
  );
}
