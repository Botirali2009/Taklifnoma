import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyButton } from "@/components/ui/CopyButton";
import { ShareButtons } from "@/components/ui/ShareButtons";
import { GuestFilters } from "./GuestFilters";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { appUrl } from "@/lib/url";
import {
  EVENT_TYPE_LABELS,
  GUEST_SIDE_LABELS,
  RSVP_STATUS_LABELS,
  formatDateTime,
} from "@/lib/format";
import type { GuestSide, RsvpStatus } from "@/generated/prisma/enums";

export const dynamic = "force-dynamic";

type Props = {
  params: { invitationId: string };
  searchParams: { side?: string; status?: string; q?: string };
};

const SIDES: GuestSide[] = ["KELIN", "KUYOV", "UMUMIY"];
const STATUSES: RsvpStatus[] = ["KELADI", "KELMAYDI", "KUTILMOQDA"];

export default async function DashboardPage({ params, searchParams }: Props) {
  const user = await requireUser();

  const invitation = await prisma.invitation.findFirst({
    where: { id: params.invitationId, userId: user.id },
    include: {
      events: { orderBy: { order: "asc" } },
      _count: { select: { wishes: true } },
    },
  });

  if (!invitation) notFound();

  // Statistika — barcha mehmonlar bo'yicha (filtrdan qat'i nazar)
  const [all, coming, notComing, comingAggregate] = await Promise.all([
    prisma.guest.count({ where: { invitationId: invitation.id } }),
    prisma.guest.count({
      where: { invitationId: invitation.id, rsvpStatus: "KELADI" },
    }),
    prisma.guest.count({
      where: { invitationId: invitation.id, rsvpStatus: "KELMAYDI" },
    }),
    prisma.guest.aggregate({
      where: { invitationId: invitation.id, rsvpStatus: "KELADI" },
      _sum: { guestCount: true },
    }),
  ]);

  const side = SIDES.includes(searchParams.side as GuestSide)
    ? (searchParams.side as GuestSide)
    : undefined;
  const status = STATUSES.includes(searchParams.status as RsvpStatus)
    ? (searchParams.status as RsvpStatus)
    : undefined;
  const query = searchParams.q?.trim();

  const guests = await prisma.guest.findMany({
    where: {
      invitationId: invitation.id,
      ...(side ? { side } : {}),
      ...(status ? { rsvpStatus: status } : {}),
      ...(query
        ? { name: { contains: query, mode: "insensitive" as const } }
        : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  const publicUrl = appUrl(`/i/${invitation.slug}`);

  const stats = [
    { label: "Javoblar", value: all },
    { label: "Keladi", value: coming },
    { label: "Kelmaydi", value: notComing },
    { label: "Jami mehmon", value: comingAggregate._sum.guestCount ?? 0 },
    { label: "Ko'rishlar", value: invitation.viewCount },
    { label: "Tilaklar", value: invitation._count.wishes },
  ];

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <Link href="/my-invitations" className="text-sm text-neutral-500 hover:underline">
        ← Mening taklifnomalarim
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-neutral-900">
            {invitation.brideName} &amp; {invitation.groomName}
          </h1>
          <p className="mt-1 text-neutral-600">
            {EVENT_TYPE_LABELS[invitation.eventType]}
            {invitation.events[0] &&
              ` · ${formatDateTime(invitation.events[0].startsAt)}`}
          </p>
        </div>

        <Link
          href={`/dashboard/${invitation.id}/settings`}
          className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
        >
          Sozlamalar
        </Link>
      </div>

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
          <Link
            href={`/i/${invitation.slug}`}
            className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          >
            Ochish
          </Link>
        </div>

        <div className="mt-4">
          <ShareButtons
            url={publicUrl}
            text={`${invitation.brideName} va ${invitation.groomName} to'yiga taklifnoma`}
          />
        </div>
      </section>

      {/* Statistika */}
      <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
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

      {/* Mehmonlar */}
      <section className="mt-6 rounded-2xl border border-neutral-200 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-medium text-neutral-900">Mehmonlar</h2>
          <p className="text-sm text-neutral-500">
            {guests.length} ta yozuv ko&apos;rsatilmoqda
          </p>
        </div>

        <div className="mt-4">
          <GuestFilters
            invitationId={invitation.id}
            side={side}
            status={status}
            query={query ?? ""}
          />
        </div>

        {guests.length === 0 ? (
          <p className="mt-6 text-sm text-neutral-500">
            Mos yozuv topilmadi. Havolani mehmonlarga yuboring yoki filtrni
            o&apos;zgartiring.
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
                  <th className="py-2 pr-4">Telefon</th>
                  <th className="py-2">Vaqt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {guests.map((guest) => (
                  <tr key={guest.id}>
                    <td className="py-3 pr-4 font-medium text-neutral-900">
                      {guest.name}
                      {guest.note && (
                        <span className="block text-xs font-normal text-neutral-500">
                          {guest.note}
                        </span>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-neutral-600">
                      {GUEST_SIDE_LABELS[guest.side]}
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={
                          guest.rsvpStatus === "KELADI"
                            ? "rounded-full bg-green-50 px-2 py-1 text-xs text-green-700"
                            : guest.rsvpStatus === "KELMAYDI"
                              ? "rounded-full bg-red-50 px-2 py-1 text-xs text-red-700"
                              : "rounded-full bg-neutral-100 px-2 py-1 text-xs text-neutral-600"
                        }
                      >
                        {RSVP_STATUS_LABELS[guest.rsvpStatus]}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-neutral-600">{guest.guestCount}</td>
                    <td className="py-3 pr-4 text-neutral-600">
                      {guest.phone ?? "—"}
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
      </section>
    </main>
  );
}
