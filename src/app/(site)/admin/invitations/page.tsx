import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { EVENT_TYPE_LABELS, formatDateTime } from "@/lib/format";
import { AdminSearch } from "../AdminSearch";
import { DeleteInvitationButton } from "./DeleteInvitationButton";

export const dynamic = "force-dynamic";

type Props = { searchParams: { q?: string } };

export default async function AdminInvitationsPage({ searchParams }: Props) {
  const query = searchParams.q?.trim();

  const invitations = await prisma.invitation.findMany({
    where: query
      ? {
          OR: [
            { brideName: { contains: query, mode: "insensitive" } },
            { groomName: { contains: query, mode: "insensitive" } },
            { slug: { contains: query, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
    take: 200,
    include: {
      user: { select: { name: true, email: true, telegramUsername: true } },
      _count: { select: { guests: true } },
    },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-medium text-ink">Taklifnomalar</h2>
        <AdminSearch basePath="/admin/invitations" placeholder="Ism yoki havola" />
      </div>

      <div className="mt-6 table-wrap">
        <table className="table">
          <thead >
            <tr>
              <th>Taklifnoma</th>
              <th>Egasi</th>
              <th>Turi</th>
              <th>RSVP</th>
              <th>Yaratilgan</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {invitations.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink-faint">
                  Taklifnoma topilmadi.
                </td>
              </tr>
            ) : (
              invitations.map((invitation) => (
                <tr key={invitation.id}>
                  <td>
                    <Link
                      href={`/i/${invitation.slug}`}
                      className="font-medium text-ink hover:underline"
                    >
                      {invitation.brideName} &amp; {invitation.groomName}
                    </Link>
                    <span className="block text-xs text-ink-faint">
                      /i/{invitation.slug}
                    </span>
                  </td>
                  <td className="text-ink-soft">
                    {invitation.user.name ??
                      invitation.user.email ??
                      (invitation.user.telegramUsername
                        ? `@${invitation.user.telegramUsername}`
                        : "—")}
                  </td>
                  <td className="text-ink-soft">
                    {EVENT_TYPE_LABELS[invitation.eventType]}
                  </td>
                  <td className="text-ink-soft">
                    {invitation._count.guests}
                  </td>
                  <td className="text-ink-faint">
                    {formatDateTime(invitation.createdAt)}
                  </td>
                  <td className="text-right">
                    <DeleteInvitationButton
                      invitationId={invitation.id}
                      label={`${invitation.brideName} & ${invitation.groomName}`}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
