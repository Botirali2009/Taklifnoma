import { Countdown } from "@/components/invitation/Countdown";
import { InvitationShell } from "@/components/invitation/InvitationShell";
import { GoldRule } from "@/components/invitation/Ornaments";
import { PhotoGallery } from "@/components/invitation/PhotoGallery";
import { Reveal } from "@/components/invitation/Reveal";
import { WishesSection } from "@/components/invitation/WishesSection";
import { EventsList } from "@/components/invitation/sections/EventsList";
import { GiftCard } from "@/components/invitation/sections/GiftCard";
import { RsvpCta } from "@/components/invitation/sections/RsvpCta";
import { EVENT_TYPE_LABELS, formatDate } from "@/lib/format";
import { LUX_THEME } from "./theme";
import type { TemplateProps } from "./types";

/**
 * Lux — to'q tun fonida shampan oltini, keng harf oralig'i, ingichka chiziqlar.
 */
export function LuxTemplate({ invitation, preview = false }: TemplateProps) {
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
    <InvitationShell theme={LUX_THEME} musicUrl={musicUrl} preview={preview}>
      <header className="px-5 pb-16 pt-20 text-center">
        <Reveal>
          <p
            className="text-[10px] uppercase tracking-[0.5em]"
            style={{ color: "var(--tpl-accent)" }}
          >
            {EVENT_TYPE_LABELS[eventType]}
          </p>
        </Reveal>

        <Reveal delay={0.12}>
          <h1
            className="mt-10 text-[2.5rem] leading-[1.15] tracking-[0.02em] sm:text-[3.4rem]"
            style={{ fontFamily: "var(--tpl-display)" }}
          >
            {brideName}
            <span
              className="mx-4 align-middle text-2xl"
              style={{ color: "var(--tpl-accent)" }}
            >
              &amp;
            </span>
            {groomName}
          </h1>
        </Reveal>

        <Reveal delay={0.24}>
          <GoldRule className="mt-10" />

          {mainEvent && (
            <p
              className="mt-8 text-sm uppercase tracking-[0.3em]"
              style={{ color: "var(--tpl-soft)" }}
            >
              {formatDate(mainEvent.startsAt)}
            </p>
          )}

          <p
            className="mx-auto mt-8 max-w-md whitespace-pre-line text-[15px] leading-loose"
            style={{ color: "var(--tpl-soft)" }}
          >
            {greeting ??
              "Hayotimizning eng go'zal kechasini biz bilan birga\nnishonlashingizni istaymiz."}
          </p>
        </Reveal>

        {mainEvent && (
          <Reveal delay={0.36}>
            <div className="mt-12">
              <Countdown target={mainEvent.startsAt} />
            </div>
          </Reveal>
        )}
      </header>

      {photos.length > 0 && (
        <section className="mx-auto max-w-3xl px-5 pb-16">
          <Reveal>
            <PhotoGallery
              photos={photos}
              alt={`${brideName} va ${groomName}`}
              layout="grid"
            />
          </Reveal>
        </section>
      )}

      {events.length > 0 && (
        <section className="mx-auto max-w-xl px-5 pb-16">
          <Reveal>
            <p
              className="text-center text-[10px] uppercase tracking-[0.5em]"
              style={{ color: "var(--tpl-accent)" }}
            >
              Dastur
            </p>
          </Reveal>
          <div className="mt-9">
            <EventsList events={events} variant="card" />
          </div>
        </section>
      )}

      {cardNumber && (
        <section className="mx-auto max-w-xl px-5 pb-16">
          <Reveal>
            <GiftCard cardNumber={cardNumber} cardHolder={cardHolder} />
          </Reveal>
        </section>
      )}

      <section className="mx-auto max-w-xl px-5 pb-16">
        <Reveal>
          <p
            className="text-center text-[10px] uppercase tracking-[0.5em]"
            style={{ color: "var(--tpl-accent)" }}
          >
            Tilaklar
          </p>
          <div className="mt-8">
            <WishesSection slug={slug} wishes={wishes} preview={preview} />
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-xl px-5 pb-24">
        <Reveal>
          <GoldRule className="mb-14" />
          <RsvpCta slug={slug} preview={preview} />
        </Reveal>
      </section>
    </InvitationShell>
  );
}
