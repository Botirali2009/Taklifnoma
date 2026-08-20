import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTemplateComponent } from "@/components/templates";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Props = { params: { slug: string } };

async function getInvitation(slug: string) {
  return prisma.invitation.findUnique({
    where: { slug },
    include: {
      template: true,
      events: { orderBy: { order: "asc" } },
      photos: { orderBy: { order: "asc" } },
      wishes: {
        where: { isVisible: true },
        orderBy: { createdAt: "desc" },
        take: 50,
      },
    },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const invitation = await getInvitation(params.slug);
  if (!invitation) return { title: "Taklifnoma topilmadi" };

  const title = `${invitation.brideName} & ${invitation.groomName} — taklifnoma`;
  return {
    title,
    description: invitation.greeting ?? "Sizni tantanamizga taklif qilamiz.",
    openGraph: { title },
  };
}

export default async function PublicInvitationPage({ params }: Props) {
  const invitation = await getInvitation(params.slug);
  if (!invitation) notFound();

  // Ko'rishlar hisoblagichi (statistika dashboard uchun)
  await prisma.invitation.update({
    where: { id: invitation.id },
    data: { viewCount: { increment: 1 } },
  });

  const Template = getTemplateComponent(invitation.template.code);

  return (
    <Template
      invitation={{
        slug: invitation.slug,
        brideName: invitation.brideName,
        groomName: invitation.groomName,
        eventType: invitation.eventType,
        greeting: invitation.greeting,
        cardNumber: invitation.cardNumber,
        cardHolder: invitation.cardHolder,
        musicUrl: invitation.musicUrl,
        events: invitation.events,
        photos: invitation.photos,
        wishes: invitation.wishes.map((wish) => ({
          id: wish.id,
          authorName: wish.authorName,
          message: wish.message,
        })),
      }}
    />
  );
}
