import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTemplateComponent } from "@/components/templates";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

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
  const description =
    invitation.greeting?.split("\n")[0] ?? "Sizni tantanamizga taklif qilamiz.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "uz_UZ",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function PublicInvitationPage({ params }: Props) {
  const invitation = await getInvitation(params.slug);
  if (!invitation) notFound();

  // Ko'rishlar hisoblagichi — egasining o'z tashrifi hisoblanmaydi
  const viewer = await getCurrentUser();
  if (viewer?.id !== invitation.userId) {
    await prisma.invitation.update({
      where: { id: invitation.id },
      data: { viewCount: { increment: 1 } },
    });
  }

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
