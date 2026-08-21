import { Countdown } from "@/components/invitation/Countdown";
import { InvitationShell } from "@/components/invitation/InvitationShell";
import { PatternBand } from "@/components/invitation/Ornaments";
import { PhotoGallery } from "@/components/invitation/PhotoGallery";
import { Reveal } from "@/components/invitation/Reveal";
import { WishesSection } from "@/components/invitation/WishesSection";
import { EventsList } from "@/components/invitation/sections/EventsList";
import { GiftCard } from "@/components/invitation/sections/GiftCard";
import { RsvpCta } from "@/components/invitation/sections/RsvpCta";
import { SectionHeading } from "@/components/invitation/sections/SectionHeading";
import { EVENT_TYPE_LABELS, formatDate } from "@/lib/format";
import { MILLIY_THEME } from "./theme";
import type { TemplateProps } from "./types";

/**
 * Milliy — zumrad va oltin, naqshli lentalar, ravoq shaklidagi suratlar.
 */
export function MilliyTemplate({ invitation, preview = false }: TemplateProps) {
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
    <InvitationShell theme={MILLIY_THEME} musicUrl={musicUrl} preview={preview}>
      <PatternBand />

      <header className="px-5 pb-12 pt-14 text-center">
        <Reveal>
          <p
            className="text-[11px] uppercase tracking-[0.32em]"
            style={{ color: "var(--tpl-accent)" }}
          >
            {EVENT_TYPE_LABELS[eventType]} taklifnomasi
          </p>
        </Reveal>

        <Reveal delay={0.12}>
          {/* Ravoq (toq) ichidagi ismlar */}
          <div
            className="mx-auto mt-9 max-w-md px-8 py-12"
            style={{
              backgroundColor: "var(--tpl-surface)",
              border: "1px solid var(--tpl-line)",
              borderRadius: "14rem 14rem 0.75rem 0.75rem",
            }}
          >
            <h1
              className="text-[2.4rem] leading-tight sm:text-[3rem]"
              style={{ fontFamily: "var(--tpl-display)" }}
            >
              {brideName}
              <span className="mx-2" style={{ color: "var(--tpl-accent)" }}>
                va
              </span>
              {groomName}
            </h1>

            {mainEvent && (
              <p
                className="mt-5 text-sm uppercase tracking-[0.18em]"
                style={{ color: "var(--tpl-accent)" }}
              >
                {formatDate(mainEvent.startsAt)}
              </p>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.24}>
          <p
            className="mx-auto mt-9 max-w-md whitespace-pre-line text-[15px] leading-relaxed"
            style={{ color: "var(--tpl-soft)" }}
          >
            {greeting ??
              "Farzandlarimiz to'yi munosabati bilan uyushtiriladigan\nquvonchli marosimga taklif etamiz."}
          </p>
        </Reveal>

        {mainEvent && (
          <Reveal delay={0.34}>
            <div className="mt-10">
              <Countdown target={mainEvent.startsAt} />
            </div>
          </Reveal>
        )}
      </header>

      <PatternBand className="opacity-70" />

      {events.length > 0 && (
        <section className="mx-auto max-w-xl px-5 py-12">
          <Reveal>
            <SectionHeading title="Marosim tartibi" />
          </Reveal>
          <div className="mt-9">
            <EventsList events={events} variant="card" />
          </div>
        </section>
      )}

      {photos.length > 0 && (
        <section className="mx-auto max-w-xl px-5 py-10">
          <Reveal>
            <SectionHeading title="Suratlar" />
          </Reveal>
          <div className="mt-9">
            <PhotoGallery
              photos={photos}
              alt={`${brideName} va ${groomName}`}
              layout="arch"
            />
          </div>
        </section>
      )}

      {cardNumber && (
        <section className="mx-auto max-w-xl px-5 py-10">
          <Reveal>
            <GiftCard
              cardNumber={cardNumber}
              cardHolder={cardHolder}
              title="Sovg'a uchun"
            />
          </Reveal>
        </section>
      )}

      <section className="mx-auto max-w-xl px-5 py-10">
        <Reveal>
          <SectionHeading
            title="Oq yo'l tilaklari"
            subtitle="Yosh oilaga yaxshi so'zlaringizni qoldiring."
          />
          <div className="mt-8">
            <WishesSection slug={slug} wishes={wishes} preview={preview} />
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-xl px-5 pb-16 pt-8">
        <Reveal>
          <RsvpCta slug={slug} preview={preview} title="Marosimga kela olasizmi?" />
        </Reveal>
      </section>

      <PatternBand />
    </InvitationShell>
  );
}
