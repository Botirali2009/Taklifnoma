import Link from "next/link";
import { notFound } from "next/navigation";
import { getTemplateComponent } from "@/components/templates";
import type { InvitationView } from "@/components/templates";
import { getTemplateMeta } from "@/data/templates";

type Props = { params: { templateId: string } };

/** Namuna ma'lumot — bazasiz ham shablonni ko'rish uchun */
function demoInvitation(): InvitationView {
  const startsAt = new Date();
  startsAt.setMonth(startsAt.getMonth() + 2);
  startsAt.setHours(17, 0, 0, 0);

  return {
    slug: "namuna",
    brideName: "Malika",
    groomName: "Aziz",
    eventType: "TOY",
    greeting:
      "Hurmatli mehmon!\nSizni oilamizning eng quvonchli kunida ko'rishdan mamnun bo'lamiz.",
    cardNumber: "8600 1234 5678 9012",
    cardHolder: "AZIZ RAHIMOV",
    musicUrl: null,
    events: [
      {
        id: "demo-1",
        title: "Nikoh marosimi",
        startsAt,
        locationName: "Oq Saroy to'yxonasi",
        address: "Toshkent sh., Chilonzor tumani, 12-mavze",
        lat: 41.2995,
        lng: 69.2401,
      },
    ],
    photos: [],
    wishes: [
      {
        id: "demo-wish",
        authorName: "Aziza",
        message: "Baxtli bo'linglar! Umringiz uzoq bo'lsin.",
      },
    ],
  };
}

export default function TemplatePreviewPage({ params }: Props) {
  const meta = getTemplateMeta(params.templateId);
  if (!meta) notFound();

  const Template = getTemplateComponent(meta.code);

  return (
    <main>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-paper px-5 py-3.5">
        <p className="text-sm text-ink-soft">
          <span className="font-semibold text-ink">{meta.name}</span> — namuna
          ma&apos;lumot bilan
        </p>

        <div className="flex gap-2">
          <Link href="/templates" className="btn-ghost btn-sm">
            Orqaga
          </Link>
          <Link href={`/create/${meta.code}`} className="btn-brass btn-sm">
            Shu shablonni tanlash
          </Link>
        </div>
      </div>

      <Template invitation={demoInvitation()} preview />
    </main>
  );
}
