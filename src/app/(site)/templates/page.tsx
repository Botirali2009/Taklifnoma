import Link from "next/link";
import { TEMPLATES } from "@/data/templates";

const CATEGORY_LABELS: Record<string, string> = {
  ZAMONAVIY: "Zamonaviy",
  MILLIY: "Milliy",
  LUX: "Lux",
  MINIMALIST: "Minimalist",
};

export const metadata = {
  title: "Shablonlar — Taklifnoma",
};

export default function TemplatesPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-semibold text-neutral-900">Shablonlar</h1>
      <p className="mt-2 text-neutral-600">
        Yoqqan shablonni tanlang — ma&apos;lumotlaringizni keyin kiritasiz.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TEMPLATES.map((template) => (
          <article
            key={template.code}
            className="overflow-hidden rounded-2xl border border-neutral-200"
          >
            <div
              className="flex h-44 items-center justify-center text-2xl text-white"
              style={{ backgroundColor: template.accent }}
            >
              {template.name}
            </div>

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
    </main>
  );
}
