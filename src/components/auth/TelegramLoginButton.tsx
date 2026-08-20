"use client";

import { useEffect, useRef } from "react";
import { signIn } from "next-auth/react";

type Props = {
  botUsername: string;
  callbackUrl: string;
};

/**
 * Telegram Login Widget. Widget qaytargan ma'lumot NextAuth'ning
 * "telegram" provideriga yuboriladi, imzo serverda tekshiriladi.
 */
export function TelegramLoginButton({ botUsername, callbackUrl }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Widget global callback chaqiradi
    (window as unknown as Record<string, unknown>).onTelegramAuth = (
      user: Record<string, string>,
    ) => {
      void signIn("telegram", { ...user, callbackUrl });
    };

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-login", botUsername);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-radius", "8");
    script.setAttribute("data-onauth", "onTelegramAuth(user)");
    script.setAttribute("data-request-access", "write");
    container.appendChild(script);

    return () => {
      container.innerHTML = "";
    };
  }, [botUsername, callbackUrl]);

  return <div ref={containerRef} className="flex justify-center" />;
}
