"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createInvitation } from "@/app/actions/invitation";

const INPUT =
  "mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-neutral-900 px-6 py-3 font-medium text-white hover:bg-neutral-700 disabled:opacity-50"
    >
      {pending ? "Yaratilmoqda..." : "Taklifnoma yaratish"}
    </button>
  );
}

export function CreateInvitationForm({ templateCode }: { templateCode: string }) {
  const [state, formAction] = useFormState(createInvitation, {});

  return (
    <form action={formAction} className="mt-10 space-y-8">
      <input type="hidden" name="templateCode" value={templateCode} />

      <fieldset className="space-y-4">
        <legend className="text-lg font-medium text-neutral-900">
          Kelin va kuyov
        </legend>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm text-neutral-700">
            Kelin ismi
            <input name="brideName" required className={INPUT} placeholder="Malika" />
          </label>

          <label className="block text-sm text-neutral-700">
            Kuyov ismi
            <input name="groomName" required className={INPUT} placeholder="Aziz" />
          </label>
        </div>

        <label className="block text-sm text-neutral-700">
          Tadbir turi
          <select name="eventType" className={INPUT} defaultValue="TOY">
            <option value="TOY">To&apos;y</option>
            <option value="NIKOH">Nikoh to&apos;yi</option>
            <option value="SUNNAT">Sunnat to&apos;yi</option>
            <option value="BESHIK_TOY">Beshik to&apos;y</option>
          </select>
        </label>

        <label className="block text-sm text-neutral-700">
          Mehmonlarga murojaat (ixtiyoriy)
          <textarea
            name="greeting"
            rows={3}
            className={INPUT}
            placeholder="Hurmatli mehmon! Sizni to'yimizga taklif qilamiz."
          />
        </label>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-lg font-medium text-neutral-900">Tadbir</legend>

        <label className="block text-sm text-neutral-700">
          Nomi
          <input
            name="eventTitle"
            className={INPUT}
            placeholder="Nikoh marosimi"
            defaultValue="To'y marosimi"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm text-neutral-700">
            Sana
            <input type="date" name="eventDate" required className={INPUT} />
          </label>

          <label className="block text-sm text-neutral-700">
            Vaqt
            <input type="time" name="eventTime" required className={INPUT} defaultValue="17:00" />
          </label>
        </div>

        <label className="block text-sm text-neutral-700">
          To&apos;yxona / joy nomi
          <input
            name="locationName"
            required
            className={INPUT}
            placeholder="Oq Saroy to'yxonasi"
          />
        </label>

        <label className="block text-sm text-neutral-700">
          Manzil (ixtiyoriy)
          <input
            name="address"
            className={INPUT}
            placeholder="Toshkent sh., Chilonzor tumani"
          />
        </label>

        {/* TODO: Google Maps orqali joylashuv tanlash (lat/lng) */}
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-lg font-medium text-neutral-900">
          Pul sovg&apos;a (ixtiyoriy)
        </legend>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm text-neutral-700">
            Karta raqami
            <input name="cardNumber" className={INPUT} placeholder="8600 1234 5678 9012" />
          </label>

          <label className="block text-sm text-neutral-700">
            Karta egasi
            <input name="cardHolder" className={INPUT} placeholder="AZIZ RAHIMOV" />
          </label>
        </div>
      </fieldset>

      {/* TODO: foto galereya va musiqa yuklash (Cloudflare R2) */}

      {state.error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
