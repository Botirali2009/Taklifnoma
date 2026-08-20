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
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-semibold text-neutral-900">Shablonlar</h1>
      <p className="mt-2 text-neutral-600">
        Yoqqan shablonni tanlang — ma&apos;lumotlaringizni keyin kiritasiz.
      </p>

      {templates.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-neutral-300 p-10 text-center text-neutral-500">
          Hozircha shablon yo&apos;q. Admin panelda qo&apos;shing yoki{" "}
          <code>npm run db:seed</code> ni ishga tushiring.
        </p>
      ) : (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <article
              key={template.code}
              className="overflow-hidden rounded-2xl border border-neutral-200"
            >
              {template.previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={template.previewUrl}
                  alt={template.name}
                  className="h-44 w-full object-cover"
                />
              ) : (
                <div
                  className="flex h-44 items-center justify-center text-2xl text-white"
                  style={{ backgroundColor: template.accent }}
                >
                  {template.name}
                </div>
              )}

              <div className="p-5">
                <div className="flex items-center justify-between">
                  <h2 className="font-medium text-neutral-900">{template.name}</h2>
                  <span className="rounded-full bg-neutral-100 px-2 py-1 text-xs text-neutral-600">
                    {CATEGORY_LABELS[template.category] ?? template.category}
                  </span>
                </div>

                <p className="mt-2 text-sm text-neutral-600">
                  {template.description}
                </p>

                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/create/${template.code}`}
                    className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
                  >
                    Tanlash
                  </Link>
                  <Link
                    href={`/templates/${template.code}/preview`}
                    className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                  >
                    Ko&apos;rish
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
