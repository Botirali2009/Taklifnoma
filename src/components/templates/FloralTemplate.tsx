import { Countdown } from "@/components/invitation/Countdown";
import { InvitationShell } from "@/components/invitation/InvitationShell";
import { PhotoGallery } from "@/components/invitation/PhotoGallery";
import { Reveal } from "@/components/invitation/Reveal";
import { WishesSection } from "@/components/invitation/WishesSection";
import {
  CornerBouquet,
  FloralBand,
  OrnamentDivider,
} from "@/components/invitation/art/Compositions";
import type { ArtPalette } from "@/components/invitation/art/palettes";
import { FallingPetals } from "@/components/invitation/motion/FallingPetals";
import { InvitationOpener } from "@/components/invitation/motion/InvitationOpener";
import { ShimmerText } from "@/components/invitation/motion/ShimmerText";
import { Sway } from "@/components/invitation/motion/Sway";
import { EventsList } from "@/components/invitation/sections/EventsList";
import { GiftCard } from "@/components/invitation/sections/GiftCard";
import { RsvpCta } from "@/components/invitation/sections/RsvpCta";
import { EVENT_TYPE_LABELS, formatDate } from "@/lib/format";
import type { TemplateTheme } from "./theme";
import type { TemplateProps } from "./types";

type FloralConfig = {
  theme: TemplateTheme;
  art: ArtPalette;
  /** Ismlardagi metall tovlanish ranglari */
  shimmer: { from: string; via: string; to: string };
  defaultGreeting: string;
  /** Fonda yumshoq yorug'lik dog'lari (to'q shablonlar uchun) */
  glow?: string;
  idPrefix: string;
};

/**
 * Gulli premium shablonlarning umumiy asosi.
 * Oltin bog' va Tungi bog' shundan faqat rang, shrift va bezak palitrasi
 * bilan farq qiladi — tuzilishi va animatsiyasi bir xil.
 */
