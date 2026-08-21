/** Shablonlar uchun bezak elementlari (SVG) */

export function DiamondDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <span
        className="h-px w-16"
        style={{ backgroundColor: "var(--tpl-accent)", opacity: 0.45 }}
      />
      <svg
        viewBox="0 0 16 16"
        className="h-3 w-3"
        style={{ color: "var(--tpl-accent)" }}
        aria-hidden
      >
        <path d="M8 0 16 8 8 16 0 8Z" fill="currentColor" opacity="0.75" />
      </svg>
      <span
        className="h-px w-16"
        style={{ backgroundColor: "var(--tpl-accent)", opacity: 0.45 }}
      />
    </div>
  );
}

/** Milliy naqsh — takrorlanuvchi geometrik lenta */
export function PatternBand({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`h-6 w-full ${className}`}
      viewBox="0 0 120 24"
      preserveAspectRatio="xMidYMid slice"
      style={{ color: "var(--tpl-accent)" }}
      aria-hidden
    >
      <defs>
        <pattern id="milliy" width="24" height="24" patternUnits="userSpaceOnUse">
          <path
            d="M12 2 22 12 12 22 2 12Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.55"
          />
          <circle cx="12" cy="12" r="2.5" fill="currentColor" opacity="0.5" />
        </pattern>
      </defs>
      <rect width="120" height="24" fill="url(#milliy)" />
    </svg>
  );
}

/** Lux uchun ingichka oltin chiziq */
export function GoldRule({ className = "" }: { className?: string }) {
  return (
    <div
      className={`mx-auto h-px w-40 ${className}`}
      style={{
        background:
          "linear-gradient(90deg, transparent, var(--tpl-accent), transparent)",
      }}
    />
  );
}

/** Burchak gulbandi — klassik shablon uchun */
export function CornerFlourish({
  className = "",
  flip = false,
}: {
  className?: string;
  flip?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={`h-12 w-12 ${className}`}
      style={{
        color: "var(--tpl-accent)",
        transform: flip ? "scaleX(-1)" : undefined,
      }}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      aria-hidden
    >
      <path d="M2 2h24M2 2v24" opacity="0.8" />
      <path d="M8 8c10 0 18 8 18 18" opacity="0.5" />
      <circle cx="8" cy="8" r="1.6" fill="currentColor" stroke="none" opacity="0.7" />
    </svg>
  );
}

/** Romantik shablon uchun gul shoxchasi */
export function FloralSprig({
  className = "",
  flip = false,
}: {
  className?: string;
  flip?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 80 80"
      className={`h-16 w-16 ${className}`}
      style={{
        color: "var(--tpl-accent)",
        transform: flip ? "scaleX(-1)" : undefined,
      }}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M40 76C40 52 30 34 8 24" opacity="0.5" />
      <path d="M26 46c-6-2-10-7-11-13 6 0 12 3 14 8" opacity="0.65" />
      <path d="M34 60c-7-1-12-5-14-11 6-1 12 2 15 7" opacity="0.65" />
      <path d="M31 33c-4-5-4-11-1-16 5 3 8 8 7 14" opacity="0.65" />
      <circle cx="40" cy="76" r="2" fill="currentColor" stroke="none" opacity="0.7" />
      <circle cx="18" cy="20" r="3.2" fill="currentColor" stroke="none" opacity="0.45" />
      <circle cx="12" cy="30" r="2.2" fill="currentColor" stroke="none" opacity="0.35" />
    </svg>
  );
}
