import { mulberry32, hashSeed } from "./prng";

export interface Star {
  x: number;
  y: number;
  r: number;
  baseOpacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

export function generateStars(
  count: number,
  width: number,
  height: number,
  seed = 42
): Star[] {
  const rng = mulberry32(hashSeed("stars", seed, width));
  return Array.from({ length: count }, () => ({
    x: rng() * width,
    y: rng() * height * 0.72,
    r: 0.4 + rng() * 1.8,
    baseOpacity: 0.15 + rng() * 0.75,
    twinkleSpeed: 1.5 + rng() * 4,
    twinkleOffset: rng() * Math.PI * 2,
  }));
}
