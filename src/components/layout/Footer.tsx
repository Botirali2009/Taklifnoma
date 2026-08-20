import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-10 text-sm text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Taklifnoma — onlayn to&apos;y taklifnomalari</p>

        <nav className="flex gap-4">
          <Link href="/templates" className="hover:text-neutral-900">
            Shablonlar
          </Link>
          <Link href="/my-invitations" className="hover:text-neutral-900">
            Mening taklifnomalarim
          </Link>
        </nav>
      </div>
    </footer>
  );
}
