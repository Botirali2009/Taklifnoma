import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EVENT_TYPE_LABELS, formatDateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Mening taklifnomalarim — Taklifnoma",
};

export default async function MyInvitationsPage() {
  const user = await getCurrentUser();

  const invitations = await prisma.invitation.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      events: { orderBy: { order: "asc" }, take: 1 },
      _count: { select: { guests: true } },
    },
  });

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-16">
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
        <ul className="mt-10 space-y-4">
          {invitations.map((invitation) => {
            const firstEvent = invitation.events[0];

            return (
              <li
                key={invitation.id}
                className="rounded-2xl border border-neutral-200 p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-medium text-neutral-900">
                      {invitation.brideName} &amp; {invitation.groomName}
                    </h2>
                    <p className="mt-1 text-sm text-neutral-600">
                      {EVENT_TYPE_LABELS[invitation.eventType]}
                      {firstEvent && ` · ${formatDateTime(firstEvent.startsAt)}`}
                    </p>
                    <p className="mt-1 text-sm text-neutral-500">
                      /i/{invitation.slug} · {invitation._count.guests} javob
                    </p>
                  </div>

                  <span
                    className={
                      invitation.isActive
                        ? "rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700"
                        : "rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700"
                    }
                  >
                    {invitation.isActive ? "Faol" : "To'lov kutilmoqda"}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    href={`/dashboard/${invitation.id}`}
                    className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
                  >
                    Boshqaruv
                  </Link>
                  <Link
                    href={`/i/${invitation.slug}`}
                    className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                  >
                    Ko&apos;rish
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
