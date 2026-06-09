/**
 * Shared leaf appearance — used by LeafPreview (phone) and canvas tree
 * so audience members can match their leaf on the big screen.
 */
import type { LeafDNA } from "./types";

export interface LeafVisualStyle {
  rx: number;
  ry: number;
  hue: number;
  /** 0–100, matches CSS hsl saturation % */
  saturation: number;
  /** 0–100, matches CSS hsl lightness % */
  brightness: number;
  /** 0–1 for canvas hsv() helper */
  saturationNorm: number;
  valueNorm: number;
}

/** Base leaf dimensions — same geometry as LeafPreview at size 88 */
export function leafBaseDimensions(dna: LeafDNA) {
  return {
    rx: (18 + dna.rxMul * 16) * dna.scale,
    ry: (11 + dna.ryMul * 11) * dna.scale,
  };
}

export function leafColorFromDna(dna: LeafDNA) {
  const brightness = Math.min(90, Math.max(58, (0.70 + dna.brightOffset) * 88));
  const saturation = Math.min(68, 22 + dna.hueSat * 72);
  return {
    hue: dna.hue,
    saturation,
    brightness,
    saturationNorm: saturation / 100,
    valueNorm: brightness / 100,
  };
}

/** Full visual style; sizeScale multiplies rx/ry (e.g. SIZE/88 on phone, ~0.5 on tree) */
export function leafVisualFromDna(dna: LeafDNA, sizeScale = 1): LeafVisualStyle {
  const { rx, ry } = leafBaseDimensions(dna);
  const color = leafColorFromDna(dna);
  return {
    rx: rx * sizeScale,
    ry: ry * sizeScale,
    ...color,
  };
}

export function leafHsla(
  style: Pick<LeafVisualStyle, "hue" | "saturation" | "brightness">,
  alpha = 1,
  lightnessMult = 1,
) {
  const l = Math.min(100, Math.max(0, style.brightness * lightnessMult));
  return `hsla(${style.hue}, ${style.saturation}%, ${l}%, ${alpha})`;
}

/** HSL → rgba string — matches CSS hsl() used by LeafPreview exactly */
export function leafRgbaFromStyle(
  style: Pick<LeafVisualStyle, "hue" | "saturation" | "brightness">,
  alpha = 1,
  lightnessMult = 1,
): string {
  const h = style.hue;
  let s = style.saturation / 100;
  let l = Math.min(1, Math.max(0, (style.brightness * lightnessMult) / 100));
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if      (h <  60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else              { r = c; b = x; }
  return `rgba(${Math.round((r + m) * 255)},${Math.round((g + m) * 255)},${Math.round((b + m) * 255)},${alpha})`;
}

/** Scale factor to map preview-sized leaves onto the ceremony tree canvas */
export const TREE_LEAF_SIZE_SCALE = 0.48;
