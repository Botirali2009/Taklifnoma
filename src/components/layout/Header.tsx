import Link from "next/link";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { getCurrentUser } from "@/lib/session";

export async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-neutral-900">
          Taklifnoma
        </Link>

        <nav className="flex items-center gap-1 text-sm sm:gap-4">
          <Link
            href="/templates"
            className="rounded-lg px-3 py-2 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
          >
            Shablonlar
          </Link>

          {user ? (
            <>
              <Link
                href="/my-invitations"
                className="rounded-lg px-3 py-2 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
              >
                Taklifnomalarim
              </Link>

              {user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="rounded-lg px-3 py-2 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                >
                  Admin
                </Link>
              )}

              <SignOutButton className="rounded-lg px-3 py-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900" />
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-neutral-900 px-4 py-2 font-medium text-white hover:bg-neutral-700"
            >
              Kirish
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
