"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteTemplate, saveTemplate } from "@/app/actions/admin";
import type { TemplateCategory } from "@/generated/prisma/enums";

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
      <div className="table-wrap">
        <table className="table">
          <thead >
            <tr>
              <th>Nomi</th>
              <th>Kod</th>
              <th>Kategoriya</th>
              <th>Holati</th>
              <th>Ishlatilgan</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {templates.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink-faint">
                  Shablon yo&apos;q.
                </td>
              </tr>
            ) : (
              templates.map((template) => (
                <tr key={template.id}>
                  <td className="font-medium">
                    {template.name}
                  </td>
                  <td>
                    <code className="text-ink-soft">{template.code}</code>
                    {!availableCodes.includes(template.code) && (
                      <span className="ml-2 rounded-full bg-amber-50 px-2 py-1 text-xs text-amber-700">
                        komponent yo&apos;q
                      </span>
                    )}
                  </td>
                  <td className="text-ink-soft">
                    {CATEGORIES.find(([value]) => value === template.category)?.[1]}
                  </td>
                  <td>
                    <span
                      className={
                        template.isActive
                          ? "rounded-full bg-emerald-50 px-2 py-1 text-xs text-emerald-800"
                          : "rounded-full bg-paper-sunk px-2 py-1 text-xs text-ink-soft"
                      }
                    >
                      {template.isActive ? "Faol" : "Yashirin"}
                    </span>
                  </td>
                  <td className="text-ink-soft">{template.usageCount}</td>
                  <td className="text-right">
                    <button
                      type="button"
                      onClick={() => setDraft({ ...template })}
                      className="text-sm text-ink-soft hover:underline"
                    >
                      Tahrirlash
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(template)}
                      disabled={pending}
                      className="ml-4 text-sm text-anor hover:underline disabled:opacity-50"
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
        <p className="rounded-lg bg-anor-soft px-4 py-3 text-sm text-anor">{error}</p>
      )}

      {draft ? (
        <div className="space-y-4 card-pad">
          <h3 className="font-medium text-ink">
            {draft.id ? "Shablonni tahrirlash" : "Yangi shablon"}
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm text-ink-soft">
              Nomi
              <input
                className="input"
                value={draft.name}
                onChange={(event) =>
                  setDraft({ ...draft, name: event.target.value })
                }
              />
            </label>

            <label className="block text-sm text-ink-soft">
              Kod (komponent nomi)
              <input
                className="input"
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

            <label className="block text-sm text-ink-soft">
              Kategoriya
              <select
                className="input"
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

            <label className="block text-sm text-ink-soft">
              Preview rasm havolasi
              <input
                className="input"
                value={draft.previewUrl}
                onChange={(event) =>
                  setDraft({ ...draft, previewUrl: event.target.value })
                }
                placeholder="https://..."
              />
            </label>
          </div>

          <label className="flex items-center gap-2 text-sm text-ink-soft">
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
              className="btn-primary btn-sm"
            >
              {pending ? "Saqlanmoqda..." : "Saqlash"}
            </button>
            <button
              type="button"
              onClick={() => setDraft(null)}
              className="btn-ghost btn-sm"
            >
              Bekor qilish
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setDraft({ ...EMPTY_DRAFT })}
          className="btn-brass btn-sm"
        >
          + Shablon qo&apos;shish
        </button>
      )}
    </div>
  );
}
