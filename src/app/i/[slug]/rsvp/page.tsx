import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { RsvpForm } from "./RsvpForm";

export const dynamic = "force-dynamic";

type Props = { params: { slug: string } };

export default async function RsvpPage({ params }: Props) {
  const invitation = await prisma.invitation.findUnique({
    where: { slug: params.slug },
    select: { brideName: true, groomName: true, slug: true },
  });

  if (!invitation) notFound();

  return (
    <main className="mx-auto min-h-screen max-w-md px-6 py-16">
      <h1 className="text-2xl font-semibold text-neutral-900">
        {invitation.brideName} &amp; {invitation.groomName}
      </h1>
      <p className="mb-8 mt-2 text-sm text-neutral-600">
        Iltimos, kela olasizmi yoki yo&apos;qligini bildiring.
      </p>

      <RsvpForm slug={invitation.slug} />
    </main>
  );
}
