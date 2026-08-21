import { notFound } from "next/navigation";
import { getTemplateMeta } from "@/data/templates";
import { CreateWizard } from "./CreateWizard";

type Props = { params: { templateId: string } };

export default function CreateInvitationPage({ params }: Props) {
  const meta = getTemplateMeta(params.templateId);
  if (!meta) notFound();

  return (
    <main className="mx-auto max-w-2xl px-5 py-14">
      <p className="eyebrow">Shablon: {meta.name}</p>
      <h1 className="section-title mt-3">Taklifnoma yaratish</h1>

      <CreateWizard templateCode={meta.code} />
    </main>
  );
}
