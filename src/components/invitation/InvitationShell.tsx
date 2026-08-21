import type { ReactNode } from "react";
import { MusicPlayer } from "@/components/invitation/MusicPlayer";
import { themeStyle, type TemplateTheme } from "@/components/templates/theme";

type Props = {
  theme: TemplateTheme;
  children: ReactNode;
  musicUrl?: string | null;
  preview?: boolean;
  className?: string;
};

/** Har bir shablon shu qobiq ichida ishlaydi — ranglar CSS o'zgaruvchilari orqali tarqaladi */
export function InvitationShell({
  theme,
  children,
  musicUrl,
  preview = false,
  className = "",
}: Props) {
  return (
    <div style={themeStyle(theme)} className={`min-h-screen ${className}`}>
      {musicUrl && !preview && <MusicPlayer src={musicUrl} />}
      {children}
    </div>
  );
}
