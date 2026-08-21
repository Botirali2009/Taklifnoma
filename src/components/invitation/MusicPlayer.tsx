"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fon musiqasi. Brauzerlar avtomatik ijroga ruxsat bermaydi,
 * shuning uchun suzuvchi tugma ko'rsatiladi.
 */
export function MusicPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  // Parda ochilganda audio tashqaridan boshlanishi mumkin — holatni moslaymiz
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      audio?.pause();
    };
  }, []);

  async function toggle() {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }

    try {
      await audio.play();
      setPlaying(true);
    } catch {
      // Brauzer ruxsat bermadi
    }
  }

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="none" data-bg-music />

      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Musiqani to'xtatish" : "Musiqani yoqish"}
        className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg ring-1 ring-black/5 backdrop-blur transition hover:scale-105"
      >
        {playing ? (
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
            <path d="M8 5.5v13l11-6.5-11-6.5z" />
          </svg>
        )}
      </button>
    </>
  );
}
