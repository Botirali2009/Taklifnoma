import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { InvitationPdf } from "@/lib/pdf/InvitationPdf";
import { EVENT_TYPE_LABELS, formatDate, formatTime } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { generateQrDataUrl } from "@/lib/qr";
import { getCurrentUser } from "@/lib/session";
import { appUrl } from "@/lib/url";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Chop etish uchun PDF: taklifnoma dizayni + QR kod */
export async function GET(
  _request: Request,
  { params }: { params: { invitationId: string } },
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Avval tizimga kiring." }, { status: 401 });
  }

  const invitation = await prisma.invitation.findFirst({
    where: {
      id: params.invitationId,
      ...(user.role === "ADMIN" ? {} : { userId: user.id }),
    },
    include: { events: { orderBy: { order: "asc" } } },
  });

  if (!invitation) {
    return NextResponse.json({ error: "Taklifnoma topilmadi." }, { status: 404 });
  }

  const publicUrl = appUrl(`/i/${invitation.slug}`);

  const buffer = await renderToBuffer(
    InvitationPdf({
      data: {
        brideName: invitation.brideName,
        groomName: invitation.groomName,
        eventTypeLabel: EVENT_TYPE_LABELS[invitation.eventType],
        greeting: invitation.greeting,
        events: invitation.events.map((event) => ({
          title: event.title,
          dateLabel: formatDate(event.startsAt),
          timeLabel: formatTime(event.startsAt),
          locationName: event.locationName,
          address: event.address,
        })),
        qrDataUrl: await generateQrDataUrl(publicUrl),
        publicUrl,
      },
    }),
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="taklifnoma-${invitation.slug}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
