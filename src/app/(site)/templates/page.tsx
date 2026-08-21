import Link from "next/link";
import { TEMPLATE_COMPONENTS } from "@/components/templates";
import { getTemplateMeta } from "@/data/templates";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const CATEGORY_LABELS: Record<string, string> = {
  ZAMONAVIY: "Zamonaviy",
  MILLIY: "Milliy",
  LUX: "Lux",
  MINIMALIST: "Minimalist",
};

export const metadata = {
  title: "Shablonlar — Taklifnoma",
};

export default async function TemplatesPage() {
  // Katalog bazadan olinadi (admin panelda boshqariladi),
  // faqat komponenti mavjud bo'lganlari ko'rsatiladi.
  const rows = await prisma.template.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
  });

  const templates = rows
    .filter((row) => row.code in TEMPLATE_COMPONENTS)
    .map((row) => {
      const meta = getTemplateMeta(row.code);

      return {
        code: row.code,
        name: row.name,
        category: row.category,
        previewUrl: row.previewUrl,
        description: meta?.description ?? "To'y taklifnomasi shabloni.",
        accent: meta?.accent ?? "#3d3529",
      };
    });

  return (
    <main className="mx-auto max-w-5xl px-5 py-16">
      <p className="eyebrow">Katalog</p>
      <h1 className="section-title mt-3">Shablonlar</h1>
      <p className="mt-3 max-w-prose text-ink-soft">
        Yoqqan shablonni tanlang — ma&apos;lumotlaringizni keyin kiritasiz.
        Har birini avval namunada ko&apos;rib olsangiz bo&apos;ladi.
      </p>

      {templates.length === 0 ? (
        <p className="mt-10 rounded-card border border-dashed border-line-strong p-10 text-center text-ink-faint">
          Hozircha shablon yo&apos;q. Admin panelda qo&apos;shing yoki{" "}
          <code>npm run db:seed</code> ni ishga tushiring.
        </p>
      ) : (
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <article
              key={template.code}
              className="card group overflow-hidden transition hover:shadow-lift"
            >
              {template.previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={template.previewUrl}
                  alt={template.name}
                  className="h-48 w-full object-cover"
                />
              ) : (
                <div
                  className="flex h-48 items-center justify-center"
                  style={{ backgroundColor: template.accent }}
                >
                  <span className="rounded-lg bg-white/90 px-5 py-2.5 font-display text-xl text-ink">
                    {template.name}
                  </span>
                </div>
              )}

              <div className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-display text-xl font-semibold">
                    {template.name}
                  </h2>
                  <span className="pill-neutral shrink-0">
                    {CATEGORY_LABELS[template.category] ?? template.category}
                  </span>
                </div>

                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {template.description}
                </p>

                <div className="mt-5 flex gap-2">
                  <Link href={`/create/${template.code}`} className="btn-primary btn-sm">
                    Tanlash
                  </Link>
                  <Link
                    href={`/templates/${template.code}/preview`}
                    className="btn-ghost btn-sm"
                  >
                    Namuna
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
