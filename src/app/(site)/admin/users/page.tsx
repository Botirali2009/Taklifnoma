import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/format";
import { AdminSearch } from "../AdminSearch";

export const dynamic = "force-dynamic";

type Props = { searchParams: { q?: string } };

export default async function AdminUsersPage({ searchParams }: Props) {
  const query = searchParams.q?.trim();

  const users = await prisma.user.findMany({
    where: query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
            { telegramUsername: { contains: query, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { _count: { select: { invitations: true } } },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-medium text-neutral-900">Foydalanuvchilar</h2>
        <AdminSearch basePath="/admin/users" placeholder="Ism, email, username" />
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-neutral-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
            <tr>
              <th className="px-4 py-3">Ism</th>
              <th className="px-4 py-3">Kontakt</th>
              <th className="px-4 py-3">Rol</th>
              <th className="px-4 py-3">Taklifnomalar</th>
              <th className="px-4 py-3">Qo&apos;shilgan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-neutral-500">
                  Foydalanuvchi topilmadi.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td className="px-4 py-3 font-medium text-neutral-900">
                    {user.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {user.email ??
                      (user.telegramUsername ? `@${user.telegramUsername}` : "—")}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        user.role === "ADMIN"
                          ? "rounded-full bg-neutral-900 px-2 py-1 text-xs text-white"
                          : "rounded-full bg-neutral-100 px-2 py-1 text-xs text-neutral-600"
                      }
                    >
                      {user.role === "ADMIN" ? "Admin" : "Foydalanuvchi"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {user._count.invitations}
                  </td>
                  <td className="px-4 py-3 text-neutral-500">
                    {formatDateTime(user.createdAt)}
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
