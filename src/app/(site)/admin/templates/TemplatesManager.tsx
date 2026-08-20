"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteTemplate, saveTemplate } from "@/app/actions/admin";
import type { TemplateCategory } from "@/generated/prisma/enums";

const INPUT =
  "w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900";

const CATEGORIES: Array<[TemplateCategory, string]> = [
  ["ZAMONAVIY", "Zamonaviy"],
  ["MILLIY", "Milliy"],
  ["LUX", "Lux"],
  ["MINIMALIST", "Minimalist"],
];

export type TemplateRow = {
  id: string;
  code: string;
  name: string;
  category: TemplateCategory;
  previewUrl: string;
  isActive: boolean;
  usageCount: number;
};

type Draft = {
  id?: string;
  code: string;
  name: string;
  category: TemplateCategory;
  previewUrl: string;
  isActive: boolean;
};

const EMPTY_DRAFT: Draft = {
  code: "",
  name: "",
  category: "ZAMONAVIY",
  previewUrl: "",
  isActive: true,
};

type Props = {
  templates: TemplateRow[];
  availableCodes: string[];
};

export function TemplatesManager({ templates, availableCodes }: Props) {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function save() {
    if (!draft) return;
    setError(null);

    startTransition(async () => {
      const result = await saveTemplate(draft);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setDraft(null);
      router.refresh();
    });
  }

  function remove(template: TemplateRow) {
    if (!confirm(`"${template.name}" shabloni o'chiriladi. Davom etamizmi?`)) return;

    setError(null);
    startTransition(async () => {
      const result = await deleteTemplate(template.id);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="mt-6 space-y-6">
      <div className="overflow-x-auto rounded-2xl border border-neutral-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
            <tr>
              <th className="px-4 py-3">Nomi</th>
              <th className="px-4 py-3">Kod</th>
              <th className="px-4 py-3">Kategoriya</th>
              <th className="px-4 py-3">Holati</th>
              <th className="px-4 py-3">Ishlatilgan</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {templates.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-neutral-500">
                  Shablon yo&apos;q.
                </td>
              </tr>
            ) : (
              templates.map((template) => (
                <tr key={template.id}>
                  <td className="px-4 py-3 font-medium text-neutral-900">
                    {template.name}
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-neutral-600">{template.code}</code>
                    {!availableCodes.includes(template.code) && (
                      <span className="ml-2 rounded-full bg-amber-50 px-2 py-1 text-xs text-amber-700">
                        komponent yo&apos;q
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {CATEGORIES.find(([value]) => value === template.category)?.[1]}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        template.isActive
                          ? "rounded-full bg-green-50 px-2 py-1 text-xs text-green-700"
                          : "rounded-full bg-neutral-100 px-2 py-1 text-xs text-neutral-600"
                      }
                    >
                      {template.isActive ? "Faol" : "Yashirin"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{template.usageCount}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => setDraft({ ...template })}
                      className="text-sm text-neutral-700 hover:underline"
                    >
                      Tahrirlash
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(template)}
                      disabled={pending}
                      className="ml-4 text-sm text-red-600 hover:underline disabled:opacity-50"
                    >
                      O&apos;chirish
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      {draft ? (
        <div className="space-y-4 rounded-2xl border border-neutral-200 p-6">
          <h3 className="font-medium text-neutral-900">
            {draft.id ? "Shablonni tahrirlash" : "Yangi shablon"}
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm text-neutral-700">
              Nomi
              <input
                className={`mt-1 ${INPUT}`}
                value={draft.name}
                onChange={(event) =>
                  setDraft({ ...draft, name: event.target.value })
                }
              />
            </label>

            <label className="block text-sm text-neutral-700">
              Kod (komponent nomi)
              <input
                className={`mt-1 ${INPUT}`}
                value={draft.code}
                list="template-codes"
                onChange={(event) =>
                  setDraft({ ...draft, code: event.target.value })
                }
              />
              <datalist id="template-codes">
                {availableCodes.map((code) => (
                  <option key={code} value={code} />
                ))}
              </datalist>
            </label>

            <label className="block text-sm text-neutral-700">
              Kategoriya
              <select
                className={`mt-1 ${INPUT}`}
                value={draft.category}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    category: event.target.value as TemplateCategory,
                  })
                }
              >
                {CATEGORIES.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm text-neutral-700">
              Preview rasm havolasi
              <input
                className={`mt-1 ${INPUT}`}
                value={draft.previewUrl}
                onChange={(event) =>
                  setDraft({ ...draft, previewUrl: event.target.value })
                }
                placeholder="https://..."
              />
            </label>
          </div>

          <label className="flex items-center gap-2 text-sm text-neutral-700">
            <input
              type="checkbox"
              checked={draft.isActive}
              onChange={(event) =>
                setDraft({ ...draft, isActive: event.target.checked })
              }
            />
            Katalogda ko&apos;rinsin
          </label>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={save}
              disabled={pending}
              className="rounded-lg bg-neutral-900 px-5 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50"
            >
              {pending ? "Saqlanmoqda..." : "Saqlash"}
            </button>
            <button
              type="button"
              onClick={() => setDraft(null)}
              className="rounded-lg border border-neutral-300 px-5 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
            >
              Bekor qilish
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setDraft({ ...EMPTY_DRAFT })}
          className="rounded-lg bg-neutral-900 px-5 py-2 text-sm font-medium text-white hover:bg-neutral-700"
        >
          + Shablon qo&apos;shish
        </button>
      )}
    </div>
  );
}
