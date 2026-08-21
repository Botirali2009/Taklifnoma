import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { RegisterForm } from "./RegisterForm";

export const metadata = { title: "Ro'yxatdan o'tish — Taklifnoma" };

type Props = { searchParams: { callbackUrl?: string } };

export default async function RegisterPage({ searchParams }: Props) {
  const user = await getCurrentUser();
  const callbackUrl = searchParams.callbackUrl ?? "/my-invitations";

  if (user) redirect(callbackUrl);

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-16">
      <h1 className="section-title text-center">Ro&apos;yxatdan o&apos;tish</h1>
      <p className="mt-3 text-center text-ink-soft">
        Bir daqiqada hisob yarating va taklifnomangizni tayyorlang.
      </p>

      <div className="card-pad mt-8">
        <RegisterForm callbackUrl={callbackUrl} />
      </div>
    </main>
  );
}
