import Link from "next/link";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { getCurrentUser } from "@/lib/session";

export async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-3.5">
        <Link href="/" className="group flex items-center gap-2.5">
          <span
            aria-hidden
            className="grid h-9 w-9 place-items-center rounded-full border border-brass/40 font-display text-lg leading-none text-brass"
          >
            T
          </span>
          <span className="font-display text-xl font-semibold tracking-tight">
            Taklifnoma
          </span>
        </Link>

        <nav className="flex items-center gap-1 text-sm">
          <Link
            href="/templates"
            className="rounded-lg px-3 py-2 font-medium text-ink-soft transition hover:bg-paper-sunk hover:text-ink"
          >
            Shablonlar
          </Link>

          {user ? (
            <>
              <Link
                href="/my-invitations"
                className="hidden rounded-lg px-3 py-2 font-medium text-ink-soft transition hover:bg-paper-sunk hover:text-ink sm:block"
              >
                Taklifnomalarim
              </Link>

              {user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="rounded-lg px-3 py-2 font-medium text-ink-soft transition hover:bg-paper-sunk hover:text-ink"
                >
                  Admin
                </Link>
              )}

              <SignOutButton className="rounded-lg px-3 py-2 font-medium text-ink-faint transition hover:bg-paper-sunk hover:text-ink" />
            </>
          ) : (
            <Link href="/login" className="btn-primary btn-sm">
              Kirish
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