export function FloralTemplate({
  invitation,
  preview = false,
  config,
}: TemplateProps & { config: FloralConfig }) {
  const { theme, art, shimmer, defaultGreeting, glow, idPrefix } = config;

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
  const initials = `${brideName.charAt(0)} & ${groomName.charAt(0)}`.toUpperCase();

  return (
    <InvitationShell
      theme={theme}
      musicUrl={musicUrl}
      preview={preview}
      className="relative overflow-hidden"
    >
      {glow && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: glow }}
          aria-hidden
        />
      )}

      <FallingPetals color={art.mid} opacity={0.32} count={11} />

      <InvitationOpener
        brideName={brideName}
        groomName={groomName}
        bg={theme.bg}
        ink={theme.ink}
        accent={theme.accent}
        displayFont={theme.displayFont}
        musicUrl={musicUrl}
        disabled={preview}
        ornament={
          <FloralBand
            palette={art}
            id={`${idPrefix}-op`}
            className="h-24 w-72"
          />
        }
      >
        {/* Ichki oltin ramka — butun taklifnomani o'rab turadi */}
        <div className="relative px-3 py-3 sm:px-5 sm:py-5">
          <div
            className="pointer-events-none absolute inset-3 sm:inset-5"
            style={{
              border: `1px solid ${art.mid}`,
              opacity: 0.55,
            }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-[18px] sm:inset-[26px]"
            style={{
              border: `1px solid ${art.mid}`,
              opacity: 0.28,
            }}
            aria-hidden
          />

          <div className="relative overflow-hidden">
            {/* Sarlavha */}
            <header className="relative px-4 pb-16 pt-16">
              <Sway className="pointer-events-none absolute -left-16 -top-14 w-64 sm:-left-10 sm:w-80">
                <CornerBouquet
                  palette={art}
                  id={`${idPrefix}-tl`}
                  className="h-full w-full"
                />
              </Sway>

              <Sway
                className="pointer-events-none absolute -right-16 -top-10 w-52 sm:-right-8 sm:w-64"
                delay={1.6}
                amount={1.1}
              >
                <CornerBouquet
                  palette={art}
                  id={`${idPrefix}-tr`}
                  className="h-full w-full -scale-x-100"
                />
              </Sway>

              <div className="relative mx-auto max-w-md pt-24 text-center">
                {/* Monogramma */}
                <Reveal>
                  <div
                    className="mx-auto flex h-16 w-16 items-center justify-center rounded-full"
                    style={{
                      border: `1px solid ${art.mid}`,
                      color: theme.accent,
                      fontFamily: theme.displayFont,
                      fontSize: "1.15rem",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {initials}
                  </div>
                </Reveal>

                <Reveal delay={0.1}>
                  <p
                    className="mt-7 text-[10px] uppercase tracking-[0.44em]"
                    style={{ color: theme.accent }}
                  >
                    {EVENT_TYPE_LABELS[eventType]} taklifnomasi
                  </p>
                </Reveal>

                <Reveal delay={0.22}>
                  <h1
                    className="mt-7 text-[2.9rem] leading-[1.06] sm:text-[3.6rem]"
                    style={{ fontFamily: theme.displayFont }}
                  >
                    <ShimmerText
                      from={shimmer.from}
                      via={shimmer.via}
                      to={shimmer.to}
                      className="inline-block"
                    >
                      {brideName}
                    </ShimmerText>
                    <span
                      className="mx-3 align-middle text-3xl"
                      style={{ color: art.mid }}
                    >
                      &amp;
                    </span>
                    <ShimmerText
                      from={shimmer.from}
                      via={shimmer.via}
                      to={shimmer.to}
                      className="inline-block"
                    >
                      {groomName}
                    </ShimmerText>
                  </h1>
                </Reveal>

                <Reveal delay={0.34}>
                  <OrnamentDivider
                    palette={art}
                    id={`${idPrefix}-hd`}
                    className="mx-auto mt-7 h-8 w-60"
                  />

                  {mainEvent && (
                    <p
                      className="mt-6 text-[13px] uppercase tracking-[0.28em]"
                      style={{ color: theme.soft }}
                    >
                      {formatDate(mainEvent.startsAt)}
                    </p>
                  )}

                  <p
                    className="mx-auto mt-7 max-w-sm whitespace-pre-line text-[15px] leading-relaxed"
                    style={{ color: theme.soft }}
                  >
                    {greeting ?? defaultGreeting}
                  </p>
                </Reveal>

                {mainEvent && (
                  <Reveal delay={0.48}>
                    <div className="mt-10 pb-8">
                      <Countdown target={mainEvent.startsAt} />
                    </div>
                  </Reveal>
                )}
              </div>
            </header>

            {/* Tadbirlar */}
            {events.length > 0 && (
              <section className="relative mx-auto max-w-md px-6 py-8">
                <Reveal>
                  <FloralBand
                    palette={art}
                    id={`${idPrefix}-ev`}
                    className="mx-auto h-16 w-56"
                  />
                  <h2
                    className="mt-1 text-center text-[1.9rem]"
                    style={{ fontFamily: theme.displayFont }}
                  >
                    Tadbir dasturi
                  </h2>
                </Reveal>

                <div className="mt-8">
                  <EventsList events={events} variant="card" />
                </div>
              </section>
            )}

            {/* Suratlar */}
            {photos.length > 0 && (
              <section className="relative mx-auto max-w-md px-6 py-8">
                <Reveal>
                  <h2
                    className="text-center text-[1.9rem]"
                    style={{ fontFamily: theme.displayFont }}
                  >
                    Bizning suratlar
                  </h2>
                  <OrnamentDivider
                    palette={art}
                    id={`${idPrefix}-ph`}
                    className="mx-auto mt-3 h-7 w-48"
                  />
                </Reveal>

                <div className="mt-7">
                  <PhotoGallery
                    photos={photos}
                    alt={`${brideName} va ${groomName}`}
                    layout="arch"
                  />
                </div>
              </section>
            )}

            {/* Sovg'a */}
            {cardNumber && (
              <section className="relative mx-auto max-w-md px-6 py-8">
                <Reveal>
                  <GiftCard cardNumber={cardNumber} cardHolder={cardHolder} />
                </Reveal>
              </section>
            )}

            {/* Tilaklar */}
            <section className="relative mx-auto max-w-md px-6 py-8">
              <Reveal>
                <h2
                  className="text-center text-[1.9rem]"
                  style={{ fontFamily: theme.displayFont }}
                >
                  Tilaklar
                </h2>
                <OrnamentDivider
                  palette={art}
                  id={`${idPrefix}-wi`}
                  className="mx-auto mt-3 h-7 w-48"
                />
                <div className="mt-7">
                  <WishesSection slug={slug} wishes={wishes} preview={preview} />
                </div>
              </Reveal>
            </section>

            {/* RSVP + pastki guldastalar */}
            <section className="relative px-4 pb-24 pt-10">
              <Sway className="pointer-events-none absolute -left-16 bottom-0 w-56 sm:-left-8 sm:w-64">
                <CornerBouquet
                  palette={art}
                  id={`${idPrefix}-bl`}
                  className="h-full w-full -scale-y-100"
                />
              </Sway>

              <Sway
                className="pointer-events-none absolute -right-16 bottom-4 w-48 sm:-right-8 sm:w-56"
                delay={1.2}
              >
                <CornerBouquet
                  palette={art}
                  id={`${idPrefix}-br`}
                  className="h-full w-full rotate-180"
                />
              </Sway>

              <div className="relative mx-auto max-w-md pb-16">
                <Reveal>
                  <RsvpCta slug={slug} preview={preview} />
                </Reveal>
              </div>
            </section>
          </div>
        </div>
      </InvitationOpener>
    </InvitationShell>
  );
}
