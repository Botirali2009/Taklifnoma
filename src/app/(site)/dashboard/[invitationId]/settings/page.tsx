import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { SettingsForm } from "./SettingsForm";

export const dynamic = "force-dynamic";

type Props = { params: { invitationId: string } };

function toDateInput(date: Date): string {
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${mm}-${dd}`;
}

function toTimeInput(date: Date): string {
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

export default async function SettingsPage({ params }: Props) {
  const user = await requireUser();

  const invitation = await prisma.invitation.findFirst({
    where: { id: params.invitationId, userId: user.id },
    include: {
      events: { orderBy: { order: "asc" } },
      photos: { orderBy: { order: "asc" } },
    },
  });

  if (!invitation) notFound();

  return (
    <main className="mx-auto max-w-2xl px-5 py-12">
      <Link
        href={`/dashboard/${invitation.id}`}
        className="text-sm text-ink-faint transition hover:text-ink"
      >
        ← Boshqaruv paneli
      </Link>

      <h1 className="section-title mt-5">Sozlamalar</h1>
      <p className="mt-2 text-ink-soft">
        Taklifnoma ma&apos;lumotlarini tahrirlang yoki o&apos;chiring.
      </p>

      <SettingsForm
        invitation={{
          id: invitation.id,
          slug: invitation.slug,
          brideName: invitation.brideName,
          groomName: invitation.groomName,
          eventType: invitation.eventType,
          greeting: invitation.greeting ?? "",
          cardNumber: invitation.cardNumber ?? "",
          cardHolder: invitation.cardHolder ?? "",
          musicUrl: invitation.musicUrl,
          events: invitation.events.map((event) => ({
            id: event.id,
            title: event.title,
            date: toDateInput(event.startsAt),
            time: toTimeInput(event.startsAt),
            locationName: event.locationName,
            address: event.address ?? "",
            lat: event.lat !== null ? String(event.lat) : "",
            lng: event.lng !== null ? String(event.lng) : "",
          })),
          photos: invitation.photos.map((photo) => ({
            id: photo.id,
            url: photo.url,
          })),
        }}
      />
    </main>
  );
}
