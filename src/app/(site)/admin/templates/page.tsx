import { prisma } from "@/lib/prisma";
import { TEMPLATE_COMPONENTS } from "@/components/templates";
import { TemplatesManager } from "./TemplatesManager";

export const dynamic = "force-dynamic";

export default async function AdminTemplatesPage() {
  const templates = await prisma.template.findMany({
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { invitations: true } } },
  });

  return (
    <div>
      <h2 className="text-lg font-medium text-neutral-900">Shablonlar</h2>
      <p className="mt-1 text-sm text-neutral-500">
        Shablon kodi <code>src/components/templates</code> ichidagi komponentga
        mos kelishi kerak. Mavjud komponentlar:{" "}
        {Object.keys(TEMPLATE_COMPONENTS).join(", ")}
      </p>

      <TemplatesManager
        templates={templates.map((template) => ({
          id: template.id,
          code: template.code,
          name: template.name,
          category: template.category,
          previewUrl: template.previewUrl ?? "",
          isActive: template.isActive,
          usageCount: template._count.invitations,
        }))}
        availableCodes={Object.keys(TEMPLATE_COMPONENTS)}
      />
    </div>
  );
}
