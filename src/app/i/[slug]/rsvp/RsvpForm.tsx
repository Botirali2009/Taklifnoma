"use client";

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { submitRsvp } from "@/app/actions/rsvp";

const INPUT =
  "mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-neutral-900 px-6 py-3 font-medium text-white hover:bg-neutral-700 disabled:opacity-50"
    >
      {pending ? "Yuborilmoqda..." : "Javobni yuborish"}
    </button>
  );
}

export function RsvpForm({ slug }: { slug: string }) {
  const [state, formAction] = useFormState(submitRsvp, {});

  if (state.success) {
    return (
      <div className="rounded-2xl border border-neutral-200 p-8 text-center">
        <p className="text-lg font-medium text-neutral-900">
          Rahmat! Javobingiz qabul qilindi.
        </p>
        <Link
          href={`/i/${slug}`}
          className="mt-4 inline-block text-sm text-neutral-500 hover:underline"
        >
          Taklifnomaga qaytish
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="slug" value={slug} />

      <label className="block text-sm text-neutral-700">
        Ismingiz
        <input name="name" required className={INPUT} placeholder="Aziza Karimova" />
      </label>

      <label className="block text-sm text-neutral-700">
        Telefon (ixtiyoriy)
        <input name="phone" className={INPUT} placeholder="+998 90 123 45 67" />
      </label>

      <label className="block text-sm text-neutral-700">
        Qaysi tomondan
        <select name="side" className={INPUT} defaultValue="UMUMIY">
          <option value="UMUMIY">Umumiy</option>
          <option value="KELIN">Kelin tomoni</option>
          <option value="KUYOV">Kuyov tomoni</option>
        </select>
      </label>

      <fieldset>
        <legend className="text-sm text-neutral-700">Javobingiz</legend>

        <div className="mt-2 grid grid-cols-2 gap-3">
          <label className="cursor-pointer rounded-lg border border-neutral-300 px-4 py-3 text-center text-sm has-[:checked]:border-neutral-900 has-[:checked]:bg-neutral-900 has-[:checked]:text-white">
            <input type="radio" name="rsvpStatus" value="KELADI" className="sr-only" required />
            Boraman
          </label>

          <label className="cursor-pointer rounded-lg border border-neutral-300 px-4 py-3 text-center text-sm has-[:checked]:border-neutral-900 has-[:checked]:bg-neutral-900 has-[:checked]:text-white">
            <input type="radio" name="rsvpStatus" value="KELMAYDI" className="sr-only" />
            Bormayman
          </label>
        </div>
      </fieldset>

      <label className="block text-sm text-neutral-700">
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

      <label className="block text-sm text-neutral-700">
        Tilak (ixtiyoriy)
        <textarea name="note" rows={3} className={INPUT} placeholder="Tabriklaymiz!" />
      </label>

      {state.error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
