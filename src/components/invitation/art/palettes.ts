/** Bezak ranglari — har bir shablon o'z to'plamini beradi */
export type ArtPalette = {
  /** Gulning eng ochiq joyi */
  light: string;
  /** O'rta ton */
  mid: string;
  /** Chuqur soya */
  deep: string;
  /** Barg ochiq */
  leafLight: string;
  /** Barg to'q */
  leafDeep: string;
  /** Mayda donacha/gullar */
  accent: string;
};

/** Klassik oltin — oq fonda */
export const GOLD_ART: ArtPalette = {
  light: "#fbeec6",
  mid: "#dcb768",
  deep: "#a9762c",
  leafLight: "#e8cf95",
  leafDeep: "#b08c3e",
  accent: "#caa14a",
};

/** To'q ko'k fon uchun — oltin gullar, ko'k barglar */
export const NIGHT_ART: ArtPalette = {
  light: "#f6e2ab",
  mid: "#d4af59",
  deep: "#8d6a25",
  leafLight: "#5b7fb8",
  leafDeep: "#2c4a80",
  accent: "#e8d49a",
};

/** Moviy akvarel — oq fonda ko'k gullar */
export const BLUE_ART: ArtPalette = {
  light: "#dbe7f7",
  mid: "#7fa3d4",
  deep: "#3c5f96",
  leafLight: "#a9c6d9",
  leafDeep: "#4d7f8c",
  accent: "#8fb3dd",
};

/** Pushti — romantik */
export const ROSE_ART: ArtPalette = {
  light: "#f9e3e3",
  mid: "#dda2a8",
  deep: "#a45a63",
  leafLight: "#cbd8bd",
  leafDeep: "#7c9068",
  accent: "#c98d95",
};
