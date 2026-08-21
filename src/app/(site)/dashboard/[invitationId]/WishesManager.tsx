"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteWish, toggleWishVisibility } from "@/app/actions/wish";

export type ManagedWish = {
  id: string;
  authorName: string;
  message: string;
  isVisible: boolean;
  createdAt: string;
};

export function WishesManager({ wishes }: { wishes: ManagedWish[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function toggle(id: string) {
    setError(null);
    startTransition(async () => {
      const result = await toggleWishVisibility(id);
      if (!result.ok) setError(result.error);
      else router.refresh();
    });
  }

  function remove(id: string, author: string) {
    if (!confirm(`${author} qoldirgan tilak o'chiriladi. Davom etamizmi?`)) return;

    setError(null);
    startTransition(async () => {
      const result = await deleteWish(id);
      if (!result.ok) setError(result.error);
      else router.refresh();
    });
  }

  if (wishes.length === 0) {
    return (
      <p className="mt-4 rounded-lg border border-dashed border-line-strong px-4 py-8 text-center text-sm text-ink-faint">
        Hozircha tilak yo&apos;q. Mehmonlar taklifnoma sahifasida qoldiradi.
      </p>
    );
  }

  return (
    <div className="mt-4 space-y-3">
      {error && (
        <p className="rounded-lg bg-anor-soft px-4 py-3 text-sm text-anor">
          {error}
        </p>
      )}

      {wishes.map((wish) => (
        <article
          key={wish.id}
          className={`rounded-lg border p-4 ${
            wish.isVisible ? "border-line bg-paper" : "border-dashed border-line-strong bg-paper-sunk"
          }`}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">
                {wish.authorName}
                {!wish.isVisible && (
                  <span className="pill-neutral ml-2">Yashirilgan</span>
                )}
              </p>
              <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-ink-soft">
                {wish.message}
              </p>
              <p className="mt-2 text-xs text-ink-faint">{wish.createdAt}</p>
            </div>

            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => toggle(wish.id)}
                disabled={pending}
                className="btn-ghost btn-sm"
              >
                {wish.isVisible ? "Yashirish" : "Ko'rsatish"}
              </button>
              <button
                type="button"
                onClick={() => remove(wish.id, wish.authorName)}
                disabled={pending}
                className="btn-danger btn-sm"
              >
                O&apos;chirish
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
