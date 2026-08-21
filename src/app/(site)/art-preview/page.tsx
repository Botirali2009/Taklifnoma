import { notFound } from "next/navigation";
import {
  ArchFrame,
  CornerBouquet,
  FloralBand,
  OrnamentDivider,
} from "@/components/invitation/art/Compositions";
import {
  BLUE_ART,
  GOLD_ART,
  NIGHT_ART,
  ROSE_ART,
} from "@/components/invitation/art/palettes";

/** Bezaklarni sinash sahifasi — faqat ishlab chiqishda */
export default function ArtPreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();

  const sets = [
    { name: "gold", palette: GOLD_ART, bg: "#fdfbf7" },
    { name: "night", palette: NIGHT_ART, bg: "#0b1a33" },
    { name: "blue", palette: BLUE_ART, bg: "#ffffff" },
    { name: "rose", palette: ROSE_ART, bg: "#fdf7f5" },
  ];

  return (
    <main className="space-y-10 p-8">
      {sets.map((set) => (
        <section
          key={set.name}
          className="rounded-card p-8"
          style={{ backgroundColor: set.bg }}
        >
          <div className="flex flex-wrap items-start gap-8">
            <CornerBouquet
              palette={set.palette}
              id={`${set.name}-c`}
              className="h-64 w-64"
            />
            <FloralBand
              palette={set.palette}
              id={`${set.name}-b`}
              className="h-32 w-96"
            />
            <ArchFrame
              palette={set.palette}
              id={`${set.name}-a`}
              className="h-64 w-44"
            />
          </div>

          <OrnamentDivider
            palette={set.palette}
            id={`${set.name}-d`}
            className="mt-6 h-10 w-80"
          />
        </section>
      ))}
    </main>
  );
}
