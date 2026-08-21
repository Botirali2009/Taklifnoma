import Link from "next/link";
import { redirect } from "next/navigation";
import { DevSignInForm } from "@/components/auth/DevSignInForm";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { PasswordSignInForm } from "@/components/auth/PasswordSignInForm";
import { TelegramLoginButton } from "@/components/auth/TelegramLoginButton";
import { getCurrentUser } from "@/lib/session";

export const metadata = { title: "Kirish — Taklifnoma" };

type Props = { searchParams: { callbackUrl?: string; error?: string } };

export default async function LoginPage({ searchParams }: Props) {
  const user = await getCurrentUser();
  const callbackUrl = searchParams.callbackUrl ?? "/my-invitations";

  if (user) redirect(callbackUrl);

  const googleEnabled = Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
  );
  const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME;
  const devLoginEnabled =
    process.env.NODE_ENV !== "production" &&
    process.env.ALLOW_DEV_LOGIN === "true";

  const hasExtraProviders = googleEnabled || Boolean(botUsername);

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-16">
      <h1 className="section-title text-center">Kirish</h1>
      <p className="mt-3 text-center text-ink-soft">
        Taklifnoma yaratish uchun hisobingizga kiring.
      </p>

      {searchParams.error && (
        <p className="mt-6 rounded-lg bg-anor-soft px-4 py-3 text-center text-sm text-anor">
          Kirishda xatolik yuz berdi. Qaytadan urinib ko&apos;ring.
        </p>
      )}

      <div className="card-pad mt-8">
        <PasswordSignInForm callbackUrl={callbackUrl} />
      </div>

      {hasExtraProviders && (
        <>
          <div className="my-7 flex items-center gap-4 text-xs uppercase tracking-widest text-ink-faint">
            <span className="h-px flex-1 bg-line" />
            yoki
            <span className="h-px flex-1 bg-line" />
          </div>

          <div className="space-y-3">
            {googleEnabled && <GoogleSignInButton callbackUrl={callbackUrl} />}
            {botUsername && (
              <TelegramLoginButton
                botUsername={botUsername}
                callbackUrl={callbackUrl}
              />
            )}
          </div>
        </>
      )}

      {devLoginEnabled && (
        <div className="mt-7">
          <DevSignInForm callbackUrl={callbackUrl} />
        </div>
      )}

      <Link
        href="/"
        className="mt-8 text-center text-sm text-ink-faint transition hover:text-ink"
      >
        Asosiy sahifaga qaytish
      </Link>
    </main>
  );
}
