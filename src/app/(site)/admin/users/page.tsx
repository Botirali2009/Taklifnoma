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
        <h2 className="text-lg font-medium text-ink">Foydalanuvchilar</h2>
        <AdminSearch basePath="/admin/users" placeholder="Ism, email, username" />
      </div>

      <div className="mt-6 table-wrap">
        <table className="table">
          <thead >
            <tr>
              <th>Ism</th>
              <th>Kontakt</th>
              <th>Rol</th>
              <th>Taklifnomalar</th>
              <th>Qo&apos;shilgan</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-ink-faint">
                  Foydalanuvchi topilmadi.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td className="font-medium">
                    {user.name ?? "—"}
                  </td>
                  <td className="text-ink-soft">
                    {user.email ??
                      (user.telegramUsername ? `@${user.telegramUsername}` : "—")}
                  </td>
                  <td>
                    <span
                      className={
                        user.role === "ADMIN"
                          ? "rounded-full bg-ink px-2 py-1 text-xs text-white"
                          : "rounded-full bg-paper-sunk px-2 py-1 text-xs text-ink-soft"
                      }
                    >
                      {user.role === "ADMIN" ? "Admin" : "Foydalanuvchi"}
                    </span>
                  </td>
                  <td className="text-ink-soft">
                    {user._count.invitations}
                  </td>
                  <td className="text-ink-faint">
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
