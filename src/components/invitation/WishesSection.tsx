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
      className="px-5 py-2.5 text-sm font-semibold transition hover:opacity-90 disabled:opacity-50"
      style={{
        backgroundColor: "var(--tpl-accent)",
        color: "var(--tpl-on-accent)",
        borderRadius: "var(--tpl-radius)",
      }}
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
              className="p-4 text-left"
              style={{
                backgroundColor: "var(--tpl-surface)",
                border: "1px solid var(--tpl-line)",
                borderRadius: "var(--tpl-radius)",
              }}
            >
              <p className="text-sm font-semibold">{wish.authorName}</p>
              <p
                className="mt-1.5 whitespace-pre-line text-sm leading-relaxed"
                style={{ color: "var(--tpl-soft)" }}
              >
                {wish.message}
              </p>
            </li>
          ))}
        </ul>
      )}

      {state.success ? (
        <p
          className="p-4 text-sm"
          style={{
            backgroundColor: "var(--tpl-surface)",
            border: "1px solid var(--tpl-line)",
            borderRadius: "var(--tpl-radius)",
          }}
        >
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
            className="w-full px-3.5 py-2.5 text-sm outline-none transition focus:opacity-100"
            style={{
              backgroundColor: "var(--tpl-surface)",
              border: "1px solid var(--tpl-line)",
              borderRadius: "var(--tpl-radius)",
              color: "var(--tpl-ink)",
            }}
          />

          <textarea
            name="message"
            required
            disabled={preview}
            rows={3}
            maxLength={500}
            placeholder="Tilagingizni yozing..."
            className="w-full px-3.5 py-2.5 text-sm outline-none"
            style={{
              backgroundColor: "var(--tpl-surface)",
              border: "1px solid var(--tpl-line)",
              borderRadius: "var(--tpl-radius)",
              color: "var(--tpl-ink)",
            }}
          />

          {state.error && (
            <p className="text-sm" style={{ color: "#b4433c" }}>
              {state.error}
            </p>
          )}

          {!preview && <SubmitButton />}
        </form>
      )}
    </div>
  );
}
