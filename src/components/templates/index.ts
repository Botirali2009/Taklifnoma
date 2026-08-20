import type { ComponentType } from "react";
import { ClassicTemplate } from "./ClassicTemplate";
import type { TemplateProps } from "./types";

/** Template.code -> React komponenti */
export const TEMPLATE_COMPONENTS: Record<string, ComponentType<TemplateProps>> = {
  classic: ClassicTemplate,
};

export function getTemplateComponent(code: string): ComponentType<TemplateProps> {
  return TEMPLATE_COMPONENTS[code] ?? ClassicTemplate;
}

export type { TemplateProps, InvitationView } from "./types";
