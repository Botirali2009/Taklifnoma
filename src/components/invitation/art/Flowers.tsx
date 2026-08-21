import type { ArtPalette } from "./palettes";

/**
 * Bezaklar kod bilan chiziladi (SVG) — tayyor rasm ishlatilmaydi,
 * shuning uchun har qanday o'lchamda tiniq va rangi shablonga moslashadi.
 */

type Common = {
  palette: ArtPalette;
  /** Gradient id'lari to'qnashmasligi uchun */
  id: string;
};

/** Gradientlar va soyalar — har bir SVG ichida bir marta */
export function ArtDefs({ palette, id }: Common) {
  return (
    <defs>
      <radialGradient id={`${id}-petal`} cx="50%" cy="80%" r="80%">
        <stop offset="0%" stopColor={palette.light} />
        <stop offset="55%" stopColor={palette.mid} />
        <stop offset="100%" stopColor={palette.deep} />
      </radialGradient>

      <linearGradient id={`${id}-petal2`} x1="0" y1="1" x2="0.4" y2="0">
        <stop offset="0%" stopColor={palette.deep} />
        <stop offset="45%" stopColor={palette.mid} />
        <stop offset="100%" stopColor={palette.light} />
      </linearGradient>

      <linearGradient id={`${id}-leaf`} x1="0" y1="1" x2="0.6" y2="0">
        <stop offset="0%" stopColor={palette.leafDeep} />
        <stop offset="100%" stopColor={palette.leafLight} />
      </linearGradient>

      <radialGradient id={`${id}-core`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={palette.light} />
        <stop offset="100%" stopColor={palette.deep} />
      </radialGradient>
    </defs>
  );
}

/** Bitta gulbarg — pastdan yuqoriga cho'zilgan */
function petalPath(length: number, width: number): string {
  const w = width / 2;
  return `M0 0 C ${w} ${-length * 0.35}, ${w * 0.9} ${-length * 0.75}, 0 ${-length} C ${-w * 0.9} ${-length * 0.75}, ${-w} ${-length * 0.35}, 0 0 Z`;
}

type FlowerProps = Common & {
  /** Markazdan chetgacha radius */
  size?: number;
  /** Halqalar soni (ko'p bo'lsa gul to'laroq) */
  rings?: number;
  /** Boshlang'ich burilish */
  rotate?: number;
};

/**
 * Dahlia/xrizantema uslubidagi gul — bir necha halqa gulbarglardan.
 * Referens rasmlaridagi yirik oltin gullarga o'xshaydi.
 */
export function Dahlia({
  palette,
  id,
  size = 100,
  rings = 4,
  rotate = 0,
}: FlowerProps) {
  const layers = Array.from({ length: rings }, (_, ring) => {
    const t = ring / rings;
    const count = Math.max(6, Math.round(14 - ring * 2.5));
    const length = size * (1 - t * 0.62);
    const width = length * 0.42;
    const offset = (360 / count) * (ring % 2 === 0 ? 0.5 : 0);

    return { ring, count, length, width, offset, t };
  });

  return (
    <g transform={`rotate(${rotate})`}>
      {layers.map(({ ring, count, length, width, offset, t }) =>
        Array.from({ length: count }, (_, index) => {
          const angle = (360 / count) * index + offset;

          return (
            <path
              key={`${ring}-${index}`}
              d={petalPath(length, width)}
              transform={`rotate(${angle})`}
              fill={`url(#${id}-petal${ring % 2 === 0 ? "" : "2"})`}
              opacity={0.92 - t * 0.1}
            />
          );
        }),
      )}

      <circle r={size * 0.11} fill={`url(#${id}-core)`} />
      {Array.from({ length: 7 }, (_, index) => {
        const angle = (360 / 7) * index;
        const r = size * 0.06;
        return (
          <circle
            key={`c-${index}`}
            cx={Math.cos((angle * Math.PI) / 180) * r}
            cy={Math.sin((angle * Math.PI) / 180) * r}
            r={size * 0.022}
            fill={palette.deep}
            opacity="0.55"
          />
        );
      })}
    </g>
  );
}

/** Atirgul — spiral qavatli */
export function Rose({ palette, id, size = 70, rotate = 0 }: FlowerProps) {
  const rings = [1, 0.76, 0.54, 0.34];

  return (
    <g transform={`rotate(${rotate})`}>
      {rings.map((scale, ring) =>
        Array.from({ length: 5 }, (_, index) => {
          const angle = (360 / 5) * index + ring * 26;
          const length = size * scale;

          return (
            <path
              key={`${ring}-${index}`}
              d={`M0 0 C ${length * 0.55} ${-length * 0.2}, ${length * 0.5} ${-length * 0.8}, 0 ${-length} C ${-length * 0.5} ${-length * 0.8}, ${-length * 0.55} ${-length * 0.2}, 0 0 Z`}
              transform={`rotate(${angle})`}
              fill={`url(#${id}-petal${ring % 2 === 0 ? "" : "2"})`}
              opacity={0.95}
            />
          );
        }),
      )}
      <circle r={size * 0.08} fill={palette.deep} opacity="0.6" />
    </g>
  );
}

/** Barg */
export function Leaf({ id, size = 60, rotate = 0 }: Common & { size?: number; rotate?: number }) {
  return (
    <g transform={`rotate(${rotate})`}>
      <path
        d={`M0 0 C ${size * 0.3} ${-size * 0.3}, ${size * 0.34} ${-size * 0.72}, 0 ${-size} C ${-size * 0.34} ${-size * 0.72}, ${-size * 0.3} ${-size * 0.3}, 0 0 Z`}
        fill={`url(#${id}-leaf)`}
      />
      <path
        d={`M0 ${-size * 0.05} L0 ${-size * 0.9}`}
        stroke="rgba(255,255,255,.35)"
        strokeWidth={size * 0.02}
        fill="none"
      />
    </g>
  );
}

/** Barglar shoxchasi — egri poya bo'ylab */
export function Sprig({
  palette,
  id,
  length = 180,
  leaves = 7,
  rotate = 0,
}: Common & { length?: number; leaves?: number; rotate?: number }) {
  return (
    <g transform={`rotate(${rotate})`}>
      <path
        d={`M0 0 Q ${length * 0.25} ${-length * 0.45}, ${length * 0.15} ${-length}`}
        stroke={palette.leafDeep}
        strokeWidth={length * 0.012}
        fill="none"
        opacity="0.8"
      />

      {Array.from({ length: leaves }, (_, index) => {
        const t = (index + 1) / (leaves + 1);
        const x = length * 0.25 * 2 * t * (1 - t) + length * 0.15 * t * t;
        const y = -length * (0.45 * 2 * t * (1 - t) + t * t);
        const side = index % 2 === 0 ? 1 : -1;
        const scale = 0.55 + (1 - t) * 0.45;

        return (
          <g key={index} transform={`translate(${x} ${y})`}>
            <Leaf
              id={id}
              palette={palette}
              size={length * 0.3 * scale}
              rotate={side * 52 - 12}
            />
          </g>
        );
      })}
    </g>
  );
}

/** Mayda donachalar (nuqtali shoxcha) */
export function Berries({
  palette,
  count = 7,
  spread = 60,
  rotate = 0,
}: {
  palette: ArtPalette;
  count?: number;
  spread?: number;
  rotate?: number;
}) {
  return (
    <g transform={`rotate(${rotate})`}>
      <path
        d={`M0 0 Q ${spread * 0.2} ${-spread * 0.6}, ${spread * 0.1} ${-spread}`}
        stroke={palette.accent}
        strokeWidth="1.4"
        fill="none"
        opacity="0.7"
      />
      {Array.from({ length: count }, (_, index) => {
        const t = (index + 1) / (count + 1);
        const x = spread * 0.2 * 2 * t * (1 - t) + spread * 0.1 * t * t;
        const y = -spread * (0.6 * 2 * t * (1 - t) + t * t);
        const side = index % 2 === 0 ? 1 : -1;

        return (
          <circle
            key={index}
            cx={x + side * spread * 0.09}
            cy={y}
            r={spread * 0.045}
            fill={palette.accent}
            opacity="0.85"
          />
        );
      })}
    </g>
  );
}
