import { ArtDefs, Berries, Dahlia, Leaf, Rose, Sprig } from "./Flowers";
import type { ArtPalette } from "./palettes";

type CompositionProps = {
  palette: ArtPalette;
  id: string;
  className?: string;
};

/**
 * Burchak guldastasi — yirik gul, ikkita kichik gul, barglar va donachalar.
 * Yuqori-chap burchak uchun chizilgan; boshqa burchaklar CSS transform bilan aylantiriladi.
 */
export function CornerBouquet({ palette, id, className = "" }: CompositionProps) {
  return (
    <svg
      viewBox="0 0 300 300"
      className={className}
      fill="none"
      aria-hidden
      focusable="false"
    >
      <ArtDefs palette={palette} id={id} />

      {/* Barglar — gullar ostida */}
      <g transform="translate(40 250)">
        <Sprig palette={palette} id={id} length={210} leaves={7} rotate={-12} />
      </g>
      <g transform="translate(105 265)">
        <Sprig palette={palette} id={id} length={150} leaves={5} rotate={26} />
      </g>
      <g transform="translate(15 190)">
        <Sprig palette={palette} id={id} length={120} leaves={5} rotate={-58} />
      </g>

      {/* Donachalar */}
      <g transform="translate(150 210)">
        <Berries palette={palette} spread={80} rotate={18} />
      </g>
      <g transform="translate(35 120)">
        <Berries palette={palette} spread={70} rotate={-40} count={6} />
      </g>

      {/* Gullar */}
      <g transform="translate(70 90)">
        <Dahlia palette={palette} id={id} size={78} rings={4} rotate={8} />
      </g>
      <g transform="translate(160 55)">
        <Dahlia palette={palette} id={id} size={46} rings={3} rotate={-14} />
      </g>
      <g transform="translate(40 205)">
        <Rose palette={palette} id={id} size={54} rotate={12} />
      </g>
      <g transform="translate(140 150)">
        <Rose palette={palette} id={id} size={38} rotate={-24} />
      </g>
      <g transform="translate(205 130)">
        <Leaf palette={palette} id={id} size={52} rotate={128} />
      </g>
    </svg>
  );
}

/** Yuqoridagi tor lenta — sarlavha tepasiga */
export function FloralBand({ palette, id, className = "" }: CompositionProps) {
  return (
    <svg
      viewBox="0 0 400 110"
      className={className}
      fill="none"
      aria-hidden
      focusable="false"
    >
      <ArtDefs palette={palette} id={id} />

      <g transform="translate(200 96)">
        <Dahlia palette={palette} id={id} size={44} rings={4} />
      </g>
      <g transform="translate(150 100)">
        <Rose palette={palette} id={id} size={30} rotate={20} />
      </g>
      <g transform="translate(252 100)">
        <Rose palette={palette} id={id} size={28} rotate={-20} />
      </g>

      <g transform="translate(120 104)">
        <Sprig palette={palette} id={id} length={95} leaves={5} rotate={-72} />
      </g>
      <g transform="translate(285 104)">
        <Sprig palette={palette} id={id} length={95} leaves={5} rotate={72} />
      </g>
      <g transform="translate(90 100)">
        <Berries palette={palette} spread={60} rotate={-95} />
      </g>
      <g transform="translate(315 100)">
        <Berries palette={palette} spread={60} rotate={95} />
      </g>
    </svg>
  );
}

/** Ornamental ajratgich — markazda romb, ikki yonida barglar */
export function OrnamentDivider({
  palette,
  id,
  className = "",
}: CompositionProps) {
  return (
    <svg
      viewBox="0 0 320 40"
      className={className}
      fill="none"
      aria-hidden
      focusable="false"
    >
      <ArtDefs palette={palette} id={id} />

      <path
        d="M10 20 H120"
        stroke={palette.mid}
        strokeWidth="1"
        opacity="0.65"
      />
      <path
        d="M200 20 H310"
        stroke={palette.mid}
        strokeWidth="1"
        opacity="0.65"
      />

      <g transform="translate(140 20)">
        <Leaf palette={palette} id={id} size={26} rotate={-118} />
      </g>
      <g transform="translate(180 20)">
        <Leaf palette={palette} id={id} size={26} rotate={118} />
      </g>

      <g transform="translate(160 20)">
        <path
          d="M0 -13 L9 0 L0 13 L-9 0 Z"
          fill={`url(#${id}-core)`}
          opacity="0.95"
        />
        <path
          d="M0 -20 L4 0 L0 20 L-4 0 Z"
          fill={palette.mid}
          opacity="0.45"
        />
      </g>
    </svg>
  );
}

/** Ravoq (toq) ramka — surat yoki ismlar uchun */
export function ArchFrame({
  palette,
  id,
  className = "",
  children,
}: CompositionProps & { children?: React.ReactNode }) {
  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 300 420"
        className="absolute inset-0 h-full w-full"
        fill="none"
        preserveAspectRatio="none"
        aria-hidden
      >
        <ArtDefs palette={palette} id={id} />
        <path
          d="M12 408 V150 C12 74 74 12 150 12 C226 12 288 74 288 150 V408"
          stroke={palette.mid}
          strokeWidth="2"
          fill="none"
          opacity="0.8"
        />
        <path
          d="M22 408 V150 C22 80 80 22 150 22 C220 22 278 80 278 150 V408"
          stroke={palette.deep}
          strokeWidth="0.8"
          fill="none"
          opacity="0.4"
        />
      </svg>

      <div className="relative">{children}</div>
    </div>
  );
}
