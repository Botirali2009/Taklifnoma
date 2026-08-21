import { Countdown } from "@/components/invitation/Countdown";
import { InvitationShell } from "@/components/invitation/InvitationShell";
import { PhotoGallery } from "@/components/invitation/PhotoGallery";
import { Reveal } from "@/components/invitation/Reveal";
import { WishesSection } from "@/components/invitation/WishesSection";
import { EventsList } from "@/components/invitation/sections/EventsList";
import { GiftCard } from "@/components/invitation/sections/GiftCard";
import { RsvpCta } from "@/components/invitation/sections/RsvpCta";
import { EVENT_TYPE_LABELS, formatDate, formatTime } from "@/lib/format";
import { MODERN_THEME } from "./theme";
import type { TemplateProps } from "./types";

/**
 * Zamonaviy — oq fon, yirik sans sarlavha, ingichka chiziqlar.
 * Bezaksiz, bo'shliq va tipografika hisobiga ishlaydi.
 */
export function ModernTemplate({ invitation, preview = false }: TemplateProps) {
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

  return (
    <InvitationShell theme={MODERN_THEME} musicUrl={musicUrl} preview={preview}>
      <header className="mx-auto max-w-2xl px-6 pb-14 pt-16 sm:pt-20">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.4em]">
            {EVENT_TYPE_LABELS[eventType]}
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <h1
            className="mt-10 text-[3.2rem] font-semibold uppercase leading-[0.94] tracking-[-0.03em] sm:text-[4.5rem]"
            style={{ fontFamily: "var(--tpl-display)" }}
          >
            {brideName}
            <br />
            <span style={{ color: "var(--tpl-soft)" }}>&</span> {groomName}
          </h1>
        </Reveal>

        <Reveal delay={0.2}>
          <div
            className="mt-10 flex flex-wrap items-baseline gap-x-8 gap-y-2 border-t pt-6 text-sm"
            style={{ borderColor: "var(--tpl-line)" }}
          >
            {mainEvent && (
              <>
                <span className="font-semibold uppercase tracking-[0.16em]">
                  {formatDate(mainEvent.startsAt)}
                </span>
                <span style={{ color: "var(--tpl-soft)" }}>
                  {formatTime(mainEvent.startsAt)} · {mainEvent.locationName}
                </span>
              </>
            )}
          </div>
        </Reveal>

        {greeting && (
          <Reveal delay={0.3}>
            <p
              className="mt-8 max-w-md whitespace-pre-line text-[15px] leading-relaxed"
              style={{ color: "var(--tpl-soft)" }}
            >
              {greeting}
            </p>
          </Reveal>
        )}
      </header>

      {cover && (
        <Reveal>
          <div className="mx-auto max-w-4xl px-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cover.url}
              alt={`${brideName} va ${groomName}`}
              className="h-[60vh] w-full object-cover"
            />
          </div>
        </Reveal>
      )}

      {mainEvent && (
        <section className="mx-auto max-w-2xl px-6 py-16">
          <Reveal>
            <Countdown target={mainEvent.startsAt} />
          </Reveal>
        </section>
      )}

      {events.length > 0 && (
        <section className="mx-auto max-w-2xl px-6 pb-16">
          <Reveal>
            <h2 className="text-[11px] uppercase tracking-[0.4em]">Dastur</h2>
          </Reveal>
          <div className="mt-10">
            <EventsList events={events} variant="line" />
          </div>
        </section>
      )}

      {photos.length > 1 && (
        <section className="mx-auto max-w-4xl px-6 pb-16">
          <Reveal>
            <h2 className="text-[11px] uppercase tracking-[0.4em]">Suratlar</h2>
          </Reveal>
          <div className="mt-8">
            <PhotoGallery
              photos={photos.slice(1)}
              alt={`${brideName} va ${groomName}`}
              layout="strip"
            />
          </div>
        </section>
      )}

      {cardNumber && (
        <section className="mx-auto max-w-2xl px-6 pb-16">
          <Reveal>
            <GiftCard cardNumber={cardNumber} cardHolder={cardHolder} />
          </Reveal>
        </section>
      )}

      <section className="mx-auto max-w-2xl px-6 pb-16">
        <Reveal>
          <h2 className="text-[11px] uppercase tracking-[0.4em]">Tilaklar</h2>
          <div className="mt-8">
            <WishesSection slug={slug} wishes={wishes} preview={preview} />
          </div>
        </Reveal>
      </section>

      <section
        className="border-t"
        style={{ borderColor: "var(--tpl-line)" }}
      >
        <div className="mx-auto max-w-2xl px-6 py-20">
          <Reveal>
            <RsvpCta slug={slug} preview={preview} label="Javobni yuborish" />
          </Reveal>
        </div>
      </section>
    </InvitationShell>
  );
}
