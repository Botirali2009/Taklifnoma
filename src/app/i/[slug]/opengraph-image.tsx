import { ImageResponse } from "next/og";
import { EVENT_TYPE_LABELS, formatDate, formatTime } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const alt = "Taklifnoma";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Havola Telegram/WhatsApp'da ulashilganda ko'rinadigan karta.
 * Shablon rangi emas, umumiy "qog'oz + oltin" uslubi ishlatiladi —
 * har qanday shablon uchun bir xil tanish ko'rinish beradi.
 */
export default async function Image({ params }: { params: { slug: string } }) {
  const invitation = await prisma.invitation.findUnique({
    where: { slug: params.slug },
    select: {
      brideName: true,
      groomName: true,
      eventType: true,
      events: {
        orderBy: { order: "asc" },
        take: 1,
        select: { startsAt: true, locationName: true },
      },
    },
  });

  const brideName = invitation?.brideName ?? "Taklifnoma";
  const groomName = invitation?.groomName ?? "";
  const event = invitation?.events[0];

  const dateLine = event
    ? `${formatDate(event.startsAt)} · ${formatTime(event.startsAt)}`
    : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fdfbf7",
          color: "#3a3128",
          padding: 48,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            border: "2px solid #e0d2b6",
            padding: 56,
          }}
        >
          <div
            style={{
              fontSize: 22,
              letterSpacing: 10,
              textTransform: "uppercase",
              color: "#a9762c",
            }}
          >
            {invitation
              ? `${EVENT_TYPE_LABELS[invitation.eventType]} taklifnomasi`
              : "Onlayn taklifnoma"}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: 44,
              fontSize: 82,
              lineHeight: 1.1,
              textAlign: "center",
            }}
          >
            <span>{brideName}</span>
            {groomName && (
              <>
                <span style={{ color: "#a9762c", margin: "0 24px" }}>&</span>
                <span>{groomName}</span>
              </>
            )}
          </div>

          <div
            style={{
              width: 120,
              height: 2,
              backgroundColor: "#a9762c",
              opacity: 0.7,
              marginTop: 40,
            }}
          />

          {dateLine && (
            <div style={{ marginTop: 36, fontSize: 30, color: "#6f6555" }}>
              {dateLine}
            </div>
          )}

          {event?.locationName && (
            <div style={{ marginTop: 12, fontSize: 26, color: "#8b8272" }}>
              {event.locationName}
            </div>
          )}
        </div>
      </div>
    ),
    size,
  );
}
