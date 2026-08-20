"use client";

import { useFormState, useFormStatus } from "react-dom";
import { submitWish } from "@/app/actions/wish";

export type WishView = {
  id: string;
  authorName: string;
  message: string;
};

type Props = {
  slug: string;
  wishes: WishView[];
  preview?: boolean;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-black/80 px-5 py-2 text-sm font-medium text-white hover:bg-black disabled:opacity-50"
    >
      {pending ? "Yuborilmoqda..." : "Tilak qoldirish"}
    </button>
  );
}

export function WishesSection({ slug, wishes, preview = false }: Props) {
  const [state, formAction] = useFormState(submitWish, {});

  return (
    <div className="space-y-6">
      {wishes.length > 0 && (
        <ul className="space-y-3">
          {wishes.map((wish) => (
            <li
              key={wish.id}
              className="rounded-2xl border border-black/10 bg-white/70 p-4 text-left"
            >
              <p className="text-sm font-medium">{wish.authorName}</p>
              <p className="mt-1 whitespace-pre-line text-sm opacity-80">
                {wish.message}
              </p>
            </li>
          ))}
        </ul>
      )}

      {state.success ? (
        <p className="rounded-2xl border border-black/10 bg-white/70 p-4 text-sm">
          Tilagingiz uchun rahmat!
        </p>
      ) : (
        <form action={formAction} className="space-y-3 text-left">
          <input type="hidden" name="slug" value={slug} />

          <input
            name="authorName"
            required
            disabled={preview}
            placeholder="Ismingiz"
            className="w-full rounded-lg border border-black/15 bg-white/80 px-3 py-2 text-sm outline-none focus:border-black/40"
          />

          <textarea
            name="message"
            required
            disabled={preview}
            rows={3}
            maxLength={500}
            placeholder="Tilagingizni yozing..."
            className="w-full rounded-lg border border-black/15 bg-white/80 px-3 py-2 text-sm outline-none focus:border-black/40"
          />

          {state.error && <p className="text-sm text-red-600">{state.error}</p>}

          {!preview && <SubmitButton />}
        </form>
      )}
    </div>
  );
}
