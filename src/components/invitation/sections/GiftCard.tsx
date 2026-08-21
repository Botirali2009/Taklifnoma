import { CopyButton } from "@/components/ui/CopyButton";

type Props = {
  cardNumber: string;
  cardHolder?: string | null;
  title?: string;
  note?: string;
};

export function GiftCard({
  cardNumber,
  cardHolder,
  title = "Sovg'a uchun",
  note = "Kelolmasangiz ham, e'tiboringiz biz uchun qadrli.",
}: Props) {
  return (
    <div
      className="p-7 text-center"
      style={{
        backgroundColor: "var(--tpl-surface)",
        border: "1px solid var(--tpl-line)",
        borderRadius: "var(--tpl-radius)",
      }}
    >
      <h2 className="text-2xl" style={{ fontFamily: "var(--tpl-display)" }}>
        {title}
      </h2>

      <p className="mt-2 text-sm" style={{ color: "var(--tpl-soft)" }}>
        {note}
      </p>

      <p className="mt-5 font-mono text-lg tracking-[0.18em]">{cardNumber}</p>
      {cardHolder && (
        <p className="mt-1 text-sm" style={{ color: "var(--tpl-soft)" }}>
          {cardHolder}
        </p>
      )}

      <CopyButton
        value={cardNumber}
        label="Karta raqamini nusxalash"
        className="mt-5 inline-block border px-5 py-2.5 text-sm font-semibold transition hover:opacity-80"
      />
    </div>
  );
}
