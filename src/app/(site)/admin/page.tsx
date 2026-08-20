import { prisma } from "@/lib/prisma";
import { EVENT_TYPE_LABELS } from "@/lib/format";
import { AdminChartsSection } from "./AdminChartsSection";
import type { EventType } from "@/generated/prisma/enums";

export const dynamic = "force-dynamic";

const DAYS = 30;

function dayKey(date: Date): string {
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${dd}.${mm}`;
}

export default async function AdminDashboardPage() {
  const since = new Date();
  since.setDate(since.getDate() - (DAYS - 1));
  since.setHours(0, 0, 0, 0);

  const [
    userCount,
    invitationCount,
    activeCount,
    guestCount,
    recentUsers,
    recentInvitations,
    byEventType,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.invitation.count(),
    prisma.invitation.count({ where: { isActive: true } }),
    prisma.guest.count(),
    prisma.user.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true },
    }),
    prisma.invitation.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true },
    }),
    prisma.invitation.groupBy({
      by: ["eventType"],
      _count: { _all: true },
    }),
  ]);

  // 30 kunlik tendensiya — har kun uchun nol bilan to'ldiramiz
  const trend = Array.from({ length: DAYS }, (_, index) => {
    const date = new Date(since);
    date.setDate(since.getDate() + index);

    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);

    const inRange = (created: Date) => created >= date && created < nextDay;

    return {
      date: dayKey(date),
      users: recentUsers.filter((row) => inRange(row.createdAt)).length,
      invitations: recentInvitations.filter((row) => inRange(row.createdAt)).length,
    };
  });

  const eventTypes = (
    Object.keys(EVENT_TYPE_LABELS) as EventType[]
  ).map((type) => ({
    label: EVENT_TYPE_LABELS[type],
    count: byEventType.find((row) => row.eventType === type)?._count._all ?? 0,
  }));

  const stats = [
    { label: "Foydalanuvchilar", value: userCount },
    { label: "Taklifnomalar", value: invitationCount },
    { label: "Faol taklifnomalar", value: activeCount },
    { label: "RSVP javoblari", value: guestCount },
  ];

  return (
    <div className="space-y-8">
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-neutral-200 p-5"
          >
            <p className="text-3xl font-semibold text-neutral-900">{stat.value}</p>
            <p className="mt-1 text-sm text-neutral-500">{stat.label}</p>
          </div>
        ))}
      </section>

      <AdminChartsSection trend={trend} eventTypes={eventTypes} />
    </div>
  );
}
