import Link from "next/link";
import { requireAdmin } from "@/lib/session";

const NAV = [
  ["/admin", "Umumiy"],
  ["/admin/users", "Foydalanuvchilar"],
  ["/admin/invitations", "Taklifnomalar"],
  ["/admin/templates", "Shablonlar"],
] as const;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Middleware ham tekshiradi — bu ikkinchi himoya qatlami
  await requireAdmin();

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-neutral-900">Admin panel</h1>

      <nav className="mt-4 flex flex-wrap gap-2 border-b border-neutral-200 pb-4">
        {NAV.map(([href, label]) => (
          <Link
            key={href}
            href={href}
            className="rounded-lg px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
          >
            {label}
          </Link>
        ))}
      </nav>

      <div className="mt-8">{children}</div>
    </div>
  );
}
