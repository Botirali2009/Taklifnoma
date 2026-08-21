import Link from "next/link";

type Props = {
  slug: string;
  preview?: boolean;
  title?: string;
  note?: string;
  label?: string;
};

export function RsvpCta({
  slug,
  preview = false,
  title = "Kela olasizmi?",
  note = "Iltimos, javobingizni bildiring — mehmonlar sonini aniqlashimizga yordam beradi.",
  label = "Javob berish",
}: Props) {
  const style = {
    backgroundColor: "var(--tpl-accent)",
    color: "var(--tpl-on-accent)",
    borderRadius: "var(--tpl-radius)",
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl" style={{ fontFamily: "var(--tpl-display)" }}>
        {title}
      </h2>

      <p
        className="mx-auto mt-3 max-w-sm text-sm leading-relaxed"
        style={{ color: "var(--tpl-soft)" }}
      >
        {note}
      </p>

      {preview ? (
        <span
          className="mt-7 inline-block cursor-not-allowed px-7 py-3 font-semibold opacity-60"
          style={style}
        >
          {label}
        </span>
      ) : (
        <Link
          href={`/i/${slug}/rsvp`}
          className="mt-7 inline-block px-7 py-3 font-semibold transition hover:opacity-90"
          style={style}
        >
          {label}
        </Link>
      )}
    </div>
  );
}
