import Link from "next/link";
import { notFound } from "next/navigation";
import { ShareButtons } from "@/components/ui/ShareButtons";
import { CopyButton } from "@/components/ui/CopyButton";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import {
  EVENT_TYPE_LABELS,
  GUEST_SIDE_LABELS,
  RSVP_STATUS_LABELS,
  formatDateTime,
} from "@/lib/format";

export const dynamic = "force-dynamic";

type Props = { params: { invitationId: string } };

function appUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `${base.replace(/\/$/, "")}${path}`;
}

export default async function DashboardPage({ params }: Props) {
  const user = await requireUser();

  const invitation = await prisma.invitation.findFirst({
    where: { id: params.invitationId, userId: user.id },
    include: {
      events: { orderBy: { order: "asc" } },
      guests: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!invitation) notFound();

  const coming = invitation.guests.filter((g) => g.rsvpStatus === "KELADI");
  const notComing = invitation.guests.filter((g) => g.rsvpStatus === "KELMAYDI");
  const totalPeople = coming.reduce((sum, guest) => sum + guest.guestCount, 0);
  const publicUrl = appUrl(`/i/${invitation.slug}`);

  const stats = [
    { label: "Javoblar", value: invitation.guests.length },
    { label: "Keladi", value: coming.length },
    { label: "Kelmaydi", value: notComing.length },
    { label: "Jami mehmon", value: totalPeople },
    { label: "Ko'rishlar", value: invitation.viewCount },
  ];

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-16">
      <Link href="/my-invitations" className="text-sm text-neutral-500 hover:underline">
        ← Mening taklifnomalarim
      </Link>

      <h1 className="mt-4 text-3xl font-semibold text-neutral-900">
        {invitation.brideName} &amp; {invitation.groomName}
      </h1>
      <p className="mt-1 text-neutral-600">
        {EVENT_TYPE_LABELS[invitation.eventType]}
        {invitation.events[0] &&
          ` · ${formatDateTime(invitation.events[0].startsAt)}`}
      </p>

      {/* Havola va ulashish */}
      <section className="mt-8 rounded-2xl border border-neutral-200 p-6">
        <h2 className="font-medium text-neutral-900">Taklifnoma havolasi</h2>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <code className="rounded-lg bg-neutral-100 px-3 py-2 text-sm">
            {publicUrl}
          </code>
          <CopyButton
            value={publicUrl}
            className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          />
        </div>

        <div className="mt-4">
          <ShareButtons
            url={publicUrl}
            text={`${invitation.brideName} va ${invitation.groomName} to'yiga taklifnoma`}
          />
        </div>

        {/* TODO (Bosqich 2): QR kod yuklab olish va PDF chop etish varianti */}
      </section>

      {/* Statistika */}
      <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-neutral-200 p-4 text-center"
          >
            <p className="text-2xl font-semibold text-neutral-900">{stat.value}</p>
            <p className="mt-1 text-xs text-neutral-500">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Mehmonlar ro'yxati */}
      <section className="mt-6 rounded-2xl border border-neutral-200 p-6">
        <h2 className="font-medium text-neutral-900">Mehmonlar</h2>

        {invitation.guests.length === 0 ? (
          <p className="mt-4 text-sm text-neutral-500">
            Hozircha javob yo&apos;q. Havolani mehmonlarga yuboring.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-neutral-500">
                <tr>
                  <th className="py-2 pr-4">Ism</th>
                  <th className="py-2 pr-4">Tomon</th>
                  <th className="py-2 pr-4">Javob</th>
                  <th className="py-2 pr-4">Kishi</th>
                  <th className="py-2">Vaqt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {invitation.guests.map((guest) => (
                  <tr key={guest.id}>
                    <td className="py-3 pr-4 font-medium text-neutral-900">
                      {guest.name}
                    </td>
                    <td className="py-3 pr-4 text-neutral-600">
                      {GUEST_SIDE_LABELS[guest.side]}
                    </td>
                    <td className="py-3 pr-4 text-neutral-600">
                      {RSVP_STATUS_LABELS[guest.rsvpStatus]}
                    </td>
                    <td className="py-3 pr-4 text-neutral-600">
                      {guest.guestCount}
                    </td>
                    <td className="py-3 text-neutral-500">
                      {guest.respondedAt ? formatDateTime(guest.respondedAt) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TODO (Bosqich 2): filter/qidiruv, guruhlash, eksport */}
      </section>
    </main>
  );
}
