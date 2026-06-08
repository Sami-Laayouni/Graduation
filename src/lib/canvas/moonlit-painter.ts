/**
 * Moonlit canvas painter — pure Canvas2D, no SVG.
 */
import type { Star } from "./stars";
import type { Branch, RootCurve, TreeData, BranchTip } from "./procedural-tree";
import type { LeafDNA } from "@/lib/types";

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
// A tiny DNA-based offset lets multiple leaves cluster around the same tip naturally.

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

  const tipIdx = dna ? dna.seed % tips.length : Math.floor(tips.length * 0.42);
  const tip    = tips[tipIdx];
  const offAngle = dna?.canopyAngle ?? 0.5;
  const offR     = dna ? 2 + dna.radiusMul * 8 : 5;
  const rawX = tip.x + Math.cos(offAngle) * offR;
  const rawY = tip.y + Math.sin(offAngle) * offR;
  const { x, y } = toScreen(rawX, rawY);

  const fan  = dna ? (dna.brightOffset - 0.5) * 0.62 : 0;
  const rot  = tip.angle + fan;
  const depthFactor = lerp(1.3, 0.82, tip.depth / 7);
  const rx = dna
    ? (8 + dna.rxMul * 7) * dna.scale * depthFactor
    : 11 * depthFactor;
  const ry = dna
    ? (5 + dna.ryMul * 4) * dna.scale * depthFactor
    : 7 * depthFactor;

  return { x, y, rot, rx, ry };
}

function seasonLeafTint(seasonIdx: number): { h: number; s: number } {
  // Moonlit B&W palette — each season shifts leaves naturally, never rainbow
  return ([
    { h: 212, s: 0.09 },  // winter — frosty blue-white
    { h: 118, s: 0.15 },  // spring — soft green
    { h: 98,  s: 0.22 },  // summer — lush green
    { h: 32,  s: 0.17 },  // autumn — warm amber
  ] as const)[seasonIdx] ?? { h: 210, s: 0.10 };
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
) {
  if (leaves.length === 0 || tips.length === 0) return;
  const t  = seasonTint(p.seasonIdx);
  const sz = p.stage ? 1.35 : 1.0;
  const morph = Math.sin(Math.min(1, Math.max(0, seasonMorphPulse)) * Math.PI);
  const seasonLeaf = seasonLeafTint(p.seasonIdx);

  for (const dna of leaves) {
    if (hideNewestId && dna.id === hideNewestId) continue;
    const tipIdx = dna.seed % tips.length;
    const tip    = tips[tipIdx];

    // Small scatter so multiple leaves at the same tip fan out naturally
    const offAngle = dna.canopyAngle;
    const offR     = 2 + dna.radiusMul * 8;
    const x = tip.x + Math.cos(offAngle) * offR;
    const y = tip.y + Math.sin(offAngle) * offR;

    // Orientation: follow the branch direction + very gentle individual fan (±18°)
    const fan  = (dna.brightOffset - 0.5) * 0.62; // ±0.31 rad — subtle, stays readable
    const sway = Math.sin(time * 0.35 + dna.seed * 0.00009) * 0.055;
    const rot  = tip.angle + fan + sway;

    // Consistent leaf shape — no extreme asymmetry or wild tip sharpness
    const depthFactor = lerp(1.3, 0.82, tip.depth / 7);
    const morphScale  = 1 + morph * 0.12;
    const rx = (8 + dna.rxMul * 7)   * dna.scale * sz * depthFactor * morphScale;
    const ry = (5 + dna.ryMul * 4)   * dna.scale * sz * depthFactor * morphScale;
    const tipSharp = 0.88 + dna.rxMul * 0.16;

    const bv = Math.min(1.0, 0.85 + dna.brightOffset * 0.16 + (p.stage ? 0.12 : 0) + morph * 0.10);
    // Per-leaf variation stays tiny — color comes from the active season
    const hueJitter = ((dna.seed % 100) / 100 - 0.5) * 6;
    const lh = seasonLeaf.h + hueJitter;
    const ls = seasonLeaf.s * (0.88 + dna.brightOffset * 0.18);
    const leafCol = (v: number, a: number) => hsv(lh, ls, v, a);

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);

    ctx.shadowColor = leafCol(bv, 0.50);
    ctx.shadowBlur  = (p.stage ? 7 : 4) + morph * (p.stage ? 14 : 8);

    const isNew = dna.id === newestId;
    if (isNew) {
      const pulse = 0.55 + 0.45 * Math.sin(time * 3.4);
      ctx.shadowColor = leafCol(1.0, p.stage ? 0.95 : 0.82);
      ctx.shadowBlur  = (p.stage ? 44 : 28) * pulse;
    }

    // Simple top-to-bottom gradient — moonlit tip, darker base
    const grad = ctx.createLinearGradient(0, ry, 0, -ry);
    grad.addColorStop(0,    leafCol(bv * 0.60, p.stage ? 0.78 : 0.65));
    grad.addColorStop(0.45, leafCol(bv,        p.stage ? 1.00 : 0.94));
    grad.addColorStop(1,    leafCol(bv * 0.82, p.stage ? 0.88 : 0.76));
    ctx.fillStyle = grad;
    tracLeafPath(ctx, rx, ry, 0, tipSharp);
    ctx.fill();

    ctx.shadowBlur = 0;

    // Midrib
    ctx.strokeStyle = leafCol(bv * 1.22, p.stage ? 0.62 : 0.48);
    ctx.lineWidth   = 0.55;
    ctx.lineCap     = "round";
    ctx.beginPath();
    ctx.moveTo(0,  ry * 0.85);
    ctx.lineTo(0, -ry * 0.82);
    ctx.stroke();

    // One pair of side veins — clean and subtle
    ctx.strokeStyle = leafCol(bv * 1.08, p.stage ? 0.34 : 0.22);
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
  );

  ctx.restore();

  ctx.restore();

  // Canopy glow halo (static — outside sway)
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

  ctx.restore();
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
