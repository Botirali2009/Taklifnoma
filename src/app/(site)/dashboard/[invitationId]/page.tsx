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
    <main className="mx-auto max-w-5xl px-5 py-12">
      <Link
        href="/my-invitations"
        className="text-sm text-ink-faint transition hover:text-ink"
      >
        ← Mening taklifnomalarim
      </Link>

      <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-semibold tracking-tight">
            {invitation.brideName} &amp; {invitation.groomName}
          </h1>
          <p className="mt-2 text-ink-soft">
            {EVENT_TYPE_LABELS[invitation.eventType]}
            {invitation.events[0] &&
              ` · ${formatDateTime(invitation.events[0].startsAt)}`}
          </p>
        </div>

        <Link
          href={`/dashboard/${invitation.id}/settings`}
          className="btn-ghost btn-sm"
        >
          Sozlamalar
        </Link>
      </div>

      {/* Havola va ulashish */}
      <section className="card-pad mt-8">
        <h2 className="text-base font-semibold">Taklifnoma havolasi</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Shu havolani mehmonlarga yuboring yoki QR kodini chop eting.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <code className="rounded-lg bg-paper-sunk px-3.5 py-2.5 font-mono text-[13px] text-ink-soft">
            {publicUrl}
          </code>
          <CopyButton value={publicUrl} className="btn-ghost btn-sm" />
          <Link href={`/i/${invitation.slug}`} className="btn-ghost btn-sm">
            Ochish
          </Link>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <a
            href={`/api/invitations/${invitation.id}/qr`}
            className="btn-ghost btn-sm"
          >
            QR kod (PNG)
          </a>
          <a
            href={`/api/invitations/${invitation.id}/pdf`}
            className="btn-ghost btn-sm"
          >
            Chop etish uchun PDF
          </a>
        </div>

        <div className="mt-5 border-t border-line pt-5">
          <ShareButtons
            url={publicUrl}
            text={`${invitation.brideName} va ${invitation.groomName} to'yiga taklifnoma`}
          />
        </div>
      </section>

      {/* Statistika */}
      <section className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((stat) => (
          <div key={stat.label} className="card px-4 py-5 text-center">
            <p className="font-display text-3xl font-semibold tabular-nums">
              {stat.value}
            </p>
            <p className="mt-1 text-[11px] uppercase tracking-wide text-ink-faint">
              {stat.label}
            </p>
          </div>
        ))}
      </section>

      {/* Mehmonlar */}
      <section className="card-pad mt-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-semibold">Mehmonlar</h2>
          <p className="text-sm text-ink-faint">
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
          <p className="mt-6 rounded-lg border border-dashed border-line-strong px-4 py-8 text-center text-sm text-ink-faint">
            Mos yozuv topilmadi. Havolani mehmonlarga yuboring yoki filtrni
            o&apos;zgartiring.
          </p>
        ) : (
          <div className="table-wrap mt-4">
            <table className="table">
              <thead>
                <tr>
                  <th>Ism</th>
                  <th>Tomon</th>
                  <th>Javob</th>
                  <th>Kishi</th>
                  <th>Telefon</th>
                  <th>Vaqt</th>
                </tr>
              </thead>
              <tbody>
                {guests.map((guest) => (
                  <tr key={guest.id}>
                    <td className="font-medium">
                      {guest.name}
                      {guest.note && (
                        <span className="mt-0.5 block text-xs font-normal text-ink-faint">
                          {guest.note}
                        </span>
                      )}
                    </td>
                    <td className="text-ink-soft">
                      {GUEST_SIDE_LABELS[guest.side]}
                    </td>
                    <td>
                      <span
                        className={
                          guest.rsvpStatus === "KELADI"
                            ? "pill-good"
                            : guest.rsvpStatus === "KELMAYDI"
                              ? "pill-bad"
                              : "pill-wait"
                        }
                      >
                        {RSVP_STATUS_LABELS[guest.rsvpStatus]}
                      </span>
                    </td>
                    <td className="tabular-nums text-ink-soft">{guest.guestCount}</td>
                    <td className="text-ink-soft">{guest.phone ?? "—"}</td>
                    <td className="whitespace-nowrap text-ink-faint">
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
