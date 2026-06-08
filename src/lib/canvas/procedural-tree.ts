import { mulberry32, hashSeed } from "./prng";

export interface Branch {
  x1: number; y1: number;
  x2: number; y2: number;
  cpx1: number; cpy1: number;
  cpx2: number; cpy2: number;
  width:      number;
  depth:      number;
  brightness: number;
  children:   Branch[];
}

export interface RootCurve {
  cp1x: number; cp1y: number;
  cp2x: number; cp2y: number;
  ex:   number; ey:   number;
  width: number;
}

/** A position at a branch tip — used to anchor audience leaves */
export interface BranchTip {
  x:      number;
  y:      number;
  /** outward angle of the branch at this tip (radians) */
  angle:  number;
  /** depth from root — deeper = thinner branch = smaller leaf */
  depth:  number;
}

export interface TreeData {
  root:        Branch;
  roots:       RootCurve[];
  trunkBaseX:  number;
  trunkBaseY:  number;
  trunkH:      number;
  moonX:       number;
  moonY:       number;
  maxDepth:    number;
  /** All terminal branch tips — audience leaves are placed here */
  tipPositions: BranchTip[];
}

// Keep for type compat
export interface TipLeaf {
  x: number; y: number;
  rx: number; ry: number;
  angle: number; opacity: number;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.min(1, Math.max(0, t));
}

function buildBranch(
  rng:      () => number,
  x:        number,
  y:        number,
  angle:    number,
  length:   number,
  width:    number,
  depth:    number,
  maxDepth: number,
  moonX:    number,
  moonY:    number,
): Branch {
  const jitter = (rng() - 0.5) * (0.15 + depth * 0.05);
  const a = angle + jitter;

  const x2 = x + Math.cos(a) * length;
  const y2 = y + Math.sin(a) * length;

  const midX   = (x + x2) * 0.5;
  const midY   = (y + y2) * 0.5;
  const toDx   = moonX - midX;
  const toDy   = moonY - midY;
  const toLen  = Math.hypot(toDx, toDy) || 1;
  const bendStr = length * 0.10 * (depth / maxDepth) * (0.7 + rng() * 0.6);
  const bx = (toDx / toLen) * bendStr;
  const by = (toDy / toLen) * bendStr;

  const cpx1 = x + (x2 - x) * (0.28 + rng() * 0.12) + bx * 0.5;
  const cpy1 = y + (y2 - y) * (0.28 + rng() * 0.12) + by * 0.5;
  const cpx2 = x + (x2 - x) * (0.62 + rng() * 0.12) + bx;
  const cpy2 = y + (y2 - y) * (0.62 + rng() * 0.12) + by;

  const brightness = lerp(0.28, 0.88, depth / maxDepth);

  const branch: Branch = {
    x1: x, y1: y, x2, y2,
    cpx1, cpy1, cpx2, cpy2,
    width, depth, brightness,
    children: [],
  };

  if (depth >= maxDepth || length < 5) return branch;

  const childCount = rng() > 0.65 ? 3 : 2;
  const baseSpread = 0.38 + rng() * 0.28;

  for (let i = 0; i < childCount; i++) {
    const side       = i === 0 ? -1 : (i === 1 ? 1 : (rng() - 0.5) * 1.4);
    const spread     = baseSpread * (0.80 + rng() * 0.40);
    const childAngle = a + side * spread + (rng() - 0.5) * 0.10;
    const lenMul     = i < 2 ? 0.60 + rng() * 0.18 : 0.40 + rng() * 0.15;
    const widMul     = i < 2 ? 0.65 + rng() * 0.08 : 0.48 + rng() * 0.12;

    branch.children.push(
      buildBranch(rng, x2, y2, childAngle, length * lenMul, width * widMul,
        depth + 1, maxDepth, moonX, moonY)
    );
  }
  return branch;
}

/** Recursively collect all terminal branch tips (leaves can grow here) */
function collectTips(branch: Branch, tips: BranchTip[]) {
  if (branch.children.length === 0) {
    // Terminal tip — outward angle = direction from start to end
    const angle = Math.atan2(branch.y2 - branch.y1, branch.x2 - branch.x1);
    tips.push({ x: branch.x2, y: branch.y2, angle, depth: branch.depth });
    return;
  }
  for (const child of branch.children) {
    collectTips(child, tips);
  }
}

function buildRoots(
  rng:   () => number,
  baseX: number,
  baseY: number,
  count: number,
): RootCurve[] {
  const roots: RootCurve[] = [];
  for (let i = 0; i < count; i++) {
    const side  = i % 2 === 0 ? -1 : 1;
    const angle = (Math.PI / 2) + side * (0.6 + rng() * 0.8);
    const len   = 40 + rng() * 55;
    roots.push({
      cp1x: baseX + Math.cos(angle) * len * 0.35,
      cp1y: baseY + 8  + rng() * 10,
      cp2x: baseX + Math.cos(angle) * len * 0.70,
      cp2y: baseY + 22 + rng() * 16,
      ex:   baseX + Math.cos(angle) * len,
      ey:   baseY + 34 + rng() * 18,
      width: 3.2 - i * 0.22 + rng() * 0.7,
    });
  }
  return roots;
}

export function buildTree(
  seed: number | string,
  w:    number,
  h:    number,
): TreeData {
  const rng      = mulberry32(hashSeed("tree", seed, w, h));
  const baseX    = w * 0.5;
  const baseY    = h * 0.92;   // push base a little lower so trunk emerges from ground
  const trunkH   = h * 0.44;  // taller tree
  const moonX    = w * 0.78;
  const moonY    = h * 0.13;
  const maxDepth = 7;

  const root = buildBranch(
    rng,
    baseX, baseY,
    -Math.PI / 2,
    trunkH * 0.72,
    18,
    0,
    maxDepth,
    moonX, moonY,
  );

  const tipPositions: BranchTip[] = [];
  collectTips(root, tipPositions);

  return {
    root,
    roots: buildRoots(rng, baseX, baseY, 5),
    trunkBaseX: baseX,
    trunkBaseY: baseY,
    trunkH,
    moonX,
    moonY,
    maxDepth,
    tipPositions,
  };
}
