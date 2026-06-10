/**
 * Moonlit canvas painter — pure Canvas2D, no SVG.
 */
import type { Star } from "./stars";
import type { Branch, RootCurve, TreeData, BranchTip } from "./procedural-tree";
import type { LeafDNA } from "@/lib/types";
import { leafVisualFromDna, TREE_LEAF_SIZE_SCALE, leafRgbaFromStyle } from "@/lib/leaf-visual";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ScenePalette {
  seasonIdx: number;
  stage:     boolean;
}

export interface FallingLeaf {
  x: number; y: number;
  vx: number; vy: number;
  rot: number; rotSpeed: number;
  size: number; opacity: number;
  drift: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function paletteFromSeason(_: unknown, seasonIdx = 0, stage = false): ScenePalette {
  return { seasonIdx, stage };
}

function seasonTint(idx: number): { r: number; g: number; b: number } {
  return ([
    { r: 200, g: 216, b: 245 }, // winter
    { r: 205, g: 235, b: 215 }, // spring
    { r: 238, g: 230, b: 205 }, // summer
    { r: 242, g: 218, b: 200 }, // autumn
  ] as const)[idx] ?? { r: 200, g: 216, b: 245 };
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.min(1, Math.max(0, t));
}

function rgba(r: number, g: number, b: number, a: number) {
  return `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},${a})`;
}

function tinted(v: number, t: { r: number; g: number; b: number }, a = 1) {
  const f = v * 255;
  return rgba(lerp(f, f * t.r / 255, 0.38), lerp(f, f * t.g / 255, 0.38), lerp(f, f * t.b / 255, 0.38), a);
}

function grey(v: number, a = 1) {
  const g = Math.round(v * 255);
  return `rgba(${g},${g},${g},${a})`;
}

/**
 * Convert HSV (hue 0–360, sat 0–1, val 0–1) to an rgb() string.
 * Used for per-leaf hue tinting — kept low-saturation so it reads near B&W.
 */
function hsv(h: number, s: number, v: number, a = 1): string {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r = 0, g = 0, b = 0;
  if      (h <  60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else              { r = c; b = x; }
  return `rgba(${Math.round((r+m)*255)},${Math.round((g+m)*255)},${Math.round((b+m)*255)},${a})`;
}

// ─── Leaf path (pointed oval with optional asymmetry) ────────────────────────
// asymX > 0 bends the leaf body toward moon-side; creates natural organic curl.

function tracLeafPath(
  ctx:   CanvasRenderingContext2D,
  rx:    number,
  ry:    number,
  asymX  = 0,   // lateral bend of the leaf midpoint
  tipSharpness = 0.92, // 0.7 = blunt/round, 1.1 = very pointed
) {
  ctx.beginPath();
  ctx.moveTo(0, ry);
  ctx.bezierCurveTo(
     rx * 0.85 + asymX,  ry * 0.32,
     rx * tipSharpness + asymX, -ry * 0.32,
     0, -ry,
  );
  ctx.bezierCurveTo(
    -rx * tipSharpness + asymX, -ry * 0.32,
    -rx * 0.85 + asymX,  ry * 0.32,
     0, ry,
  );
  ctx.closePath();
}

// ─── Sky ─────────────────────────────────────────────────────────────────────

export function drawSky(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  p: ScenePalette,
) {
  const t    = seasonTint(p.seasonIdx);
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  if (p.stage) {
    grad.addColorStop(0,    "#000000");
    grad.addColorStop(0.5,  "#010205");
    grad.addColorStop(1,    "#000000");
  } else {
    grad.addColorStop(0,    "#000204");
    grad.addColorStop(0.45, "#02060e");
    grad.addColorStop(1,    "#040a16");
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Subtle nebula wash
  const neb = ctx.createRadialGradient(w * 0.35, h * 0.18, 0, w * 0.35, h * 0.18, w * 0.6);
  neb.addColorStop(0,   rgba(t.r, t.g, t.b, 0.032));
  neb.addColorStop(0.5, rgba(t.r, t.g, t.b, 0.010));
  neb.addColorStop(1,   rgba(t.r, t.g, t.b, 0));
  ctx.fillStyle = neb;
  ctx.fillRect(0, 0, w, h);
}

// ─── Stars ───────────────────────────────────────────────────────────────────

export function drawStars(
  ctx:   CanvasRenderingContext2D,
  stars: Star[],
  time:  number,
) {
  ctx.save();
  for (const s of stars) {
    const a = s.baseOpacity * (0.62 + 0.38 * Math.sin(time * s.twinkleSpeed + s.twinkleOffset));
    if (s.r > 1.3) {
      ctx.strokeStyle = `rgba(255,255,255,${a * 0.28})`;
      ctx.lineWidth   = 0.5;
      ctx.beginPath(); ctx.moveTo(s.x - s.r * 2.2, s.y); ctx.lineTo(s.x + s.r * 2.2, s.y); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(s.x, s.y - s.r * 2.2); ctx.lineTo(s.x, s.y + s.r * 2.2); ctx.stroke();
    }
    ctx.fillStyle = `rgba(255,255,255,${a})`;
    ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

// ─── Moon ────────────────────────────────────────────────────────────────────

export function drawMoon(
  ctx:   CanvasRenderingContext2D,
  w:     number,
  h:     number,
  stage  = false,
) {
  const mx = w * 0.78;
  const my = h * 0.13;
  const r  = Math.min(w, h) * (stage ? 0.078 : 0.062);

  // Outer atmospheric halo
  const halo = ctx.createRadialGradient(mx, my, r * 0.5, mx, my, r * 6.5);
  halo.addColorStop(0,    "rgba(210,225,255,0.11)");
  halo.addColorStop(0.25, "rgba(190,210,250,0.04)");
  halo.addColorStop(1,    "transparent");
  ctx.fillStyle = halo;
  ctx.beginPath(); ctx.arc(mx, my, r * 6.5, 0, Math.PI * 2); ctx.fill();

  // Atmospheric ring
  const ring = ctx.createRadialGradient(mx, my, r * 0.88, mx, my, r * 2.6);
  ring.addColorStop(0,   "rgba(230,240,255,0.20)");
  ring.addColorStop(0.4, "rgba(210,225,255,0.06)");
  ring.addColorStop(1,   "transparent");
  ctx.fillStyle = ring;
  ctx.beginPath(); ctx.arc(mx, my, r * 2.6, 0, Math.PI * 2); ctx.fill();

  // Moon disk — light source upper-left
  const disk = ctx.createRadialGradient(mx - r * 0.3, my - r * 0.25, r * 0.05, mx, my, r);
  disk.addColorStop(0,    "#f8fbff");
  disk.addColorStop(0.45, "#dae5f6");
  disk.addColorStop(0.82, "#8ba0c2");
  disk.addColorStop(1,    "#637aaa");
  ctx.fillStyle = disk;
  ctx.beginPath(); ctx.arc(mx, my, r, 0, Math.PI * 2); ctx.fill();

  // Craters
  for (const c of [
    { dx: -0.20, dy: -0.16, r: 0.15 },
    { dx:  0.14, dy:  0.12, r: 0.09 },
    { dx: -0.04, dy:  0.24, r: 0.18 },
    { dx:  0.26, dy: -0.17, r: 0.06 },
  ]) {
    const cx = mx + c.dx * r, cy = my + c.dy * r, cr = c.r * r;
    const cg = ctx.createRadialGradient(cx - cr * 0.3, cy - cr * 0.3, 0, cx, cy, cr);
    cg.addColorStop(0,   "rgba(220,232,252,0.38)");
    cg.addColorStop(0.5, "rgba(100,120,162,0.18)");
    cg.addColorStop(1,   "rgba(48,64,92,0.42)");
    ctx.fillStyle = cg;
    ctx.beginPath(); ctx.arc(cx, cy, cr, 0, Math.PI * 2); ctx.fill();
  }

  // Limb darkening
  const limb = ctx.createRadialGradient(mx, my, r * 0.6, mx, my, r);
  limb.addColorStop(0, "transparent");
  limb.addColorStop(1, "rgba(38,52,78,0.32)");
  ctx.fillStyle = limb;
  ctx.beginPath(); ctx.arc(mx, my, r, 0, Math.PI * 2); ctx.fill();
}

// ─── Ground fog ──────────────────────────────────────────────────────────────

export function drawGroundFog(
  ctx:  CanvasRenderingContext2D,
  w:    number,
  h:    number,
  p:    ScenePalette,
  time: number,
) {
  const t     = seasonTint(p.seasonIdx);
  const pulse = 0.84 + 0.16 * Math.sin(time * 0.30);
  const fog   = ctx.createRadialGradient(w * 0.5, h * 0.97, 0, w * 0.5, h * 0.97, w * 0.58);
  fog.addColorStop(0,    rgba(t.r, t.g, t.b, 0.14 * pulse));
  fog.addColorStop(0.35, rgba(t.r, t.g, t.b, 0.04 * pulse));
  fog.addColorStop(1,    rgba(t.r, t.g, t.b, 0));
  ctx.fillStyle = fog;
  ctx.fillRect(0, h * 0.70, w, h * 0.30);
}

// ─── Trunk (filled tapered shape) ────────────────────────────────────────────

function drawTrunkShape(
  ctx:    CanvasRenderingContext2D,
  root:   Branch,
  baseX:  number,
  baseY:  number,
  p:      ScenePalette,
) {
  const t    = seasonTint(p.seasonIdx);
  // The root branch goes from (baseX,baseY) → (root.x2, root.y2)
  const tx   = root.x2, ty = root.y2;
  const dx   = tx - baseX, dy = ty - baseY;
  const len  = Math.hypot(dx, dy) || 1;
  // Perpendicular
  const nx = -dy / len, ny = dx / len;

  const bw = root.width * 1.55; // base half-width
  const tw = root.width * 0.38; // tip half-width

  // Side Bezier handles (taper naturally)
  const mx1 = baseX + dx * 0.35, my1 = baseY + dy * 0.35;
  const mx2 = baseX + dx * 0.70, my2 = baseY + dy * 0.70;

  // Shadow fill
  ctx.beginPath();
  ctx.moveTo(baseX - nx * bw, baseY - ny * bw);
  ctx.bezierCurveTo(mx1 - nx * (bw * 0.7), my1 - ny * (bw * 0.7), mx2 - nx * (tw * 1.1), my2 - ny * (tw * 1.1), tx - nx * tw, ty - ny * tw);
  ctx.lineTo(tx + nx * tw, ty + ny * tw);
  ctx.bezierCurveTo(mx2 + nx * (tw * 1.1), my2 + ny * (tw * 1.1), mx1 + nx * (bw * 0.7), my1 + ny * (bw * 0.7), baseX + nx * bw, baseY + ny * bw);
  ctx.closePath();

  // Gradient across trunk width (darker at edges, mid-bright in center)
  const grad = ctx.createLinearGradient(baseX - nx * bw, baseY, baseX + nx * bw, baseY);
  const v0 = p.stage ? 0.24 : 0.20;
  const v1 = p.stage ? 0.46 : 0.40;
  const v2 = p.stage ? 0.58 : 0.52;
  grad.addColorStop(0,    tinted(v0, t, 0.95));
  grad.addColorStop(0.30, tinted(v1, t, 0.98));
  grad.addColorStop(0.55, tinted(v2, t, 1.00));
  grad.addColorStop(0.75, tinted(v1, t, 0.98));
  grad.addColorStop(1,    tinted(v0, t, 0.95));
  ctx.fillStyle = grad;
  ctx.fill();

  // Moon-lit edge highlight (right side)
  ctx.strokeStyle = tinted(p.stage ? 0.82 : 0.72, t, 0.42);
  ctx.lineWidth   = 1.5;
  ctx.beginPath();
  ctx.moveTo(baseX + nx * bw, baseY + ny * bw);
  ctx.bezierCurveTo(mx1 + nx * (bw * 0.7), my1 + ny * (bw * 0.7), mx2 + nx * (tw * 1.1), my2 + ny * (tw * 1.1), tx + nx * tw, ty + ny * tw);
  ctx.stroke();

  // Ground-fade: cover the bottom quarter of the trunk with a dark-to-transparent overlay
  // so the trunk appears to emerge from the earth rather than sitting on top of it.
  const fadeH  = Math.abs(dy) * 0.32;           // how tall the fade zone is
  const fadeTop = baseY - fadeH;
  const fade = ctx.createLinearGradient(0, fadeTop, 0, baseY + 6);
  fade.addColorStop(0,   "rgba(0,0,0,0)");
  fade.addColorStop(0.55,"rgba(0,0,0,0.55)");
  fade.addColorStop(1,   "rgba(0,0,0,0.92)");
  ctx.fillStyle = fade;
  // Fill a wide rectangle covering the whole trunk base area
  ctx.fillRect(baseX - bw - 4, fadeTop, (bw + 4) * 2, Math.abs(baseY - fadeTop) + 8);

  // Bark groove marks
  for (let i = 2; i < 11; i++) {
    const fy   = baseY + dy * (i / 11);
    const fx   = baseX + dx * (i / 11);
    const curW = lerp(bw, tw, i / 11) * 0.8;
    const tilt = Math.sin(i * 3.4) * 0.08;
    ctx.save();
    ctx.translate(fx, fy);
    ctx.rotate(tilt);
    ctx.strokeStyle = grey(0.05, 0.55 + (i % 3) * 0.08);
    ctx.lineWidth   = 1.1;
    ctx.beginPath();
    ctx.moveTo(-curW, 0);
    ctx.quadraticCurveTo(-curW * 0.35, 2, curW, 0);
    ctx.stroke();
    ctx.restore();
  }
}

// ─── Roots ───────────────────────────────────────────────────────────────────

function drawRoots(
  ctx:   CanvasRenderingContext2D,
  roots: RootCurve[],
  baseX: number,
  baseY: number,
  p:     ScenePalette,
) {
  const t = seasonTint(p.seasonIdx);
  for (const root of roots) {
    ctx.lineCap     = "round";
    ctx.strokeStyle = tinted(p.stage ? 0.32 : 0.26, t, 0.92);
    ctx.lineWidth   = root.width + 1;
    ctx.beginPath();
    ctx.moveTo(baseX, baseY);
    ctx.bezierCurveTo(root.cp1x, root.cp1y, root.cp2x, root.cp2y, root.ex, root.ey);
    ctx.stroke();

    ctx.strokeStyle = tinted(0.15, t, 0.45);
    ctx.lineWidth   = root.width * 0.35;
    ctx.beginPath();
    ctx.moveTo(baseX, baseY);
    ctx.bezierCurveTo(root.cp1x, root.cp1y, root.cp2x, root.cp2y, root.ex, root.ey);
    ctx.stroke();
  }
}

// ─── Branches (recursive) ────────────────────────────────────────────────────

function drawBranch(
  ctx:      CanvasRenderingContext2D,
  branch:   Branch,
  t:        { r: number; g: number; b: number },
  moonX:    number,
  moonY:    number,
  maxDepth: number,
  time:     number,
  stage:    boolean,
) {
  // Skip depth=0 — trunk handles it separately
  if (branch.depth > 0) {
    const bv = Math.min(1, branch.brightness + (stage ? 0.16 : 0.10));

    // Shadow
    ctx.strokeStyle = grey(bv * 0.28, 0.85);
    ctx.lineWidth   = branch.width + 0.8;
    ctx.lineCap     = "round";
    ctx.lineJoin    = "round";
    ctx.beginPath();
    ctx.moveTo(branch.x1, branch.y1);
    ctx.bezierCurveTo(branch.cpx1, branch.cpy1, branch.cpx2, branch.cpy2, branch.x2, branch.y2);
    ctx.stroke();

    // Main
    ctx.strokeStyle = tinted(bv, t, 0.95);
    ctx.lineWidth   = branch.width;
    ctx.beginPath();
    ctx.moveTo(branch.x1, branch.y1);
    ctx.bezierCurveTo(branch.cpx1, branch.cpy1, branch.cpx2, branch.cpy2, branch.x2, branch.y2);
    ctx.stroke();

    // Moon-lit highlight edge
    if (branch.width > 0.7) {
      const dx    = branch.x2 - branch.x1;
      const dy    = branch.y2 - branch.y1;
      const len   = Math.hypot(dx, dy) || 1;
      const tMx   = moonX - (branch.x1 + branch.x2) * 0.5;
      const tMy   = moonY - (branch.y1 + branch.y2) * 0.5;
      const dot   = (-dy / len) * tMx + (dx / len) * tMy;
      const sign  = dot > 0 ? 1 : -1;
      const off   = branch.width * 0.28;
      const nx    = (-dy / len) * sign * off;
      const ny    = ( dx / len) * sign * off;

      ctx.strokeStyle = tinted(bv + 0.22, t, 0.18 * branch.brightness);
      ctx.lineWidth   = Math.max(0.3, branch.width * 0.10);
      ctx.beginPath();
      ctx.moveTo(branch.x1 + nx, branch.y1 + ny);
      ctx.bezierCurveTo(
        branch.cpx1 + nx, branch.cpy1 + ny,
        branch.cpx2 + nx, branch.cpy2 + ny,
        branch.x2 + nx,   branch.y2 + ny,
      );
      ctx.stroke();
    }
  }

  for (const child of branch.children) {
    drawBranch(ctx, child, t, moonX, moonY, maxDepth, time, stage);
  }
}

// ─── Audience leaves — anchored to real branch tips ──────────────────────────
// Each leaf is placed at a real tip position from TreeData.tipPositions.
// The tip index is derived deterministically from dna.seed so it never changes.
// DNA-based offsets fan multiple leaves away from the same tip so they stay visible.

function audienceLeafTipIndex(dna: LeafDNA, tipCount: number): number {
  if (tipCount <= 0) return 0;
  return ((dna.seed * 2654435761) >>> 0) % tipCount;
}

function audienceLeafOffset(dna: LeafDNA, tip: BranchTip) {
  const r1 = 4 + dna.radiusMul * 14;
  const a1 = dna.canopyAngle;
  const r2 = 2 + dna.rxMul * 8;
  const a2 = dna.brightOffset * Math.PI * 7 + dna.ryMul * 2.1;
  return {
    x: tip.x + Math.cos(a1) * r1 + Math.cos(a2) * r2,
    y: tip.y + Math.sin(a1) * r1 + Math.sin(a2) * r2,
  };
}

/** Keep leaves inside the canopy ellipse so they don't float off the tree */
function clampLeafToCanopy(
  x: number,
  y: number,
  bx: number,
  by: number,
  trunkH: number,
): { x: number; y: number } {
  const cx = bx;
  const cy = by - trunkH * 0.52;
  const rx = trunkH * 0.50;
  const ry = trunkH * 0.38;
  const minY = by - trunkH * 0.92;
  const maxY = by - trunkH * 0.14;

  let py = Math.min(maxY, Math.max(minY, y));
  const dy = (py - cy) / ry;
  const dxMax = rx * Math.sqrt(Math.max(0.05, 1 - dy * dy));
  const px = Math.min(cx + dxMax * 0.92, Math.max(cx - dxMax * 0.92, x));
  return { x: px, y: py };
}

export function audienceLeafAnchor(
  tips:     BranchTip[],
  dna:      LeafDNA | undefined,
  treeScale: number,
  w:        number,
  h:        number,
) {
  const tcx = w * 0.5;
  const tcy = h * 0.88;
  const toScreen = (x: number, y: number) => ({
    x: tcx + (x - tcx) * treeScale,
    y: tcy + (y - tcy) * treeScale,
  });

  if (tips.length === 0) {
    return { x: w * 0.52, y: h * 0.38, rot: -0.4, rx: 12, ry: 7 };
  }

  const tipIdx = dna ? audienceLeafTipIndex(dna, tips.length) : Math.floor(tips.length * 0.42);
  const tip    = tips[tipIdx];
  const { x: rawX, y: rawY } = dna ? audienceLeafOffset(dna, tip) : { x: tip.x, y: tip.y };
  const { x, y } = toScreen(rawX, rawY);

  const fan  = dna ? (dna.brightOffset - 0.5) * 0.62 : 0;
  const rot  = tip.angle + fan;
  const depthFactor = lerp(1.3, 0.82, tip.depth / 7);
  let rx = 11 * depthFactor * treeScale;
  let ry = 7 * depthFactor * treeScale;
  if (dna) {
    const vis = leafVisualFromDna(dna, TREE_LEAF_SIZE_SCALE * depthFactor * treeScale);
    rx = vis.rx;
    ry = vis.ry;
  }
  return { x, y, rot, rx, ry };
}

export function drawAudienceLeaves(
  ctx:      CanvasRenderingContext2D,
  leaves:   LeafDNA[],
  tips:     BranchTip[],
  p:        ScenePalette,
  time:     number,
  newestId?: string,
  seasonMorphPulse = 0,
  hideNewestId?:    string,
  canopy?:  { bx: number; by: number; trunkH: number },
) {
  if (leaves.length === 0 || tips.length === 0) return;
  const sz = p.stage ? 1.35 : 1.0;
  const morph = Math.sin(Math.min(1, Math.max(0, seasonMorphPulse)) * Math.PI);

  for (const dna of leaves) {
    if (hideNewestId && dna.id === hideNewestId) continue;
    const tipIdx = audienceLeafTipIndex(dna, tips.length);
    const tip    = tips[tipIdx];
    let { x, y } = audienceLeafOffset(dna, tip);
    if (canopy) {
      ({ x, y } = clampLeafToCanopy(x, y, canopy.bx, canopy.by, canopy.trunkH));
    }

    const fan  = (dna.brightOffset - 0.5) * 0.85;
    const sway = Math.sin(time * 0.35 + dna.seed * 0.00009) * 0.055;
    const rot  = tip.angle + fan + sway + (dna.rxMul - dna.ryMul) * 0.12;

    const depthFactor = lerp(1.3, 0.82, tip.depth / 7);
    const morphScale  = 1 + morph * 0.08;
    const sizeScale   = TREE_LEAF_SIZE_SCALE * sz * depthFactor * morphScale * (0.88 + dna.scale * 0.18);
    const vis = leafVisualFromDna(dna, sizeScale);
    const { rx, ry } = vis;

    const leafCol = (lightnessMult: number, a: number) =>
      leafRgbaFromStyle(vis, a, lightnessMult);

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);

    if (dna.isPublic && dna.username) {
      const fontSize = Math.max(8, Math.min(14, rx * 0.72));
      ctx.font = `500 ${fontSize}px system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = leafCol(0.78, p.stage ? 0.38 : 0.28);
      ctx.fillText(dna.username, 0, 0);
    }

    ctx.shadowColor = leafCol(1, 0.50);
    ctx.shadowBlur  = (p.stage ? 7 : 4) + morph * (p.stage ? 10 : 6);

    const isNew = dna.id === newestId;
    if (isNew) {
      const pulse = 0.55 + 0.45 * Math.sin(time * 3.4);
      ctx.shadowColor = leafCol(1, p.stage ? 0.95 : 0.82);
      ctx.shadowBlur  = (p.stage ? 44 : 28) * pulse;
    }

    const grad = ctx.createLinearGradient(0, ry, 0, -ry);
    grad.addColorStop(0,    leafCol(0.72, p.stage ? 0.78 : 0.65));
    grad.addColorStop(0.45, leafCol(1,    p.stage ? 1.00 : 0.94));
    grad.addColorStop(1,    leafCol(0.88, p.stage ? 0.88 : 0.76));
    ctx.fillStyle = grad;
    const tipSharp = 0.74 + dna.rxMul * 0.24 + (dna.veinLines - 1) * 0.05;
    const asym     = (dna.rxMul - dna.ryMul) * rx * 0.22;
    tracLeafPath(ctx, rx, ry, asym, tipSharp);
    ctx.fill();

    ctx.shadowBlur = 0;

    ctx.strokeStyle = leafCol(1.08, p.stage ? 0.62 : 0.48);
    ctx.lineWidth   = 0.55;
    ctx.lineCap     = "round";
    ctx.beginPath();
    ctx.moveTo(0,  ry * 0.85);
    ctx.lineTo(0, -ry * 0.82);
    ctx.stroke();

    ctx.strokeStyle = leafCol(1, p.stage ? 0.34 : 0.22);
    ctx.lineWidth   = 0.4;
    const vx = 0, vy = ry * 0.18;
    for (const side of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(vx, vy);
      ctx.lineTo(vx + side * rx * 0.55, vy - ry * 0.40);
      ctx.stroke();
    }

    ctx.restore();
  }
}

// ─── Distant forest silhouettes ──────────────────────────────────────────────
// Draws 20+ small glowing tree silhouettes to create a "cosmos of purposes"
// effect behind the main tree during the forest_zoom sections.
// All positions/shapes are deterministic — no per-frame randomness.

const FOREST_SLOTS: Array<{ fx: number; fy: number; depth: number; phase: number }> = [
  // Ground row (near foreground — largest / brightest)
  { fx: 0.08, fy: 0.97, depth: 0.15, phase: 0.0  },
  { fx: 0.22, fy: 0.96, depth: 0.20, phase: 1.1  },
  { fx: 0.38, fy: 0.98, depth: 0.18, phase: 2.3  },
  { fx: 0.63, fy: 0.97, depth: 0.17, phase: 0.8  },
  { fx: 0.78, fy: 0.96, depth: 0.22, phase: 3.1  },
  { fx: 0.93, fy: 0.97, depth: 0.14, phase: 1.9  },
  // Mid-ground row
  { fx: 0.06, fy: 0.88, depth: 0.36, phase: 2.7  },
  { fx: 0.18, fy: 0.86, depth: 0.38, phase: 0.4  },
  { fx: 0.32, fy: 0.87, depth: 0.35, phase: 3.6  },
  { fx: 0.68, fy: 0.86, depth: 0.40, phase: 1.5  },
  { fx: 0.82, fy: 0.88, depth: 0.33, phase: 4.2  },
  { fx: 0.95, fy: 0.87, depth: 0.37, phase: 0.9  },
  // Far mid row
  { fx: 0.12, fy: 0.76, depth: 0.58, phase: 5.1  },
  { fx: 0.28, fy: 0.75, depth: 0.62, phase: 2.0  },
  { fx: 0.44, fy: 0.77, depth: 0.55, phase: 3.3  },
  { fx: 0.58, fy: 0.74, depth: 0.60, phase: 0.6  },
  { fx: 0.74, fy: 0.76, depth: 0.57, phase: 4.8  },
  { fx: 0.88, fy: 0.75, depth: 0.63, phase: 1.3  },
  // Distant background (tiny — like stars)
  { fx: 0.09, fy: 0.64, depth: 0.78, phase: 3.8  },
  { fx: 0.25, fy: 0.62, depth: 0.82, phase: 0.2  },
  { fx: 0.42, fy: 0.65, depth: 0.76, phase: 5.5  },
  { fx: 0.60, fy: 0.63, depth: 0.80, phase: 2.5  },
  { fx: 0.77, fy: 0.64, depth: 0.79, phase: 1.8  },
  { fx: 0.92, fy: 0.62, depth: 0.83, phase: 4.0  },
  // Ultra-distant specks
  { fx: 0.16, fy: 0.52, depth: 0.92, phase: 0.7  },
  { fx: 0.36, fy: 0.50, depth: 0.94, phase: 3.2  },
  { fx: 0.55, fy: 0.53, depth: 0.91, phase: 1.6  },
  { fx: 0.72, fy: 0.51, depth: 0.95, phase: 4.5  },
];

export function drawDistantForest(
  ctx:  CanvasRenderingContext2D,
  w:    number,
  h:    number,
  p:    ScenePalette,
  time: number,
) {
  const t = seasonTint(p.seasonIdx);

  // Deep atmospheric darkening at the horizon to silhouette the trees
  const horizonGrad = ctx.createLinearGradient(0, h * 0.50, 0, h);
  horizonGrad.addColorStop(0,   "rgba(0,0,0,0)");
  horizonGrad.addColorStop(0.6, "rgba(0,0,0,0.28)");
  horizonGrad.addColorStop(1,   "rgba(0,0,0,0.55)");
  ctx.fillStyle = horizonGrad;
  ctx.fillRect(0, h * 0.50, w, h * 0.50);

  for (const s of FOREST_SLOTS) {
    // Only far-background specks — labeled hero trees live in ForestSpaceOverlay
    if (s.depth < 0.55) continue;

    // depth 0 = foreground (near), 1 = distant (far)
    const treeH = h * lerp(0.34, 0.022, s.depth);
    const bx    = s.fx * w;
    const by    = s.fy * h;
    const op    = lerp(0.88, 0.12, s.depth) * (p.stage ? 1.15 : 1.0);
    const sway  = Math.sin(time * 0.22 + s.phase) * 0.018 * lerp(1, 0.4, s.depth);
    const bv    = lerp(0.68, 0.32, s.depth) * (p.stage ? 1.2 : 1.0);
    const lw    = Math.max(0.5, treeH * 0.055);

    ctx.save();
    ctx.globalAlpha = op;

    // Soft atmospheric glow around canopy
    const glowR  = treeH * lerp(1.1, 0.85, s.depth);
    const gAlpha = lerp(0.22, 0.08, s.depth);
    const glow   = ctx.createRadialGradient(
      bx, by - treeH * 0.72, 0,
      bx, by - treeH * 0.72, glowR,
    );
    glow.addColorStop(0,   rgba(t.r * 1.15, t.g * 1.15, t.b * 1.25, gAlpha));
    glow.addColorStop(0.5, rgba(t.r, t.g, t.b, gAlpha * 0.35));
    glow.addColorStop(1,   rgba(t.r, t.g, t.b, 0));
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(bx, by - treeH * 0.72, glowR, 0, Math.PI * 2);
    ctx.fill();

    // Solid canopy silhouette — this is what makes the trees clearly readable
    const canopyR  = treeH * lerp(0.38, 0.22, s.depth);
    const canopyY  = by - treeH * 0.78;
    const canopyFill = ctx.createRadialGradient(
      bx, canopyY, 0,
      bx, canopyY, canopyR,
    );
    const cAlpha = lerp(0.82, 0.30, s.depth);
    canopyFill.addColorStop(0,   tinted(bv * 0.65, t, cAlpha));
    canopyFill.addColorStop(0.7, tinted(bv * 0.50, t, cAlpha * 0.80));
    canopyFill.addColorStop(1,   tinted(bv * 0.35, t, 0));
    ctx.fillStyle = canopyFill;
    ctx.beginPath();
    ctx.ellipse(bx, canopyY, canopyR, canopyR * 0.88, 0, 0, Math.PI * 2);
    ctx.fill();

    // Trunk + branches (sway applied via transform)
    ctx.save();
    ctx.translate(bx, by);
    ctx.rotate(sway);
    ctx.translate(-bx, -by);

    const col = tinted(bv, t, 0.95);
    ctx.strokeStyle = col;
    ctx.lineCap     = "round";
    ctx.lineJoin    = "round";

    // Trunk
    ctx.lineWidth = lw;
    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.bezierCurveTo(
      bx + treeH * 0.04, by - treeH * 0.22,
      bx - treeH * 0.02, by - treeH * 0.42,
      bx,                by - treeH * 0.52,
    );
    ctx.stroke();

    // Main branches
    ctx.lineWidth = lw * 0.72;
    ctx.beginPath();
    ctx.moveTo(bx,                 by - treeH * 0.30);
    ctx.bezierCurveTo(
      bx - treeH * 0.12, by - treeH * 0.54,
      bx - treeH * 0.30, by - treeH * 0.74,
      bx - treeH * 0.34, by - treeH * 0.86,
    );
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(bx,                 by - treeH * 0.36);
    ctx.bezierCurveTo(
      bx + treeH * 0.14, by - treeH * 0.56,
      bx + treeH * 0.28, by - treeH * 0.72,
      bx + treeH * 0.30, by - treeH * 0.84,
    );
    ctx.stroke();

    // Upper twigs (only on near/mid trees)
    if (s.depth < 0.78) {
      ctx.lineWidth = lw * 0.48;
      ctx.beginPath();
      ctx.moveTo(bx,                 by - treeH * 0.52);
      ctx.lineTo(bx - treeH * 0.15,  by - treeH * 1.00);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(bx,                 by - treeH * 0.52);
      ctx.lineTo(bx + treeH * 0.12,  by - treeH * 0.98);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(bx,                 by - treeH * 0.52);
      ctx.lineTo(bx,                  by - treeH * 1.06);
      ctx.stroke();
    }

    ctx.restore(); // sway
    ctx.restore(); // opacity
  }
}

// ─── Full tree draw ───────────────────────────────────────────────────────────

export function drawTree(
  ctx:           CanvasRenderingContext2D,
  tree:          TreeData,
  p:             ScenePalette,
  w:             number,
  h:             number,
  sway:          number,
  time:          number,
  audienceLeaves: LeafDNA[],
  newestLeafId?:  string,
  seasonMorphPulse = 0,
  hideNewestId?:    string,
  treeAlpha = 1,
  isFinale = false,
) {
  const t = seasonTint(p.seasonIdx);
  const { trunkBaseX: bx, trunkBaseY: by, trunkH, moonX, moonY, maxDepth } = tree;

  ctx.save();
  ctx.globalAlpha = treeAlpha;

  // Wind sway — branches AND leaves sway together
  ctx.save();
  ctx.translate(bx, by);
  ctx.rotate(sway);
  ctx.translate(-bx, -by);

  drawTrunkShape(ctx, tree.root, bx, by, p);
  drawBranch(ctx, tree.root, t, moonX, moonY, maxDepth, time, p.stage);

  // Draw leaves inside the sway so they sit on the branches correctly
  drawAudienceLeaves(
    ctx, audienceLeaves, tree.tipPositions, p, time, newestLeafId,
    seasonMorphPulse, hideNewestId,
    { bx, by, trunkH },
  );

  ctx.restore(); // end sway

  // Canopy glow halo — drawn while globalAlpha = treeAlpha is still active
  if (audienceLeaves.length > 0) {
    const canopyCx = bx;
    const canopyCy = by - trunkH * 0.82;
    const rgb  = `${t.r},${t.g},${t.b}`;
    // Finale gets a double-radius bloom
    const radius  = isFinale ? w * 0.46 : w * 0.30;
    const opacity = isFinale
      ? (p.stage ? 0.22 : 0.14)
      : (p.stage ? 0.11 : 0.06);
    const glow = ctx.createRadialGradient(canopyCx, canopyCy, 0, canopyCx, canopyCy, radius);
    glow.addColorStop(0,   `rgba(${rgb},${opacity})`);
    glow.addColorStop(0.5, `rgba(${rgb},${opacity * 0.45})`);
    glow.addColorStop(1,   `rgba(${rgb},0)`);
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.ellipse(canopyCx, canopyCy, radius, h * (isFinale ? 0.36 : 0.22), 0, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore(); // end globalAlpha = treeAlpha
}

// ─── Macro leaf (ASI speech) ──────────────────────────────────────────────────

const STORY_VEINS = [
  { x1: 0,    y1:  0.42, x2:  0,    y2: -0.38, w: 2.8 },
  { x1: 0,    y1:  0.32, x2: -0.22, y2: -0.05, w: 2.2 },
  { x1: 0,    y1:  0.32, x2:  0.22, y2: -0.05, w: 2.2 },
  { x1: 0,    y1:  0.22, x2: -0.14, y2: -0.18, w: 1.9 },
  { x1: 0,    y1:  0.22, x2:  0.14, y2: -0.18, w: 1.9 },
  { x1: 0,    y1:  0.12, x2: -0.10, y2: -0.22, w: 1.7 },
  { x1: 0,    y1:  0.12, x2:  0.10, y2: -0.22, w: 1.7 },
  { x1: 0,    y1:  0.02, x2: -0.08, y2: -0.28, w: 1.5 },
  { x1: 0,    y1:  0.02, x2:  0.08, y2: -0.28, w: 1.5 },
];

export function drawMacroLeaf(
  ctx:       CanvasRenderingContext2D,
  cx:        number,
  cy:        number,
  radius:    number,
  p:         ScenePalette,
  veinCount: number,
  zoomT:     number,
  time:      number,
  veinAnim:  number,
  label?:    string,
  stage =    false,
) {
  const t   = seasonTint(p.seasonIdx);
  const rgb = `${t.r},${t.g},${t.b}`;

  ctx.save();
  ctx.translate(cx, cy);

  // Glow
  const glow = ctx.createRadialGradient(0, 0, radius * 0.05, 0, 0, radius * 1.6);
  glow.addColorStop(0,   `rgba(${rgb},0.09)`);
  glow.addColorStop(1,   `rgba(${rgb},0)`);
  ctx.fillStyle = glow;
  ctx.beginPath(); ctx.arc(0, 0, radius * 1.6, 0, Math.PI * 2); ctx.fill();

  function macroLeafPath() {
    const r = radius;
    ctx.beginPath();
    ctx.moveTo(0, r * 0.92);
    ctx.bezierCurveTo( r*0.55,  r*0.74,  r*0.62,  r*0.10,  r*0.35, -r*0.36);
    ctx.bezierCurveTo( r*0.20, -r*0.56,  0,       -r*0.62,  0,      -r*0.62);
    ctx.bezierCurveTo( 0,      -r*0.62, -r*0.20,  -r*0.56, -r*0.35, -r*0.36);
    ctx.bezierCurveTo(-r*0.62,  r*0.10, -r*0.55,   r*0.74,  0,       r*0.92);
    ctx.closePath();
  }

  const lfGrad = ctx.createRadialGradient(0, -radius * 0.2, 0, 0, 0, radius);
  lfGrad.addColorStop(0,   `rgba(${rgb},0.28)`);
  lfGrad.addColorStop(0.7, `rgba(${rgb},0.11)`);
  lfGrad.addColorStop(1,   `rgba(${rgb},0.03)`);
  macroLeafPath();
  ctx.fillStyle = lfGrad;
  ctx.fill();

  macroLeafPath();
  ctx.strokeStyle = `rgba(${rgb},0.26)`;
  ctx.lineWidth   = 1;
  ctx.stroke();

  ctx.save();
  macroLeafPath();
  ctx.clip();

  const visible = Math.min(veinCount, STORY_VEINS.length);

  if (visible < STORY_VEINS.length && zoomT < 0.45) {
    ctx.globalAlpha = 0.07;
    ctx.strokeStyle = `rgb(${rgb})`;
    ctx.lineWidth   = 1;
    for (let i = visible; i < STORY_VEINS.length; i++) {
      const v = STORY_VEINS[i];
      ctx.beginPath();
      ctx.moveTo(v.x1 * radius, v.y1 * radius);
      ctx.lineTo(v.x2 * radius, v.y2 * radius);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  for (let i = 0; i < visible; i++) {
    const v    = STORY_VEINS[i];
    const isNw = i === visible - 1;
    const prog = isNw ? Math.min(1, veinAnim) : 1;
    const x1   = v.x1 * radius, y1 = v.y1 * radius;
    const x2   = x1 + (v.x2 * radius - x1) * prog;
    const y2   = y1 + (v.y2 * radius - y1) * prog;

    ctx.shadowColor = `rgba(${rgb},0.50)`;
    ctx.shadowBlur  = 10;
    const vg = ctx.createLinearGradient(x1, y1, x2, y2);
    vg.addColorStop(0,   `rgba(${rgb},0.42)`);
    vg.addColorStop(0.6, `rgba(${rgb},0.90)`);
    vg.addColorStop(1,   "rgba(255,255,255,0.95)");
    ctx.strokeStyle = vg;
    ctx.lineWidth   = v.w;
    ctx.lineCap     = "round";
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    ctx.shadowBlur  = 0;
  }
  ctx.restore();

  // Optional label near the bottom of the leaf (e.g. "You appear")
  if (label) {
    const fontSize = Math.max(22, radius * (stage ? 0.17 : 0.14));
    ctx.font         = `500 ${fontSize}px Georgia, "Times New Roman", serif`;
    ctx.textAlign    = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle    = `rgba(248,252,255,${stage ? 0.98 : 0.92})`;
    ctx.shadowColor  = `rgba(${rgb},0.70)`;
    ctx.shadowBlur   = stage ? 22 : 14;
    ctx.fillText(label, 0, radius * 0.76);
    ctx.shadowBlur   = 0;
  }

  ctx.restore();
}

// ─── Falling leaves ───────────────────────────────────────────────────────────

export function updateFallingLeaves(
  leaves:   FallingLeaf[],
  w:        number,
  h:        number,
  wind:     number,
  dt:       number,
  maxCount: number,
): FallingLeaf[] {
  const out: FallingLeaf[] = [];
  for (const L of leaves) {
    const vx      = L.vx + wind * 7 * dt;
    const vy      = L.vy + 16 * dt;
    const turbX   = Math.sin(L.drift + (L.y / (h || 1)) * 4) * 0.22;
    const x       = L.x + (vx + turbX) * dt * 60;
    const y       = L.y + vy * dt * 60;
    const rot     = L.rot + L.rotSpeed * dt;
    const opacity = L.opacity - 0.25 * dt;
    if (y < h + 50 && opacity > 0) out.push({ ...L, x, y, vx, vy, rot, opacity });
  }
  const target = maxCount > 0 ? Math.min(12, maxCount) : 0;
  while (out.length < target) {
    out.push({
      x:        w * 0.3 + Math.random() * w * 0.4,
      y:        -20 - Math.random() * 60,
      vx:       (Math.random() - 0.5) * 0.25,
      vy:       0.20 + Math.random() * 0.35,
      rot:      Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 1.4,
      size:     0.5 + Math.random() * 0.6,
      opacity:  0.40 + Math.random() * 0.40,
      drift:    Math.random() * Math.PI * 2,
    });
  }
  return out.slice(0, 16);
}

export function drawFallingLeaves(
  ctx:    CanvasRenderingContext2D,
  leaves: FallingLeaf[],
  p:      ScenePalette,
) {
  const t = seasonTint(p.seasonIdx);
  for (const L of leaves) {
    ctx.save();
    ctx.translate(L.x, L.y);
    ctx.rotate(L.rot);
    ctx.globalAlpha = L.opacity;

    const rx = 9 * L.size, ry = 5.5 * L.size;

    const grad = ctx.createLinearGradient(0, ry, 0, -ry);
    grad.addColorStop(0,   tinted(0.68, t, 0.70));
    grad.addColorStop(0.5, tinted(0.88, t, 0.92));
    grad.addColorStop(1,   tinted(0.78, t, 0.75));
    ctx.fillStyle = grad;
    tracLeafPath(ctx, rx, ry);
    ctx.fill();

    ctx.restore();
  }
  ctx.globalAlpha = 1;
}
