import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateQrPng } from "@/lib/qr";
import { getCurrentUser } from "@/lib/session";
import { appUrl } from "@/lib/url";

export const runtime = "nodejs";

/** Taklifnoma havolasining QR kodi (PNG) */
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
    select: { slug: true, brideName: true, groomName: true },
  });

  if (!invitation) {
    return NextResponse.json({ error: "Taklifnoma topilmadi." }, { status: 404 });
  }

  const png = await generateQrPng(appUrl(`/i/${invitation.slug}`));
  const fileName = `qr-${invitation.slug}.png`;

  return new NextResponse(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "no-store",
    },
  });
}
