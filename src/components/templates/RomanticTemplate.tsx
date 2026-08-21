import { Countdown } from "@/components/invitation/Countdown";
import { InvitationShell } from "@/components/invitation/InvitationShell";
import { FloralSprig } from "@/components/invitation/Ornaments";
import { PhotoGallery } from "@/components/invitation/PhotoGallery";
import { Reveal } from "@/components/invitation/Reveal";
import { WishesSection } from "@/components/invitation/WishesSection";
import { EventsList } from "@/components/invitation/sections/EventsList";
import { GiftCard } from "@/components/invitation/sections/GiftCard";
import { RsvpCta } from "@/components/invitation/sections/RsvpCta";
import { SectionHeading } from "@/components/invitation/sections/SectionHeading";
import { EVENT_TYPE_LABELS, formatDate } from "@/lib/format";
import { ROMANTIC_THEME } from "./theme";
import type { TemplateProps } from "./types";

/**
 * Romantik — pushti-oq ranglar, gul shoxchalari, yumshoq burchaklar.
 */
export function RomanticTemplate({ invitation, preview = false }: TemplateProps) {
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
    <InvitationShell theme={ROMANTIC_THEME} musicUrl={musicUrl} preview={preview}>
      <header className="relative overflow-hidden px-5 pb-14 pt-16 text-center">
        <FloralSprig className="absolute -left-2 top-6 opacity-70" />
        <FloralSprig className="absolute -right-2 top-6 opacity-70" flip />

        <Reveal>
          <p
            className="text-[11px] uppercase tracking-[0.34em]"
            style={{ color: "var(--tpl-accent)" }}
          >
            {EVENT_TYPE_LABELS[eventType]} taklifnomasi
          </p>
        </Reveal>

        <Reveal delay={0.12}>
          <h1
            className="mx-auto mt-10 max-w-md text-[2.7rem] italic leading-[1.1] sm:text-[3.4rem]"
            style={{ fontFamily: "var(--tpl-display)" }}
          >
            {brideName}
            <span
              className="mx-3 not-italic"
              style={{ color: "var(--tpl-accent)" }}
            >
              &amp;
            </span>
            {groomName}
          </h1>
        </Reveal>

        <Reveal delay={0.22}>
          <div
            className="mx-auto mt-8 flex max-w-xs items-center gap-3"
            aria-hidden
          >
            <span
              className="h-px flex-1"
              style={{ backgroundColor: "var(--tpl-line)" }}
            />
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              style={{ color: "var(--tpl-accent)" }}
              fill="currentColor"
              opacity="0.75"
            >
              <path d="M12 21s-8-4.7-8-10a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 11c0 5.3-8 10-8 10Z" />
            </svg>
            <span
              className="h-px flex-1"
              style={{ backgroundColor: "var(--tpl-line)" }}
            />
          </div>

          {mainEvent && (
            <p
              className="mt-7 text-sm uppercase tracking-[0.22em]"
              style={{ color: "var(--tpl-soft)" }}
            >
              {formatDate(mainEvent.startsAt)}
            </p>
          )}

          <p
            className="mx-auto mt-6 max-w-sm whitespace-pre-line text-[15px] leading-relaxed"
            style={{ color: "var(--tpl-soft)" }}
          >
            {greeting ??
              "Bir-birimizga aytgan 'ha'imizni siz bilan birga\nnishonlashni istaymiz."}
          </p>
        </Reveal>

        {mainEvent && (
          <Reveal delay={0.34}>
            <div className="mt-11">
              <Countdown target={mainEvent.startsAt} />
            </div>
          </Reveal>
        )}
      </header>

      {photos.length > 0 && (
        <section className="mx-auto max-w-xl px-5 pb-6">
          <Reveal>
            <PhotoGallery photos={photos} alt={`${brideName} va ${groomName}`} />
          </Reveal>
        </section>
      )}

      {events.length > 0 && (
        <section className="mx-auto max-w-xl px-5 py-10">
          <Reveal>
            <SectionHeading title="Bizning kunimiz" />
          </Reveal>
          <div className="mt-9">
            <EventsList events={events} variant="card" />
          </div>
        </section>
      )}

      {cardNumber && (
        <section className="mx-auto max-w-xl px-5 py-10">
          <Reveal>
            <GiftCard
              cardNumber={cardNumber}
              cardHolder={cardHolder}
              note="Sizning borligingiz eng katta sovg'a. Xohlasangiz, kartaga ham qoldirsangiz bo'ladi."
            />
          </Reveal>
        </section>
      )}

      <section className="mx-auto max-w-xl px-5 py-10">
        <Reveal>
          <SectionHeading
            title="Tilaklar"
            subtitle="Bizga yaxshi so'zlaringizni yozib qoldiring."
          />
          <div className="mt-8">
            <WishesSection slug={slug} wishes={wishes} preview={preview} />
          </div>
        </Reveal>
      </section>

      <section className="relative mx-auto max-w-xl overflow-hidden px-5 pb-20 pt-8">
        <FloralSprig className="absolute -left-3 bottom-2 opacity-50" />
        <FloralSprig className="absolute -right-3 bottom-2 opacity-50" flip />

        <Reveal>
          <RsvpCta slug={slug} preview={preview} title="Kelasizmi?" />
        </Reveal>
      </section>
    </InvitationShell>
  );
}
