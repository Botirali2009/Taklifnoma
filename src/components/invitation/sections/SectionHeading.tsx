type Props = {
  title: string;
  subtitle?: string;
  /** Chiziqli bezak sarlavha ostida */
  rule?: boolean;
};

export function SectionHeading({ title, subtitle, rule = true }: Props) {
  return (
    <div className="text-center">
      <h2
        className="text-[1.75rem] leading-tight"
        style={{ fontFamily: "var(--tpl-display)" }}
      >
        {title}
      </h2>

      {rule && (
        <div
          className="mx-auto mt-4 h-px w-14"
          style={{ backgroundColor: "var(--tpl-accent)", opacity: 0.6 }}
        />
      )}

      {subtitle && (
        <p className="mt-4 text-sm" style={{ color: "var(--tpl-soft)" }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
