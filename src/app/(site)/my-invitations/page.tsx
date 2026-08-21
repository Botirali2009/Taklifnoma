import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { EVENT_TYPE_LABELS, formatDateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Mening taklifnomalarim — Taklifnoma",
};

export default async function MyInvitationsPage() {
  const user = await requireUser();

  const invitations = await prisma.invitation.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      events: { orderBy: { order: "asc" }, take: 1 },
      photos: { orderBy: { order: "asc" }, take: 1 },
      template: { select: { name: true } },
    },
  });

  // Har bir taklifnoma bo'yicha RSVP qisqa statistikasi
  const guestStats = await prisma.guest.groupBy({
    by: ["invitationId", "rsvpStatus"],
    where: { invitationId: { in: invitations.map((item) => item.id) } },
    _count: { _all: true },
    _sum: { guestCount: true },
  });

  function statsFor(invitationId: string) {
    const rows = guestStats.filter((row) => row.invitationId === invitationId);
    const coming = rows.find((row) => row.rsvpStatus === "KELADI");
    const total = rows.reduce((sum, row) => sum + row._count._all, 0);

    return {
      answers: total,
      coming: coming?._count._all ?? 0,
      people: coming?._sum.guestCount ?? 0,
    };
  }

  return (
    <main className="mx-auto max-w-5xl px-5 py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Sizning ishlaringiz</p>
          <h1 className="section-title mt-3">Mening taklifnomalarim</h1>
        </div>

        <Link href="/templates" className="btn-brass btn-sm">
          Yangi yaratish
        </Link>
      </div>

      {invitations.length === 0 ? (
        <div className="mt-12 rounded-card border border-dashed border-line-strong p-12 text-center">
          <p className="font-display text-2xl">Hozircha taklifnoma yo&apos;q</p>
          <p className="mx-auto mt-2 max-w-prose text-sm text-ink-soft">
            Shablon tanlab birinchisini yarating — bir necha daqiqada tayyor
            bo&apos;ladi.
          </p>
          <Link href="/templates" className="btn-brass btn-sm mt-6">
            Shablon tanlash
          </Link>
        </div>
      ) : (
        <ul className="mt-12 grid gap-5 sm:grid-cols-2">
          {invitations.map((invitation) => {
            const event = invitation.events[0];
            const cover = invitation.photos[0];
            const stats = statsFor(invitation.id);

            return (
              <li key={invitation.id} className="card overflow-hidden">
                <div className="flex h-40 items-center justify-center bg-paper-sunk">
                  {cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={cover.url}
                      alt={`${invitation.brideName} & ${invitation.groomName}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="font-display text-2xl text-ink-faint">
                      {invitation.brideName} &amp; {invitation.groomName}
                    </span>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-display text-xl font-semibold">
                        {invitation.brideName} &amp; {invitation.groomName}
                      </h2>
                      <p className="mt-1 text-sm text-ink-soft">
                        {EVENT_TYPE_LABELS[invitation.eventType]}
                        {event && ` · ${formatDateTime(event.startsAt)}`}
                      </p>
                    </div>

                    <span className="pill-neutral shrink-0">
                      {invitation.template.name}
                    </span>
                  </div>

                  <dl className="mt-5 grid grid-cols-3 gap-2 text-center">
                    {[
                      ["Javob", stats.answers],
                      ["Keladi", stats.coming],
                      ["Mehmon", stats.people],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="rounded-lg border border-line bg-paper py-2.5"
                      >
                        <dt className="text-[11px] uppercase tracking-wide text-ink-faint">
                          {label}
                        </dt>
                        <dd className="mt-0.5 text-xl font-semibold tabular-nums">
                          {value}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <Link
                      href={`/dashboard/${invitation.id}`}
                      className="btn-primary btn-sm"
                    >
                      Boshqaruv
                    </Link>
                    <Link
                      href={`/dashboard/${invitation.id}/settings`}
                      className="btn-ghost btn-sm"
                    >
                      Tahrirlash
                    </Link>
                    <Link href={`/i/${invitation.slug}`} className="btn-ghost btn-sm">
                      Ko&apos;rish
                    </Link>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
