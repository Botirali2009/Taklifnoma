import { notFound } from "next/navigation";
import { getTemplateMeta } from "@/data/templates";
import { CreateInvitationForm } from "./CreateInvitationForm";

type Props = { params: { templateId: string } };

export default function CreateInvitationPage({ params }: Props) {
  const meta = getTemplateMeta(params.templateId);
  if (!meta) notFound();

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <p className="text-sm text-neutral-500">Shablon: {meta.name}</p>
      <h1 className="mt-1 text-3xl font-semibold text-neutral-900">
        Taklifnoma yaratish
      </h1>

      <CreateInvitationForm templateCode={meta.code} />
    </main>
  );
}
