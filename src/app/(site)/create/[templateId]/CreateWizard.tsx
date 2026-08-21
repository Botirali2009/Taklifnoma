"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createInvitation } from "@/app/actions/invitation";
import { getTemplateComponent } from "@/components/templates";
import type { InvitationView } from "@/components/templates";
import type { EventType } from "@/generated/prisma/enums";

const INPUT = "input";

const STEPS = ["Ismlar", "Tadbir", "Suratlar", "Musiqa", "Ko'rib chiqish"];

type PhotoItem = { id: string; url: string };

type FormState = {
  brideName: string;
  groomName: string;
  eventType: EventType;
  greeting: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  locationName: string;
  address: string;
  lat: string;
  lng: string;
  cardNumber: string;
  cardHolder: string;
};

const EMPTY: FormState = {
  brideName: "",
  groomName: "",
  eventType: "TOY",
  greeting: "",
  eventTitle: "To'y marosimi",
  eventDate: "",
  eventTime: "17:00",
  locationName: "",
  address: "",
  lat: "",
  lng: "",
  cardNumber: "",
  cardHolder: "",
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

export function CreateWizard({ templateCode }: { templateCode: string }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [musicUrl, setMusicUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const Template = getTemplateComponent(templateCode);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function validateStep(): string | null {
    if (step === 0 && (!form.brideName.trim() || !form.groomName.trim())) {
      return "Kelin va kuyov ismini kiriting.";
    }

    if (step === 1) {
      if (!form.eventDate || !form.eventTime) return "Sana va vaqtni tanlang.";
      if (!form.locationName.trim()) return "To'yxona yoki joy nomini kiriting.";
    }

    return null;
  }

  function next() {
    const message = validateStep();
    if (message) {
      setError(message);
      return;
    }

    setError(null);
    setStep((current) => Math.min(current + 1, STEPS.length - 1));
  }

  function back() {
    setError(null);
    setStep((current) => Math.max(current - 1, 0));
  }

  async function handlePhotos(files: FileList | null) {
    if (!files?.length) return;

    setBusy(true);
    setError(null);

    try {
      for (const file of Array.from(files)) {
        const url = await uploadFile(file, "photo");
        setPhotos((current) => [...current, { id: crypto.randomUUID(), url }]);
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Yuklashda xatolik.");
    } finally {
      setBusy(false);
    }
  }

  async function handleMusic(file: File | null) {
    if (!file) return;

    setBusy(true);
    setError(null);

    try {
      setMusicUrl(await uploadFile(file, "music"));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Yuklashda xatolik.");
    } finally {
      setBusy(false);
    }
  }

  function submit() {
    setError(null);

    startTransition(async () => {
      const result = await createInvitation({
        templateCode,
        brideName: form.brideName,
        groomName: form.groomName,
        eventType: form.eventType,
        greeting: form.greeting,
        cardNumber: form.cardNumber,
        cardHolder: form.cardHolder,
        musicUrl: musicUrl ?? undefined,
        photoUrls: photos.map((photo) => photo.url),
        events: [
          {
            title: form.eventTitle,
            date: form.eventDate,
            time: form.eventTime,
            locationName: form.locationName,
            address: form.address,
            lat: form.lat ? Number(form.lat) : null,
            lng: form.lng ? Number(form.lng) : null,
          },
        ],
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      router.push(`/dashboard/${result.invitationId}`);
    });
  }

  const previewData: InvitationView = {
    slug: "namuna",
    brideName: form.brideName || "Kelin",
    groomName: form.groomName || "Kuyov",
    eventType: form.eventType,
    greeting: form.greeting || null,
    cardNumber: form.cardNumber || null,
    cardHolder: form.cardHolder || null,
    musicUrl,
    events: form.eventDate
      ? [
          {
            id: "preview",
            title: form.eventTitle || "To'y marosimi",
            startsAt: new Date(`${form.eventDate}T${form.eventTime || "17:00"}`),
            locationName: form.locationName || "To'yxona",
            address: form.address || null,
            lat: form.lat ? Number(form.lat) : null,
            lng: form.lng ? Number(form.lng) : null,
          },
        ]
      : [],
    photos,
    wishes: [],
  };

  return (
    <div className="mt-8">
      {/* Bosqichlar */}
      <ol className="flex flex-wrap gap-2 text-xs">
        {STEPS.map((label, index) => (
          <li
            key={label}
            className={
              index === step
                ? "rounded-full bg-brass px-3 py-1 font-medium text-white"
                : index < step
                  ? "rounded-full bg-paper-sunk px-3 py-1 text-ink-soft"
                  : "rounded-full border border-line px-3 py-1 text-ink-faint"
            }
          >
            {index + 1}. {label}
          </li>
        ))}
      </ol>

      <div className="mt-8 space-y-4">
        {step === 0 && (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="label">
                Kelin ismi
                <input
                  className={INPUT}
                  value={form.brideName}
                  onChange={(event) => set("brideName", event.target.value)}
                  placeholder="Malika"
                />
              </label>

              <label className="label">
                Kuyov ismi
                <input
                  className={INPUT}
                  value={form.groomName}
                  onChange={(event) => set("groomName", event.target.value)}
                  placeholder="Aziz"
                />
              </label>
            </div>

            <label className="label">
              Tadbir turi
              <select
                className={INPUT}
                value={form.eventType}
                onChange={(event) =>
                  set("eventType", event.target.value as EventType)
                }
              >
                <option value="TOY">To&apos;y</option>
                <option value="NIKOH">Nikoh to&apos;yi</option>
                <option value="SUNNAT">Sunnat to&apos;yi</option>
                <option value="BESHIK_TOY">Beshik to&apos;y</option>
              </select>
            </label>

            <label className="label">
              Mehmonlarga murojaat (ixtiyoriy)
              <textarea
                className={INPUT}
                rows={3}
                value={form.greeting}
                onChange={(event) => set("greeting", event.target.value)}
                placeholder="Hurmatli mehmon! Sizni to'yimizga taklif qilamiz."
              />
            </label>
          </>
        )}

        {step === 1 && (
          <>
            <label className="label">
              Tadbir nomi
              <input
                className={INPUT}
                value={form.eventTitle}
                onChange={(event) => set("eventTitle", event.target.value)}
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="label">
                Sana
                <input
                  type="date"
                  className={INPUT}
                  value={form.eventDate}
                  onChange={(event) => set("eventDate", event.target.value)}
                />
              </label>

              <label className="label">
                Vaqt
                <input
                  type="time"
                  className={INPUT}
                  value={form.eventTime}
                  onChange={(event) => set("eventTime", event.target.value)}
                />
              </label>
            </div>

            <label className="label">
              To&apos;yxona / joy nomi
              <input
                className={INPUT}
                value={form.locationName}
                onChange={(event) => set("locationName", event.target.value)}
                placeholder="Oq Saroy to'yxonasi"
              />
            </label>

            <label className="label">
              Manzil (ixtiyoriy)
              <input
                className={INPUT}
                value={form.address}
                onChange={(event) => set("address", event.target.value)}
                placeholder="Toshkent sh., Chilonzor tumani"
              />
            </label>

            <div className="rounded-card border border-line p-4">
              <p className="text-sm font-medium text-ink">
                Xaritadagi joylashuv (ixtiyoriy)
              </p>
              <p className="mt-1 text-xs text-ink-faint">
                Google Maps&apos;da joyni toping, o&apos;ng tugma bosib
                koordinatalarni nusxalang va shu yerga qo&apos;ying — mehmon
                sahifasida xarita ko&apos;rinadi.
              </p>

              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <label className="label">
                  Kenglik (lat)
                  <input
                    className={INPUT}
                    value={form.lat}
                    onChange={(event) => set("lat", event.target.value)}
                    placeholder="41.2995"
                  />
                </label>

                <label className="label">
                  Uzunlik (lng)
                  <input
                    className={INPUT}
                    value={form.lng}
                    onChange={(event) => set("lng", event.target.value)}
                    placeholder="69.2401"
                  />
                </label>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="label">
                Karta raqami (ixtiyoriy)
                <input
                  className={INPUT}
                  value={form.cardNumber}
                  onChange={(event) => set("cardNumber", event.target.value)}
                  placeholder="8600 1234 5678 9012"
                />
              </label>

              <label className="label">
                Karta egasi
                <input
                  className={INPUT}
                  value={form.cardHolder}
                  onChange={(event) => set("cardHolder", event.target.value)}
                  placeholder="AZIZ RAHIMOV"
                />
              </label>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <label className="label">
              Suratlar (bir nechta tanlash mumkin)
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className={INPUT}
                onChange={(event) => handlePhotos(event.target.files)}
              />
            </label>

            {photos.length > 0 && (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {photos.map((photo) => (
                  <div key={photo.id} className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.url}
                      alt=""
                      className="aspect-square w-full rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setPhotos((current) =>
                          current.filter((item) => item.id !== photo.id),
                        )
                      }
                      className="absolute right-1 top-1 rounded-full bg-black/60 px-2 text-xs text-white"
                      aria-label="Suratni o'chirish"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <p className="text-xs text-ink-faint">
              JPG, PNG yoki WEBP — har biri 8 MB gacha. Surat shart emas.
            </p>
          </>
        )}

        {step === 3 && (
          <>
            <label className="label">
              Fon musiqasi (ixtiyoriy)
              <input
                type="file"
                accept="audio/mpeg,audio/ogg"
                className={INPUT}
                onChange={(event) => handleMusic(event.target.files?.[0] ?? null)}
              />
            </label>

            {musicUrl && (
              <div className="flex items-center gap-3">
                <audio controls src={musicUrl} className="w-full" />
                <button
                  type="button"
                  onClick={() => setMusicUrl(null)}
                  className="rounded-lg border border-line-strong px-3 py-2 text-sm text-ink-soft hover:bg-paper-sunk"
                >
                  O&apos;chirish
                </button>
              </div>
            )}

            <p className="text-xs text-ink-faint">
              MP3 yoki OGG — 15 MB gacha. Mehmon sahifasida ijro tugmasi
              ko&apos;rinadi.
            </p>
          </>
        )}

        {step === 4 && (
          <div className="overflow-hidden rounded-2xl border border-line">
            <div className="scale-[0.98] origin-top">
              <Template invitation={previewData} preview />
            </div>
          </div>
        )}
      </div>

      {busy && <p className="mt-4 text-sm text-ink-faint">Yuklanmoqda...</p>}

      {error && (
        <p className="mt-4 rounded-lg bg-anor-soft px-4 py-3 text-sm text-anor">
          {error}
        </p>
      )}

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={back}
          disabled={step === 0}
          className="btn-ghost"
        >
          Orqaga
        </button>

        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={next}
            disabled={busy}
            className="btn-primary"
          >
            Keyingisi
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={pending}
            className="btn-brass"
          >
            {pending ? "Yaratilmoqda..." : "Taklifnomani yaratish"}
          </button>
        )}
      </div>
    </div>
  );
}
