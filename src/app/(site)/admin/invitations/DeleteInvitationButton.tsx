"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { adminDeleteInvitation } from "@/app/actions/admin";

type Props = {
  invitationId: string;
  label: string;
};

export function DeleteInvitationButton({ invitationId, label }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function remove() {
    if (!confirm(`"${label}" taklifnomasi butunlay o'chiriladi. Davom etamizmi?`)) {
      return;
    }

    startTransition(async () => {
      const result = await adminDeleteInvitation(invitationId);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={remove}
        disabled={pending}
        className="text-sm text-anor hover:underline disabled:opacity-50"
      >
        O&apos;chirish
      </button>
      {error && <p className="text-xs text-anor">{error}</p>}
    </>
  );
}
