import { MapEmbed } from "@/components/invitation/MapEmbed";
import { Reveal } from "@/components/invitation/Reveal";
import { formatDate, formatTime } from "@/lib/format";
import type { InvitationEventView } from "@/components/templates/types";

type Props = {
  events: InvitationEventView[];
  /** "card" — chegaralangan kartalar, "line" — chiziq bilan ajratilgan ro'yxat */
  variant?: "card" | "line";
  showMap?: boolean;
};

export function EventsList({ events, variant = "card", showMap = true }: Props) {
  if (events.length === 0) return null;

  return (
    <div className={variant === "card" ? "space-y-4" : "space-y-10"}>
      {events.map((event, index) => (
        <Reveal key={event.id} delay={index * 0.08}>
          <article
            className={
              variant === "card"
                ? "p-6 sm:p-7"
                : "border-t pt-8 text-center first:border-t-0 first:pt-0"
            }
            style={
              variant === "card"
                ? {
                    backgroundColor: "var(--tpl-surface)",
                    border: "1px solid var(--tpl-line)",
                    borderRadius: "var(--tpl-radius)",
                  }
                : { borderColor: "var(--tpl-line)" }
            }
          >
            <h3
              className="text-xl"
              style={{ fontFamily: "var(--tpl-display)" }}
            >
              {event.title}
            </h3>

            <p
              className="mt-2 text-sm tracking-wide"
              style={{ color: "var(--tpl-accent)" }}
            >
              {formatDate(event.startsAt)} · {formatTime(event.startsAt)}
            </p>

            <p className="mt-3 font-medium">{event.locationName}</p>
            {event.address && (
              <p className="mt-1 text-sm" style={{ color: "var(--tpl-soft)" }}>
                {event.address}
              </p>
            )}

            {showMap && event.lat !== null && event.lng !== null && (
              <div className="mt-5 space-y-3">
                <MapEmbed
                  lat={event.lat}
                  lng={event.lng}
                  title={event.locationName}
                />

                <a
                  className="inline-block px-5 py-2.5 text-sm font-semibold transition hover:opacity-90"
                  style={{
                    backgroundColor: "var(--tpl-accent)",
                    color: "var(--tpl-on-accent)",
                    borderRadius: "var(--tpl-radius)",
                  }}
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
  );
}
