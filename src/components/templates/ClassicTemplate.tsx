import { Countdown } from "@/components/invitation/Countdown";
import { InvitationShell } from "@/components/invitation/InvitationShell";
import { CornerFlourish, DiamondDivider } from "@/components/invitation/Ornaments";
import { PhotoGallery } from "@/components/invitation/PhotoGallery";
import { Reveal } from "@/components/invitation/Reveal";
import { WishesSection } from "@/components/invitation/WishesSection";
import { EventsList } from "@/components/invitation/sections/EventsList";
import { GiftCard } from "@/components/invitation/sections/GiftCard";
import { RsvpCta } from "@/components/invitation/sections/RsvpCta";
import { SectionHeading } from "@/components/invitation/sections/SectionHeading";
import { EVENT_TYPE_LABELS, formatDate } from "@/lib/format";
import { CLASSIC_THEME } from "./theme";
import type { TemplateProps } from "./types";

/**
 * Klassik — fil suyagi rangidagi qog'oz, oltin bezaklar, ramka.
 * An'anaviy to'y taklifnomasi ko'rinishi.
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
    <InvitationShell theme={CLASSIC_THEME} musicUrl={musicUrl} preview={preview}>
      {/* Sarlavha — ichki ramka bilan */}
      <header className="px-5 pb-12 pt-10">
        <div
          className="relative mx-auto max-w-xl px-6 py-14 text-center sm:px-10 sm:py-16"
          style={{ border: "1px solid var(--tpl-line)" }}
        >
          <CornerFlourish className="absolute left-3 top-3" />
          <CornerFlourish className="absolute right-3 top-3" flip />

          <Reveal>
            <p
              className="text-[11px] uppercase tracking-[0.36em]"
              style={{ color: "var(--tpl-accent)" }}
            >
              {EVENT_TYPE_LABELS[eventType]} taklifnomasi
            </p>
          </Reveal>

          <Reveal delay={0.12}>
            <h1
              className="mt-8 text-[2.6rem] leading-[1.08] sm:text-5xl"
              style={{ fontFamily: "var(--tpl-display)" }}
            >
              {brideName}
              <span className="mx-3" style={{ color: "var(--tpl-accent)" }}>
                &amp;
              </span>
              {groomName}
            </h1>
          </Reveal>

          <Reveal delay={0.24}>
            <DiamondDivider className="mt-8" />

            {mainEvent && (
              <p
                className="mt-6 text-sm uppercase tracking-[0.2em]"
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
                "Sizni oilamizning quvonchli kunida ko'rishdan mamnun bo'lamiz."}
            </p>
          </Reveal>

          {mainEvent && (
            <Reveal delay={0.36}>
              <div className="mt-10">
                <Countdown target={mainEvent.startsAt} />
              </div>
            </Reveal>
          )}
        </div>
      </header>

      {events.length > 0 && (
        <section className="mx-auto max-w-xl px-5 py-10">
          <Reveal>
            <SectionHeading title="Tadbir dasturi" />
          </Reveal>
          <div className="mt-9">
            <EventsList events={events} variant="card" />
          </div>
        </section>
      )}

      {photos.length > 0 && (
        <section className="mx-auto max-w-xl px-5 py-10">
          <Reveal>
            <SectionHeading title="Bizning suratlar" />
          </Reveal>
          <div className="mt-9">
            <PhotoGallery photos={photos} alt={`${brideName} va ${groomName}`} />
          </div>
        </section>
      )}

      {cardNumber && (
        <section className="mx-auto max-w-xl px-5 py-10">
          <Reveal>
            <GiftCard cardNumber={cardNumber} cardHolder={cardHolder} />
          </Reveal>
        </section>
      )}

      <section className="mx-auto max-w-xl px-5 py-10">
        <Reveal>
          <SectionHeading
            title="Tilaklar"
            subtitle="Yosh oilaga yaxshi so'zlaringizni qoldiring."
          />
          <div className="mt-8">
            <WishesSection slug={slug} wishes={wishes} preview={preview} />
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-xl px-5 pb-20 pt-10">
        <Reveal>
          <RsvpCta slug={slug} preview={preview} />
        </Reveal>
      </section>
    </InvitationShell>
  );
}
