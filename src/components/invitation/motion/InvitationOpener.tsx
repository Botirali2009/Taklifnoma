"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  brideName: string;
  groomName: string;
  /** Parda ranglari */
  bg: string;
  ink: string;
  accent: string;
  displayFont: string;
  /** Ochilganda musiqani boshlash uchun */
  musicUrl?: string | null;
  /** Preview rejimida parda ko'rsatilmaydi */
  disabled?: boolean;
  ornament?: ReactNode;
};

/**
 * Taklifnoma yopiq holda ochiladi: mehmon "Ochish" tugmasini bosadi,
 * parda ikki tomonga ochilib, ichidagi taklifnoma ko'rinadi.
 * Shu paytda fon musiqasi ham boshlanadi (brauzer faqat shunday ruxsat beradi).
 */
export function InvitationOpener({
  children,
  brideName,
  groomName,
  bg,
  ink,
  accent,
  displayFont,
  musicUrl,
  disabled = false,
  ornament,
}: Props) {
  const reduced = useReducedMotion();
  const [opened, setOpened] = useState(disabled);

  // Parda ochilmaguncha sahifa aylanmasin
  useEffect(() => {
    if (opened) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [opened]);

  function open() {
    setOpened(true);

    if (musicUrl) {
      const audio = document.querySelector<HTMLAudioElement>("audio[data-bg-music]");
      void audio?.play().catch(() => undefined);
    }
  }

  return (
    <>
      {children}

      <AnimatePresence>
        {!opened && (
          <motion.div className="fixed inset-0 z-[70]" exit={{ opacity: 1 }}>
            {/* Ikki parda — ochilganda yuqoriga va pastga suriladi */}
            {[0, 1].map((half) => (
              <motion.div
                key={half}
                className="absolute inset-x-0"
                style={{
                  backgroundColor: bg,
                  top: half === 0 ? 0 : "50%",
                  height: "50.2%",
                  borderBottom:
                    half === 0 ? `1px solid ${accent}` : undefined,
                }}
                initial={{ y: 0 }}
                exit={{ y: half === 0 ? "-100%" : "100%" }}
                transition={{
                  duration: reduced ? 0.3 : 1.1,
                  ease: [0.7, 0, 0.25, 1],
                  delay: reduced ? 0 : 0.35,
                }}
              />
            ))}

            {/* Matn — bir marta, pardalar ustida */}
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: reduced ? 0.2 : 0.45 }}
            >
              {ornament}

              <p
                className="mt-6 text-[11px] uppercase tracking-[0.4em]"
                style={{ color: accent }}
              >
                Taklifnoma
              </p>

              <p
                className="mt-6 text-4xl leading-tight sm:text-5xl"
                style={{ fontFamily: displayFont, color: ink }}
              >
                {brideName}
                <span className="mx-3" style={{ color: accent }}>
                  &amp;
                </span>
                {groomName}
              </p>

              <button
                type="button"
                onClick={open}
                className="mt-10 rounded-full px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] transition hover:opacity-90"
                style={{ backgroundColor: accent, color: bg }}
              >
                Taklifnomani ochish
              </button>

              <p className="mt-4 text-xs" style={{ color: ink, opacity: 0.55 }}>
                Ovoz bilan ko&apos;rish tavsiya etiladi
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
