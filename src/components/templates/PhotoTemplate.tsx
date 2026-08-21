import { Countdown } from "@/components/invitation/Countdown";
import { InvitationShell } from "@/components/invitation/InvitationShell";
import { PhotoGallery } from "@/components/invitation/PhotoGallery";
import { Reveal } from "@/components/invitation/Reveal";
import { WishesSection } from "@/components/invitation/WishesSection";
import { EventsList } from "@/components/invitation/sections/EventsList";
import { GiftCard } from "@/components/invitation/sections/GiftCard";
import { RsvpCta } from "@/components/invitation/sections/RsvpCta";
import { EVENT_TYPE_LABELS, formatDate, formatTime } from "@/lib/format";
import { PHOTO_THEME } from "./theme";
import type { TemplateProps } from "./types";

/**
 * Foto — muqova surat butun ekranni egallaydi, matn surat ustidan tushadi.
 * Surat yo'q bo'lsa, to'q fon bilan ham chiroyli ko'rinadi.
 */
export function PhotoTemplate({ invitation, preview = false }: TemplateProps) {
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
  const cover = photos[0];
  const rest = photos.slice(1);

  return (
    <InvitationShell theme={PHOTO_THEME} musicUrl={musicUrl} preview={preview}>
      {/* Muqova */}
      <header className="relative flex min-h-[88vh] items-end overflow-hidden">
        {cover && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cover.url}
              alt={`${brideName} va ${groomName}`}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(10,10,10,.45) 0%, rgba(10,10,10,.15) 35%, rgba(10,10,10,.85) 100%)",
              }}
            />
          </>
        )}

        <div className="relative w-full px-6 pb-14">
          <div className="mx-auto max-w-2xl">
            <Reveal>
              <p className="text-[11px] uppercase tracking-[0.4em] opacity-80">
                {EVENT_TYPE_LABELS[eventType]}
              </p>
            </Reveal>

            <Reveal delay={0.12}>
              <h1
                className="mt-5 text-[3rem] font-semibold leading-[0.98] tracking-[-0.02em] sm:text-[4.2rem]"
                style={{ fontFamily: "var(--tpl-display)" }}
              >
                {brideName}
                <br />
                {groomName}
              </h1>
            </Reveal>

            {mainEvent && (
              <Reveal delay={0.24}>
                <p className="mt-6 text-sm uppercase tracking-[0.22em] opacity-85">
                  {formatDate(mainEvent.startsAt)} · {formatTime(mainEvent.startsAt)}
                </p>
                <p className="mt-1.5 text-sm opacity-70">
                  {mainEvent.locationName}
                </p>
              </Reveal>
            )}
          </div>
        </div>
      </header>

      {greeting && (
        <section className="mx-auto max-w-2xl px-6 py-16">
          <Reveal>
            <p
              className="whitespace-pre-line text-center text-lg leading-relaxed"
              style={{ color: "var(--tpl-soft)" }}
            >
              {greeting}
            </p>
          </Reveal>
        </section>
      )}

      {mainEvent && (
        <section className="mx-auto max-w-2xl px-6 pb-16">
          <Reveal>
            <Countdown target={mainEvent.startsAt} />
          </Reveal>
        </section>
      )}

      {events.length > 0 && (
        <section className="mx-auto max-w-xl px-6 pb-16">
          <Reveal>
            <p className="text-center text-[11px] uppercase tracking-[0.4em] opacity-70">
              Dastur
            </p>
          </Reveal>
          <div className="mt-8">
            <EventsList events={events} variant="card" />
          </div>
        </section>
      )}

      {rest.length > 0 && (
        <section className="mx-auto max-w-4xl px-6 pb-16">
          <Reveal>
            <PhotoGallery
              photos={rest}
              alt={`${brideName} va ${groomName}`}
              layout="strip"
            />
          </Reveal>
        </section>
      )}

      {cardNumber && (
        <section className="mx-auto max-w-xl px-6 pb-16">
          <Reveal>
            <GiftCard cardNumber={cardNumber} cardHolder={cardHolder} />
          </Reveal>
        </section>
      )}

      <section className="mx-auto max-w-xl px-6 pb-16">
        <Reveal>
          <p className="text-center text-[11px] uppercase tracking-[0.4em] opacity-70">
            Tilaklar
          </p>
          <div className="mt-8">
            <WishesSection slug={slug} wishes={wishes} preview={preview} />
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-xl px-6 pb-24">
        <Reveal>
          <RsvpCta slug={slug} preview={preview} />
        </Reveal>
      </section>
    </InvitationShell>
  );
}
