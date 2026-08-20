import Link from "next/link";
import { CopyButton } from "@/components/ui/CopyButton";
import { EVENT_TYPE_LABELS, formatDate, formatTime } from "@/lib/format";
import type { TemplateProps } from "./types";

/**
 * "Klassik" shabloni — oq fon, oltin bezaklar.
 * Boshqa shablonlar shu tuzilishni takrorlaydi, faqat dizayni farq qiladi.
 */
export function ClassicTemplate({ invitation, preview = false }: TemplateProps) {
  const {
    slug,
    brideName,
    groomName,
    eventType,
    greeting,
    cardNumber,
    cardHolder,
    events,
    photos,
  } = invitation;

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-[#3d3529]">
      {/* Sarlavha */}
      <header className="mx-auto max-w-2xl px-6 pb-10 pt-16 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-[#b98a3f]">
          {EVENT_TYPE_LABELS[eventType]} taklifnomasi
        </p>

        <h1 className="mt-8 font-serif text-4xl leading-tight sm:text-5xl">
          {brideName}
          <span className="mx-3 text-[#b98a3f]">&amp;</span>
          {groomName}
        </h1>

        <div className="mx-auto mt-8 h-px w-24 bg-[#b98a3f]" />

        <p className="mt-8 whitespace-pre-line text-base leading-relaxed text-[#6b6053]">
          {greeting ??
            "Sizni oilamizning quvonchli kunida ko'rishdan mamnun bo'lamiz."}
        </p>
      </header>

      {/* Tadbirlar */}
      {events.length > 0 && (
        <section className="mx-auto max-w-2xl px-6 py-8">
          <h2 className="text-center font-serif text-2xl">Tadbir dasturi</h2>

          <div className="mt-8 space-y-4">
            {events.map((event) => (
              <article
                key={event.id}
                className="rounded-2xl border border-[#e8dcc6] bg-white p-6 shadow-sm"
              >
                <h3 className="font-serif text-xl">{event.title}</h3>

                <p className="mt-2 text-sm text-[#6b6053]">
                  {formatDate(event.startsAt)} · {formatTime(event.startsAt)}
                </p>

                <p className="mt-3 font-medium">{event.locationName}</p>
                {event.address && (
                  <p className="text-sm text-[#6b6053]">{event.address}</p>
                )}

                {event.lat !== null && event.lng !== null && (
                  <a
                    className="mt-4 inline-block rounded-lg bg-[#b98a3f] px-4 py-2 text-sm font-medium text-white hover:bg-[#a2762f]"
                    href={`https://www.google.com/maps/search/?api=1&query=${event.lat},${event.lng}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Xaritada ko&apos;rish
                  </a>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Foto galereya */}
      {photos.length > 0 && (
        <section className="mx-auto max-w-2xl px-6 py-8">
          <h2 className="text-center font-serif text-2xl">Bizning suratlar</h2>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {photos.map((photo) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={photo.id}
                src={photo.url}
                alt={`${brideName} va ${groomName}`}
                className="aspect-[3/4] w-full rounded-xl object-cover"
                loading="lazy"
              />
            ))}
          </div>
        </section>
      )}

      {/* Pul sovg'a */}
      {cardNumber && (
        <section className="mx-auto max-w-2xl px-6 py-8">
          <div className="rounded-2xl border border-[#e8dcc6] bg-white p-6 text-center shadow-sm">
            <h2 className="font-serif text-2xl">Sovg&apos;a uchun</h2>
            <p className="mt-2 text-sm text-[#6b6053]">
              Kelolmasangiz ham, e&apos;tiboringiz biz uchun qadrli.
            </p>

            <p className="mt-4 font-mono text-lg tracking-widest">{cardNumber}</p>
            {cardHolder && (
              <p className="text-sm text-[#6b6053]">{cardHolder}</p>
            )}

            <CopyButton
              value={cardNumber}
              label="Karta raqamini nusxalash"
              className="mt-4 rounded-lg border border-[#b98a3f] px-4 py-2 text-sm font-medium text-[#b98a3f] hover:bg-[#b98a3f] hover:text-white"
            />
          </div>
        </section>
      )}

      {/* RSVP */}
      <section className="mx-auto max-w-2xl px-6 pb-20 pt-8 text-center">
        <h2 className="font-serif text-2xl">Kela olasizmi?</h2>
        <p className="mt-2 text-sm text-[#6b6053]">
          Iltimos, javobingizni bildiring — mehmonlar sonini aniqlashimizga
          yordam beradi.
        </p>

        {preview ? (
          <span className="mt-6 inline-block cursor-not-allowed rounded-lg bg-[#b98a3f]/50 px-6 py-3 font-medium text-white">
            Javob berish (preview)
          </span>
        ) : (
          <Link
            href={`/i/${slug}/rsvp`}
            className="mt-6 inline-block rounded-lg bg-[#b98a3f] px-6 py-3 font-medium text-white hover:bg-[#a2762f]"
          >
            Javob berish
          </Link>
        )}
      </section>
    </div>
  );
}
