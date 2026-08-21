import { GOLD_ART } from "@/components/invitation/art/palettes";
import { FloralTemplate } from "./FloralTemplate";
import { GOLDEN_THEME } from "./theme";
import type { TemplateProps } from "./types";

/**
 * Oltin bog' — oq qog'ozda yirik oltin gullar, tushayotgan gulbarglar,
 * tovlanadigan ismlar va "ochish" pardasi.
 */
export function GoldenTemplate(props: TemplateProps) {
  return (
    <FloralTemplate
      {...props}
      config={{
        theme: GOLDEN_THEME,
        art: GOLD_ART,
        shimmer: { from: "#8a5f21", via: "#eccd83", to: "#b3862f" },
        defaultGreeting:
          "Hayotimizning eng baxtli kunida siz bilan birga bo'lishni\nsharaf deb bilamiz.",
        idPrefix: "gold",
      }}
    />
  );
}
