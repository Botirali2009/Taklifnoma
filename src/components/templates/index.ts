import type { ComponentType } from "react";
import { ClassicTemplate } from "./ClassicTemplate";
import { LuxTemplate } from "./LuxTemplate";
import { MilliyTemplate } from "./MilliyTemplate";
import { ModernTemplate } from "./ModernTemplate";
import { PhotoTemplate } from "./PhotoTemplate";
import { RomanticTemplate } from "./RomanticTemplate";
import type { TemplateProps } from "./types";

/** Template.code -> React komponenti */
export const TEMPLATE_COMPONENTS: Record<string, ComponentType<TemplateProps>> = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  milliy: MilliyTemplate,
  lux: LuxTemplate,
  romantik: RomanticTemplate,
  foto: PhotoTemplate,
};

export function getTemplateComponent(code: string): ComponentType<TemplateProps> {
  return TEMPLATE_COMPONENTS[code] ?? ClassicTemplate;
}

export type { TemplateProps, InvitationView } from "./types";
