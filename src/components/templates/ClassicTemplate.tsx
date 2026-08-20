import Link from "next/link";
import { Countdown } from "@/components/invitation/Countdown";
import { MapEmbed } from "@/components/invitation/MapEmbed";
import { MusicPlayer } from "@/components/invitation/MusicPlayer";
import { PhotoGallery } from "@/components/invitation/PhotoGallery";
import { Reveal } from "@/components/invitation/Reveal";
import { WishesSection } from "@/components/invitation/WishesSection";
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
    musicUrl,
    events,
    photos,
    wishes,
  } = invitation;

  const mainEvent = events[0];

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-[#3d3529]">
      {musicUrl && !preview && <MusicPlayer src={musicUrl} />}

      {/* Sarlavha */}
      <header className="mx-auto max-w-2xl px-6 pb-10 pt-16 text-center">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.4em] text-[#b98a3f]">
            {EVENT_TYPE_LABELS[eventType]} taklifnomasi
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <h1 className="mt-8 font-serif text-4xl leading-tight sm:text-5xl">
            {brideName}
            <span className="mx-3 text-[#b98a3f]">&amp;</span>
            {groomName}
          </h1>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mx-auto mt-8 h-px w-24 bg-[#b98a3f]" />

          <p className="mt-8 whitespace-pre-line text-base leading-relaxed text-[#6b6053]">
            {greeting ??
              "Sizni oilamizning quvonchli kunida ko'rishdan mamnun bo'lamiz."}
          </p>
        </Reveal>

        {mainEvent && (
          <Reveal delay={0.45} className="mt-12 text-[#b98a3f]">
            <Countdown target={mainEvent.startsAt} />
          </Reveal>
        )}
      </header>

      {/* Tadbirlar */}
      {events.length > 0 && (
        <section className="mx-auto max-w-2xl px-6 py-8">
          <Reveal>
            <h2 className="text-center font-serif text-2xl">Tadbir dasturi</h2>
          </Reveal>

          <div className="mt-8 space-y-4">
            {events.map((event, index) => (
              <Reveal key={event.id} delay={index * 0.08}>
                <article className="rounded-2xl border border-[#e8dcc6] bg-white p-6 shadow-sm">
                  <h3 className="font-serif text-xl">{event.title}</h3>

                  <p className="mt-2 text-sm text-[#6b6053]">
                    {formatDate(event.startsAt)} · {formatTime(event.startsAt)}
                  </p>

                  <p className="mt-3 font-medium">{event.locationName}</p>
                  {event.address && (
                    <p className="text-sm text-[#6b6053]">{event.address}</p>
                  )}

                  {event.lat !== null && event.lng !== null && (
                    <div className="mt-4 space-y-3">
                      <MapEmbed
                        lat={event.lat}
                        lng={event.lng}
                        title={event.locationName}
                      />

                      <a
                        className="inline-block rounded-lg bg-[#b98a3f] px-4 py-2 text-sm font-medium text-white hover:bg-[#a2762f]"
                        href={`https://www.google.com/maps/search/?api=1&query=${event.lat},${event.lng}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Yo&apos;nalishni ochish
                      </a>
                    </div>
                  )}
                </article>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Foto galereya */}
      {photos.length > 0 && (
        <section className="mx-auto max-w-2xl px-6 py-8">
          <Reveal>
            <h2 className="text-center font-serif text-2xl">Bizning suratlar</h2>
          </Reveal>

          <div className="mt-8">
            <PhotoGallery photos={photos} alt={`${brideName} va ${groomName}`} />
          </div>
        </section>
      )}

      {/* Pul sovg'a */}
      {cardNumber && (
        <section className="mx-auto max-w-2xl px-6 py-8">
          <Reveal>
            <div className="rounded-2xl border border-[#e8dcc6] bg-white p-6 text-center shadow-sm">
              <h2 className="font-serif text-2xl">Sovg&apos;a uchun</h2>
              <p className="mt-2 text-sm text-[#6b6053]">
                Kelolmasangiz ham, e&apos;tiboringiz biz uchun qadrli.
              </p>

              <p className="mt-4 font-mono text-lg tracking-widest">{cardNumber}</p>
              {cardHolder && <p className="text-sm text-[#6b6053]">{cardHolder}</p>}

              <CopyButton
                value={cardNumber}
                label="Karta raqamini nusxalash"
                className="mt-4 rounded-lg border border-[#b98a3f] px-4 py-2 text-sm font-medium text-[#b98a3f] hover:bg-[#b98a3f] hover:text-white"
              />
            </div>
          </Reveal>
        </section>
      )}

      {/* Tilaklar */}
      <section className="mx-auto max-w-2xl px-6 py-8">
        <Reveal>
          <h2 className="text-center font-serif text-2xl">Tilaklar</h2>
          <p className="mt-2 text-center text-sm text-[#6b6053]">
            Yosh oilaga yaxshi so&apos;zlaringizni qoldiring.
          </p>

          <div className="mt-6">
            <WishesSection slug={slug} wishes={wishes} preview={preview} />
          </div>
        </Reveal>
      </section>

      {/* RSVP */}
      <section className="mx-auto max-w-2xl px-6 pb-20 pt-8 text-center">
        <Reveal>
          <h2 className="font-serif text-2xl">Kela olasizmi?</h2>
          <p className="mt-2 text-sm text-[#6b6053]">
            Iltimos, javobingizni bildiring — mehmonlar sonini aniqlashimizga
            yordam beradi.
          </p>

          {preview ? (
            <span className="mt-6 inline-block cursor-not-allowed rounded-lg bg-[#b98a3f]/50 px-6 py-3 font-medium text-white">
              Javob berish (namuna)
            </span>
          ) : (
            <Link
              href={`/i/${slug}/rsvp`}
              className="mt-6 inline-block rounded-lg bg-[#b98a3f] px-6 py-3 font-medium text-white hover:bg-[#a2762f]"
            >
              Javob berish
            </Link>
          )}
        </Reveal>
      </section>
    </div>
  );
}
