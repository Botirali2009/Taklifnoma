"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  addPhoto,
  deleteInvitation,
  removePhoto,
  setMusic,
  updateInvitation,
} from "@/app/actions/invitation";
import type { EventType } from "@/generated/prisma/enums";

const INPUT = "input";

type EventForm = {
  id?: string;
  title: string;
  date: string;
  time: string;
  locationName: string;
  address: string;
  lat: string;
  lng: string;
};

type InvitationForm = {
  id: string;
  slug: string;
  brideName: string;
  groomName: string;
  eventType: EventType;
  greeting: string;
  cardNumber: string;
  cardHolder: string;
  musicUrl: string | null;
  events: EventForm[];
  photos: Array<{ id: string; url: string }>;
};

async function uploadFile(file: File, kind: "photo" | "music"): Promise<string> {
  const body = new FormData();
  body.append("file", file);
  body.append("kind", kind);

  const response = await fetch("/api/upload", { method: "POST", body });
  const data = await response.json();

  if (!response.ok) throw new Error(data.error ?? "Yuklab bo'lmadi.");
  return data.url as string;
}

export function SettingsForm({ invitation }: { invitation: InvitationForm }) {
  const router = useRouter();
  const [form, setForm] = useState(invitation);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [pending, startTransition] = useTransition();

  function setField<K extends keyof InvitationForm>(
    key: K,
    value: InvitationForm[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function setEvent(index: number, key: keyof EventForm, value: string) {
    setForm((current) => ({
      ...current,
      events: current.events.map((event, i) =>
        i === index ? { ...event, [key]: value } : event,
      ),
    }));
  }

  function save() {
    setError(null);
    setMessage(null);

    startTransition(async () => {
      const result = await updateInvitation({
        invitationId: form.id,
        brideName: form.brideName,
        groomName: form.groomName,
        eventType: form.eventType,
        greeting: form.greeting,
        cardNumber: form.cardNumber,
        cardHolder: form.cardHolder,
        events: form.events.map((event) => ({
          id: event.id,
          title: event.title,
          date: event.date,
          time: event.time,
          locationName: event.locationName,
          address: event.address,
          lat: event.lat ? Number(event.lat) : null,
          lng: event.lng ? Number(event.lng) : null,
        })),
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setMessage("Saqlandi.");
      router.refresh();
    });
  }

  function remove() {
    if (!confirm("Taklifnoma va barcha mehmon javoblari o'chiriladi. Davom etamizmi?")) {
      return;
    }

    startTransition(async () => {
      const result = await deleteInvitation(form.id);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push("/my-invitations");
    });
  }

  async function handlePhotos(files: FileList | null) {
    if (!files?.length) return;

    setBusy(true);
    setError(null);

    try {
      for (const file of Array.from(files)) {
        const url = await uploadFile(file, "photo");
        const result = await addPhoto(form.id, url);
        if (!result.ok) throw new Error(result.error);
        setForm((current) => ({
          ...current,
          photos: [...current.photos, { id: crypto.randomUUID(), url }],
        }));
      }
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Yuklashda xatolik.");
    } finally {
      setBusy(false);
    }
  }

  function deletePhoto(photoId: string) {
    startTransition(async () => {
      const result = await removePhoto(photoId);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setForm((current) => ({
        ...current,
        photos: current.photos.filter((photo) => photo.id !== photoId),
      }));
      router.refresh();
    });
  }

  async function handleMusic(file: File | null) {
    if (!file) return;

    setBusy(true);
    setError(null);

    try {
      const url = await uploadFile(file, "music");
      const result = await setMusic(form.id, url);
      if (!result.ok) throw new Error(result.error);
      setField("musicUrl", url);
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Yuklashda xatolik.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-10 space-y-10">
      {/* Asosiy ma'lumot */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium text-ink">Asosiy ma&apos;lumot</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="label">
            Kelin ismi
            <input
              className={INPUT}
              value={form.brideName}
              onChange={(event) => setField("brideName", event.target.value)}
            />
          </label>

          <label className="label">
            Kuyov ismi
            <input
              className={INPUT}
              value={form.groomName}
              onChange={(event) => setField("groomName", event.target.value)}
            />
          </label>
        </div>

        <label className="label">
          Tadbir turi
          <select
            className={INPUT}
            value={form.eventType}
            onChange={(event) =>
              setField("eventType", event.target.value as EventType)
            }
          >
            <option value="TOY">To&apos;y</option>
            <option value="NIKOH">Nikoh to&apos;yi</option>
            <option value="SUNNAT">Sunnat to&apos;yi</option>
            <option value="BESHIK_TOY">Beshik to&apos;y</option>
          </select>
        </label>

        <label className="label">
          Mehmonlarga murojaat
          <textarea
            className={INPUT}
            rows={3}
            value={form.greeting}
            onChange={(event) => setField("greeting", event.target.value)}
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="label">
            Karta raqami
            <input
              className={INPUT}
              value={form.cardNumber}
              onChange={(event) => setField("cardNumber", event.target.value)}
            />
          </label>

          <label className="label">
            Karta egasi
            <input
              className={INPUT}
              value={form.cardHolder}
              onChange={(event) => setField("cardHolder", event.target.value)}
            />
          </label>
        </div>
      </section>

      {/* Tadbirlar */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-ink">Tadbirlar</h2>

          <button
            type="button"
            onClick={() =>
              setForm((current) => ({
                ...current,
                events: [
                  ...current.events,
                  {
                    title: "Yangi tadbir",
                    date: "",
                    time: "17:00",
                    locationName: "",
                    address: "",
                    lat: "",
                    lng: "",
                  },
                ],
              }))
            }
            className="rounded-lg border border-line-strong px-3 py-2 text-sm text-ink-soft hover:bg-paper-sunk"
          >
            + Tadbir qo&apos;shish
          </button>
        </div>

        {form.events.map((event, index) => (
          <div
            key={event.id ?? `new-${index}`}
            className="space-y-3 rounded-card border border-line p-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-ink">
                {index + 1}-tadbir
              </p>

              {form.events.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setForm((current) => ({
                      ...current,
                      events: current.events.filter((_, i) => i !== index),
                    }))
                  }
                  className="text-sm text-anor hover:underline"
                >
                  O&apos;chirish
                </button>
              )}
            </div>

            <label className="label">
              Nomi
              <input
                className={INPUT}
                value={event.title}
                onChange={(e) => setEvent(index, "title", e.target.value)}
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="label">
                Sana
                <input
                  type="date"
                  className={INPUT}
                  value={event.date}
                  onChange={(e) => setEvent(index, "date", e.target.value)}
                />
              </label>

              <label className="label">
                Vaqt
                <input
                  type="time"
                  className={INPUT}
                  value={event.time}
                  onChange={(e) => setEvent(index, "time", e.target.value)}
                />
              </label>
            </div>

            <label className="label">
              Joy nomi
              <input
                className={INPUT}
                value={event.locationName}
                onChange={(e) => setEvent(index, "locationName", e.target.value)}
              />
            </label>

            <label className="label">
              Manzil
              <input
                className={INPUT}
                value={event.address}
                onChange={(e) => setEvent(index, "address", e.target.value)}
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="label">
                Kenglik (lat)
                <input
                  className={INPUT}
                  value={event.lat}
                  onChange={(e) => setEvent(index, "lat", e.target.value)}
                />
              </label>

              <label className="label">
                Uzunlik (lng)
                <input
                  className={INPUT}
                  value={event.lng}
                  onChange={(e) => setEvent(index, "lng", e.target.value)}
                />
              </label>
            </div>
          </div>
        ))}
      </section>

      {/* Suratlar */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium text-ink">Suratlar</h2>

        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className={INPUT}
          onChange={(event) => handlePhotos(event.target.files)}
        />

        {form.photos.length > 0 && (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {form.photos.map((photo) => (
              <div key={photo.id} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.url}
                  alt=""
                  className="aspect-square w-full rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={() => deletePhoto(photo.id)}
                  className="absolute right-1 top-1 rounded-full bg-black/60 px-2 text-xs text-white"
                  aria-label="Suratni o'chirish"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Musiqa */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium text-ink">Fon musiqasi</h2>

        <input
          type="file"
          accept="audio/mpeg,audio/ogg"
          className={INPUT}
          onChange={(event) => handleMusic(event.target.files?.[0] ?? null)}
        />

        {form.musicUrl && (
          <div className="flex items-center gap-3">
            <audio controls src={form.musicUrl} className="w-full" />
            <button
              type="button"
              onClick={() =>
                startTransition(async () => {
                  await setMusic(form.id, null);
                  setField("musicUrl", null);
                  router.refresh();
                })
              }
              className="rounded-lg border border-line-strong px-3 py-2 text-sm text-ink-soft hover:bg-paper-sunk"
            >
              O&apos;chirish
            </button>
          </div>
        )}
      </section>

      {busy && <p className="text-sm text-ink-faint">Yuklanmoqda...</p>}
      {message && (
        <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {message}
        </p>
      )}
      {error && (
        <p className="rounded-lg bg-anor-soft px-4 py-3 text-sm text-anor">{error}</p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
        <button
          type="button"
          onClick={save}
          disabled={pending || busy}
          className="rounded-lg bg-ink px-6 py-2.5 text-sm font-medium text-white hover:bg-ink-soft disabled:opacity-50"
        >
          {pending ? "Saqlanmoqda..." : "Saqlash"}
        </button>

        <button
          type="button"
          onClick={remove}
          disabled={pending}
          className="rounded-lg border border-red-200 px-5 py-2.5 text-sm font-medium text-anor hover:bg-anor-soft disabled:opacity-50"
        >
          Taklifnomani o&apos;chirish
        </button>
      </div>
    </div>
  );
}
