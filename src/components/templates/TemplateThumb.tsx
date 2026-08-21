import type { TemplateMeta } from "@/data/templates";

/** Katalogdagi kichik maket — shablonning o'z rangi va shriftida */
export function TemplateThumb({ meta }: { meta: TemplateMeta }) {
  const { bg, ink, accent, font } = meta.preview;

  return (
    <div
      className="flex h-52 flex-col items-center justify-center px-6 text-center"
      style={{ backgroundColor: bg, color: ink }}
    >
      <p
        className="text-[9px] uppercase tracking-[0.32em]"
        style={{ color: accent }}
      >
        To&apos;y taklifnomasi
      </p>

      <p className="mt-4 text-2xl leading-tight" style={{ fontFamily: font }}>
        Malika
        <span className="mx-1.5" style={{ color: accent }}>
          &amp;
        </span>
        Aziz
      </p>

      <span
        className="mt-3 h-px w-10"
        style={{ backgroundColor: accent, opacity: 0.7 }}
      />

      <p className="mt-3 text-[10px] uppercase tracking-[0.2em] opacity-70">
        12-sentabr · 18:00
      </p>
    </div>
  );
}
