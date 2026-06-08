/** Golden-angle canopy placement */
export function canopyPosition(
  index: number,
  total: number,
  cx = 400,
  cy = 200,
  spread = 185
): { x: number; y: number; rotation: number; scale: number } {
  const t = total > 0 ? index / Math.max(total, 1) : 0;
  const angle = index * 2.399963;
  const r = spread * Math.sqrt(t) * 0.92;
  return {
    x: cx + Math.cos(angle) * r,
    y: cy + Math.sin(angle) * r * 0.52,
    rotation: (angle * 180) / Math.PI + 68,
    scale: 1 + t * 0.65,
  };
}

export const trunkFillPath =
  "M 372 560 C 365 480 375 400 385 340 C 392 300 395 270 400 255 L 405 270 C 408 300 412 340 418 400 C 428 480 428 560 415 560 Z";

export const trunkPath =
  "M 400 560 L 400 255";

export const branchPaths: { d: string; width: number }[] = [
  { d: "M 400 320 C 280 300 180 260 120 200", width: 3 },
  { d: "M 400 320 C 520 300 620 260 680 200", width: 3 },
  { d: "M 400 300 C 330 250 280 190 240 130", width: 2.5 },
  { d: "M 400 300 C 470 250 520 190 560 130", width: 2.5 },
  { d: "M 400 280 C 360 220 345 160 338 100", width: 2 },
  { d: "M 400 280 C 440 220 455 160 462 100", width: 2 },
  { d: "M 400 340 C 300 360 220 380 160 370", width: 2 },
  { d: "M 400 340 C 500 360 580 380 640 370", width: 2 },
];

export const veinPaths: string[] = [
  "M 400 520 Q 340 400 320 260 Q 300 120 295 60",
  "M 400 520 Q 460 400 480 260 Q 500 120 505 60",
  "M 400 520 Q 400 350 400 220 Q 400 90 400 40",
];

/** Oak-style leaf — wide and readable on projector */
export function leafPath(scale = 1): string {
  const s = scale;
  return `
    M 0 ${-20 * s}
    C ${18 * s} ${-14 * s} ${20 * s} ${2 * s} ${12 * s} ${16 * s}
    C ${6 * s} ${22 * s} 0 ${24 * s} 0 ${26 * s}
    C 0 ${24 * s} ${-6 * s} ${22 * s} ${-12 * s} ${16 * s}
    C ${-20 * s} ${2 * s} ${-18 * s} ${-14 * s} 0 ${-20 * s}
    Z
  `;
}

export function leafStemPath(scale = 1): string {
  const s = scale;
  return `M 0 ${26 * s} L 0 ${34 * s}`;
}
