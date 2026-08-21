import Link from "next/link";
import { TEMPLATE_COMPONENTS } from "@/components/templates";
import { TemplateThumb } from "@/components/templates/TemplateThumb";
import { getTemplateMeta, type TemplateMeta } from "@/data/templates";
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

      const fallback: TemplateMeta = {
        code: row.code,
        name: row.name,
        description: "To'y taklifnomasi shabloni.",
        category: row.category,
        preview: {
          bg: "#fdfbf7",
          ink: "#3a3128",
          accent: "#a9762c",
          font: '"Cormorant Garamond", Georgia, serif',
        },
      };

      return {
        meta: meta ?? fallback,
        name: row.name,
        category: row.category,
        previewUrl: row.previewUrl,
      };
    });

  return (
    <main className="mx-auto max-w-5xl px-5 py-16">
      <p className="eyebrow">Katalog</p>
      <h1 className="section-title mt-3">Shablonlar</h1>
      <p className="mt-3 max-w-prose text-ink-soft">
        Yoqqan shablonni tanlang — ma&apos;lumotlaringizni keyin kiritasiz. Har
        birini avval namunada to&apos;liq ko&apos;rib olsangiz bo&apos;ladi.
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
              key={template.meta.code}
              className="card overflow-hidden transition hover:shadow-lift"
            >
              {template.previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={template.previewUrl}
                  alt={template.name}
                  className="h-52 w-full object-cover"
                />
              ) : (
                <TemplateThumb meta={template.meta} />
              )}

              <div className="border-t border-line p-6">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-display text-xl font-semibold">
                    {template.name}
                  </h2>
                  <span className="pill-neutral shrink-0">
                    {CATEGORY_LABELS[template.category] ?? template.category}
                  </span>
                </div>

                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {template.meta.description}
                </p>

                <div className="mt-5 flex gap-2">
                  <Link
                    href={`/create/${template.meta.code}`}
                    className="btn-primary btn-sm"
                  >
                    Tanlash
                  </Link>
                  <Link
                    href={`/templates/${template.meta.code}/preview`}
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
