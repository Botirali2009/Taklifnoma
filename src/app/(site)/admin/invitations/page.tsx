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
        <h2 className="text-lg font-medium text-neutral-900">Taklifnomalar</h2>
        <AdminSearch basePath="/admin/invitations" placeholder="Ism yoki havola" />
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-neutral-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
            <tr>
              <th className="px-4 py-3">Taklifnoma</th>
              <th className="px-4 py-3">Egasi</th>
              <th className="px-4 py-3">Turi</th>
              <th className="px-4 py-3">RSVP</th>
              <th className="px-4 py-3">Yaratilgan</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {invitations.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-neutral-500">
                  Taklifnoma topilmadi.
                </td>
              </tr>
            ) : (
              invitations.map((invitation) => (
                <tr key={invitation.id}>
                  <td className="px-4 py-3">
                    <Link
                      href={`/i/${invitation.slug}`}
                      className="font-medium text-neutral-900 hover:underline"
                    >
                      {invitation.brideName} &amp; {invitation.groomName}
                    </Link>
                    <span className="block text-xs text-neutral-500">
                      /i/{invitation.slug}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {invitation.user.name ??
                      invitation.user.email ??
                      (invitation.user.telegramUsername
                        ? `@${invitation.user.telegramUsername}`
                        : "—")}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {EVENT_TYPE_LABELS[invitation.eventType]}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {invitation._count.guests}
                  </td>
                  <td className="px-4 py-3 text-neutral-500">
                    {formatDateTime(invitation.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
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
