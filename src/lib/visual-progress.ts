import type { ProjectorVisualState } from "./types";

/**
 * One speech beat = one vein on the macro leaf (ASI is only *part* of you).
 * Order must match speech-sections.ts.
 */
export const ASI_VEIN_SECTIONS = [
  "asi_intro",
  "ameur_1",
  "ameur_2",
  "ameur_3",
  "zineb",
  "digital",
  "friendships",
  "memories_1",
  "memories_2",
] as const;

/** After ASI: zoom out — ASI lines are not the whole leaf */
export const LEAF_ZOOM_SECTIONS = [
  "search_1",
  "search_2",
  "search_3",
  "main_1",
  "main_2",
  "science_1",
  "science_2",
] as const;

export const TOTAL_ASI_VEINS = ASI_VEIN_SECTIONS.length;

const ZOOM_BY_SECTION: Record<string, number> = {
  memories_2: 0.06,
  search_1: 0.22,
  search_2: 0.38,
  search_3: 0.52,
  main_1: 0.68,
  main_2: 0.82,
  science_1: 0.93,
  science_2: 1,
};

function isAsiVeinSection(sectionId: string): boolean {
  return (ASI_VEIN_SECTIONS as readonly string[]).includes(sectionId);
}

function isZoomSection(sectionId: string): boolean {
  return (LEAF_ZOOM_SECTIONS as readonly string[]).includes(sectionId);
}

/** How many vein lines are drawn (1 per ASI beat while you talk) */
export function asiVeinCount(sectionId: string): number {
  const idx = (ASI_VEIN_SECTIONS as readonly string[]).indexOf(sectionId);
  if (idx >= 0) return idx + 1;
  if (isZoomSection(sectionId)) return TOTAL_ASI_VEINS;
  return 0;
}

/** 0 = deep inside the leaf; 1 = full leaf visible in frame */
export function leafZoomT(sectionId: string): number {
  if (isAsiVeinSection(sectionId) && sectionId !== "memories_2") return 0;
  return ZOOM_BY_SECTION[sectionId] ?? 0;
}

export function leafMacroScale(sectionId: string): number {
  const z = leafZoomT(sectionId);
  return Math.max(1, 3.35 - z * 2.35);
}

export function shouldShowAsiLeaf(
  sectionId: string,
  state: ProjectorVisualState
): boolean {
  if (state === "qr_intro" || state === "qr_reflection" || state === "cosmos") {
    return false;
  }
  if (asiVeinCount(sectionId) > 0 || isZoomSection(sectionId)) return true;
  return (
    state === "leaf_fragment" ||
    state === "leaf_reveal" ||
    state === "single_leaf"
  );
}

export type VisualLayer =
  | "none"
  | "asi_leaf"
  | "tree";

export function visualLayer(
  state: ProjectorVisualState,
  sectionId?: string
): VisualLayer {
  if (
    state === "cosmos" ||
    state === "qr_intro" ||
    state === "qr_reflection" ||
    state === "classmates_roll"
  ) {
    return "none";
  }
  if (state === "leaf_placing") return "tree";
  if (sectionId && shouldShowAsiLeaf(sectionId, state)) return "asi_leaf";
  if (
    state === "leaf_fragment" ||
    state === "leaf_reveal" ||
    state === "single_leaf"
  ) {
    return "asi_leaf";
  }
  return "tree";
}

/** @deprecated use asiVeinCount */
export function leafFragmentProgress(sectionId: string): number {
  return asiVeinCount(sectionId) / TOTAL_ASI_VEINS;
}

/** @deprecated use leafZoomT */
export function leafRevealZoom(sectionId: string): number {
  return leafZoomT(sectionId);
}
