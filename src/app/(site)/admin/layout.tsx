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
    <div className="mx-auto max-w-5xl px-5 py-12">
      <p className="eyebrow">Platforma boshqaruvi</p>
      <h1 className="section-title mt-3">Admin panel</h1>

      <nav className="mt-6 flex flex-wrap gap-1 border-b border-line pb-4">
        {NAV.map(([href, label]) => (
          <Link
            key={href}
            href={href}
            className="rounded-lg px-3.5 py-2 text-sm font-medium text-ink-soft transition hover:bg-paper-sunk hover:text-ink"
          >
            {label}
          </Link>
        ))}
      </nav>

      <div className="mt-8">{children}</div>
    </div>
  );
}
