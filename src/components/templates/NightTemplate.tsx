import { NIGHT_ART } from "@/components/invitation/art/palettes";
import { FloralTemplate } from "./FloralTemplate";
import { NIGHT_THEME } from "./theme";
import type { TemplateProps } from "./types";

/**
 * Tungi bog' — to'q ko'k tun fonida oltin gullar va ko'k barglar.
 */
export function NightTemplate(props: TemplateProps) {
  return (
    <FloralTemplate
      {...props}
      config={{
        theme: NIGHT_THEME,
        art: NIGHT_ART,
        shimmer: { from: "#a8862f", via: "#f8e7b4", to: "#d4af59" },
        defaultGreeting:
          "Yulduzlar guvohligida boshlanadigan hayotimizga\nsizni taklif qilamiz.",
        glow:
          "radial-gradient(circle at 20% 12%, rgba(212,175,89,.10), transparent 45%), radial-gradient(circle at 82% 55%, rgba(88,130,190,.14), transparent 42%)",
        idPrefix: "night",
      }}
    />
  );
}
