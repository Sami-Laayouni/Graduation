/**
 * Derives a LeafDNA from a leafSeed (uint32).
 * Pure function — no randomness, no side effects.
 * Given the same seed you always get the same leaf, forever.
 */
import type { LeafDNA, LeafRecord } from "./types";

/** Cheap mulberry32 step — extract 0–1 floats from a seed */
function rng32(seed: number) {
  let s = seed;
  const next = (): number => {
    s  = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t    = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 0xffffffff;
  };
  return next;
}

/** Hash a UUID string into a uint32 */
export function seedFromId(id: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h  = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

/**
 * Leaf hues are picked from a curated palette of natural leaf colors:
 * warm amber, cool silver-blue, soft moss green, dusty rose — all very
 * desaturated so the B&W fantasy look is preserved.
 */
const HUE_PALETTE = [
   38,  // amber / warm golden
   52,  // yellow-green
  105,  // moss green
  165,  // sea-green / teal
  210,  // cool silver-blue
  230,  // blue-grey
  280,  // lavender (rare)
   18,  // warm copper
];

export function dnaFromRecord(
  r: Pick<LeafRecord, "id" | "createdAt" | "leafSeed" | "isPublic" | "username">,
): LeafDNA {
  const next = rng32(r.leafSeed);
  // Draw all base properties first (same order as before — ensures existing leaves don't change)
  const canopyAngle  = next() * Math.PI * 2;
  const radiusMul    = 0.55 + next() * 0.50;
  const rxMul        = 0.60 + next() * 0.75;
  const ryMul        = 0.60 + next() * 0.75;
  const scale        = 0.65 + next() * 0.80;
  const brightOffset = -0.08 + next() * 0.22;
  const veinLines    = 1 + Math.floor(next() * 3);
  // New: hue from palette + saturation (kept very low — subtle tint only)
  const hueIdx       = Math.floor(next() * HUE_PALETTE.length);
  const hue          = HUE_PALETTE[hueIdx];
  const hueSat       = 0.10 + next() * 0.18; // 0.10–0.28 — barely perceptible, more like a "warmth"

  return {
    id:          r.id,
    createdAt:   r.createdAt,
    seed:        r.leafSeed,
    canopyAngle,
    radiusMul,
    rxMul,
    ryMul,
    scale,
    brightOffset,
    veinLines,
    hue,
    hueSat,
    isPublic:    r.isPublic,
    username:    r.username,
  };
}

export function dnaFromRecords(
  records: Pick<LeafRecord, "id" | "createdAt" | "leafSeed" | "isPublic" | "username">[],
): LeafDNA[] {
  return records.map(dnaFromRecord);
}
