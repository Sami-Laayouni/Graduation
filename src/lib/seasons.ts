import type { Season } from "./types";

export interface SeasonPalette {
  skyTop: string;
  skyBottom: string;
  ground: string;
  vein: string;
  veinGlow: string;
  leafLight: string;
  leafDark: string;
  accent: string;
  particle: string;
  mist: string;
}

export const seasonPalettes: Record<Season, SeasonPalette> = {
  winter: {
    skyTop: "#0c1220",
    skyBottom: "#1a2744",
    ground: "#0d1118",
    vein: "#8eb4d4",
    veinGlow: "#b8d4f0",
    leafLight: "#c8dce8",
    leafDark: "#6a8aa8",
    accent: "#dce8f5",
    particle: "#e8f4ff",
    mist: "rgba(180, 210, 255, 0.08)",
  },
  spring: {
    skyTop: "#0a1410",
    skyBottom: "#142820",
    ground: "#0c120e",
    vein: "#6ee7a0",
    veinGlow: "#a7f3c8",
    leafLight: "#bbf7d0",
    leafDark: "#34d399",
    accent: "#d1fae5",
    particle: "#86efac",
    mist: "rgba(110, 231, 160, 0.1)",
  },
  summer: {
    skyTop: "#141008",
    skyBottom: "#2a2010",
    ground: "#120f0a",
    vein: "#fbbf24",
    veinGlow: "#fde68a",
    leafLight: "#fef3c7",
    leafDark: "#d97706",
    accent: "#fff7ed",
    particle: "#fcd34d",
    mist: "rgba(251, 191, 36, 0.08)",
  },
  autumn: {
    skyTop: "#140c08",
    skyBottom: "#281810",
    ground: "#100a06",
    vein: "#fb923c",
    veinGlow: "#fdba74",
    leafLight: "#fed7aa",
    leafDark: "#c2410c",
    accent: "#ffedd5",
    particle: "#f97316",
    mist: "rgba(251, 146, 60, 0.1)",
  },
};

export const seasonOrder: Season[] = ["winter", "spring", "summer", "autumn"];

export function nextSeason(s: Season): Season {
  const i = seasonOrder.indexOf(s);
  return seasonOrder[(i + 1) % seasonOrder.length];
}
