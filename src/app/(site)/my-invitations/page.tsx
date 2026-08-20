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
    <main className="mx-auto max-w-4xl px-6 py-16">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-semibold text-neutral-900">
          Mening taklifnomalarim
        </h1>

        <Link
          href="/templates"
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
        >
          Yangi yaratish
        </Link>
      </div>

      {invitations.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-neutral-300 p-10 text-center text-neutral-500">
          Hozircha taklifnoma yo&apos;q. Shablon tanlab birinchisini yarating.
        </p>
      ) : (
        <ul className="mt-10 grid gap-5 sm:grid-cols-2">
          {invitations.map((invitation) => {
            const event = invitation.events[0];
            const cover = invitation.photos[0];
            const stats = statsFor(invitation.id);

            return (
              <li
                key={invitation.id}
                className="overflow-hidden rounded-2xl border border-neutral-200"
              >
                <div className="flex h-36 items-center justify-center bg-neutral-100">
                  {cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={cover.url}
                      alt={`${invitation.brideName} & ${invitation.groomName}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="font-serif text-2xl text-neutral-400">
                      {invitation.brideName} &amp; {invitation.groomName}
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-medium text-neutral-900">
                        {invitation.brideName} &amp; {invitation.groomName}
                      </h2>
                      <p className="mt-1 text-sm text-neutral-600">
                        {EVENT_TYPE_LABELS[invitation.eventType]}
                        {event && ` · ${formatDateTime(event.startsAt)}`}
                      </p>
                    </div>

                    <span className="shrink-0 rounded-full bg-neutral-100 px-2 py-1 text-xs text-neutral-600">
                      {invitation.template.name}
                    </span>
                  </div>

                  <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
                    {[
                      ["Javob", stats.answers],
                      ["Keladi", stats.coming],
                      ["Mehmon", stats.people],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-lg bg-neutral-50 py-2">
                        <dt className="text-xs text-neutral-500">{label}</dt>
                        <dd className="text-lg font-semibold text-neutral-900">
                          {value}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link
                      href={`/dashboard/${invitation.id}`}
                      className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
                    >
                      Boshqaruv
                    </Link>
                    <Link
                      href={`/dashboard/${invitation.id}/settings`}
                      className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                    >
                      Tahrirlash
                    </Link>
                    <Link
                      href={`/i/${invitation.slug}`}
                      className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                    >
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
