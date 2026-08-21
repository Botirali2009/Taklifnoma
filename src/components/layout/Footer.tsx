import Link from "next/link";

const LINKS = [
  ["/templates", "Shablonlar"],
  ["/my-invitations", "Taklifnomalarim"],
] as const;

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper-sunk/60">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-5 py-9 text-sm text-ink-faint sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-lg text-ink">Taklifnoma</p>
          <p className="mt-1">
            © {new Date().getFullYear()} — onlayn to&apos;y taklifnomalari
          </p>
        </div>

        <nav className="flex gap-5">
          {LINKS.map(([href, label]) => (
            <Link key={href} href={href} className="transition hover:text-ink">
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
