"use client";

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { submitRsvp } from "@/app/actions/rsvp";

const INPUT = "input";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-ink px-6 py-3 font-medium text-white hover:bg-ink-soft disabled:opacity-50"
    >
      {pending ? "Yuborilmoqda..." : "Javobni yuborish"}
    </button>
  );
}

export function RsvpForm({ slug }: { slug: string }) {
  const [state, formAction] = useFormState(submitRsvp, {});

  if (state.success) {
    return (
      <div className="rounded-2xl border border-line p-8 text-center">
        <p className="text-lg font-medium text-ink">
          Rahmat! Javobingiz qabul qilindi.
        </p>
        <Link
          href={`/i/${slug}`}
          className="mt-4 inline-block text-sm text-ink-faint hover:underline"
        >
          Taklifnomaga qaytish
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="slug" value={slug} />

      <label className="label">
        Ismingiz
        <input name="name" required className={INPUT} placeholder="Aziza Karimova" />
      </label>

      <label className="label">
        Telefon (ixtiyoriy)
        <input name="phone" className={INPUT} placeholder="+998 90 123 45 67" />
      </label>

      <label className="label">
        Qaysi tomondan
        <select name="side" className={INPUT} defaultValue="UMUMIY">
          <option value="UMUMIY">Umumiy</option>
          <option value="KELIN">Kelin tomoni</option>
          <option value="KUYOV">Kuyov tomoni</option>
        </select>
      </label>

      <fieldset>
        <legend className="label">Javobingiz</legend>

        <div className="mt-2 grid grid-cols-2 gap-3">
          <label className="cursor-pointer rounded-lg border border-line-strong px-4 py-3 text-center text-sm has-[:checked]:border-brass has-[:checked]:bg-brass has-[:checked]:text-white">
            <input type="radio" name="rsvpStatus" value="KELADI" className="sr-only" required />
            Boraman
          </label>

          <label className="cursor-pointer rounded-lg border border-line-strong px-4 py-3 text-center text-sm has-[:checked]:border-brass has-[:checked]:bg-brass has-[:checked]:text-white">
            <input type="radio" name="rsvpStatus" value="KELMAYDI" className="sr-only" />
            Bormayman
          </label>
        </div>
      </fieldset>

      <label className="label">
        Necha kishi bilan kelasiz
        <input
          type="number"
          name="guestCount"
          min={1}
          max={20}
          defaultValue={1}
          className={INPUT}
        />
      </label>

      <label className="label">
        Tilak (ixtiyoriy)
        <textarea name="note" rows={3} className={INPUT} placeholder="Tabriklaymiz!" />
      </label>

      {state.error && (
        <p className="rounded-lg bg-anor-soft px-4 py-3 text-sm text-anor">
          {state.error}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
