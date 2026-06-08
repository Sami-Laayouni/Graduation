"use client";

import { useEffect, useRef } from "react";
import type { LeafDNA, Season } from "@/lib/types";
import { seasonPalettes } from "@/lib/seasons";
import { generateStars, type Star } from "@/lib/canvas/stars";
import { buildTree, type TreeData } from "@/lib/canvas/procedural-tree";
import {
  drawSky,
  drawStars,
  drawMoon,
  drawGroundFog,
  drawTree,
  drawMacroLeaf,
  drawFallingLeaves,
  updateFallingLeaves,
  audienceLeafAnchor,
  paletteFromSeason,
  type FallingLeaf,
  type ScenePalette,
} from "@/lib/canvas/moonlit-painter";
import { leafMacroScale } from "@/lib/visual-progress";

const SEASON_IDX: Record<Season, number> = { winter: 0, spring: 1, summer: 2, autumn: 3 };

export type CanvasSceneMode = "cosmos" | "leaf" | "tree";

interface Props {
  mode:                 CanvasSceneMode;
  season:               Season;
  sectionId:            string;
  veinCount:            number;
  zoomT:                number;
  audienceLeaves:       LeafDNA[];
  newestLeafId?:        string;
  treeScale?:           number;
  enableFallingLeaves?: boolean;
  /** Projector present and may be washed-out — boost contrast/size */
  stage?:               boolean;
  /** Shown on the macro leaf (e.g. "You appear" on memories_2) */
  leafLabel?:           string;
  /** Leaf flies from center onto a branch after QR reflection */
  leafPlacing?:         boolean;
  /** 0→1 pulse when seasons change — dramatic leaf morph */
  seasonMorphPulse?:    number;
  /** Finale mode — boost canopy glow + max falling leaves */
  isFinale?:            boolean;
  reduced?:             boolean;
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.min(1, Math.max(0, t));
}

export function MoonlitCanvasScene({
  mode,
  season,
  sectionId,
  veinCount,
  zoomT,
  audienceLeaves,
  newestLeafId,
  treeScale           = 1,
  enableFallingLeaves = false,
  stage               = false,
  leafLabel,
  leafPlacing         = false,
  seasonMorphPulse    = 0,
  isFinale            = false,
  reduced             = false,
}: Props) {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const frameRef    = useRef(0);
  const lastTRef    = useRef(0);
  const veinAnimRef = useRef(0);
  const prevSecRef  = useRef(sectionId);
  const fallingRef  = useRef<FallingLeaf[]>([]);
  const starsRef    = useRef<Star[]>([]);
  const treeRef     = useRef<TreeData | null>(null);
  const paletteRef  = useRef<ScenePalette>(paletteFromSeason(null, 0));
  const swayRef     = useRef(0);
  const bgCacheRef  = useRef<HTMLCanvasElement | null>(null);
  const bgSeasonRef = useRef(-1);
  const sizeRef     = useRef({ w: 0, h: 0, dpr: 1 });

  const modeRef           = useRef(mode);
  const audienceLeavesRef = useRef(audienceLeaves);
  const newestLeafIdRef   = useRef(newestLeafId);
  const treeScaleRef      = useRef(treeScale);
  const fallingEnaRef     = useRef(enableFallingLeaves);
  const stageRef          = useRef(stage);
  const veinCountRef      = useRef(veinCount);
  const zoomTRef          = useRef(zoomT);
  const sectionIdRef      = useRef(sectionId);
  const leafLabelRef      = useRef(leafLabel);
  const leafPlacingRef    = useRef(leafPlacing);
  const seasonMorphRef    = useRef(seasonMorphPulse);
  const isFinaleRef       = useRef(isFinale);
  const attachRef         = useRef(0);
  const wasPlacingRef     = useRef(false);
  const reducedRef        = useRef(reduced);

  modeRef.current           = mode;
  audienceLeavesRef.current = audienceLeaves;
  newestLeafIdRef.current   = newestLeafId;
  treeScaleRef.current      = treeScale;
  fallingEnaRef.current     = enableFallingLeaves;
  stageRef.current          = stage;
  veinCountRef.current      = veinCount;
  zoomTRef.current          = zoomT;
  sectionIdRef.current      = sectionId;
  leafLabelRef.current      = leafLabel;
  leafPlacingRef.current    = leafPlacing;
  seasonMorphRef.current    = seasonMorphPulse;
  isFinaleRef.current       = isFinale;
  reducedRef.current        = reduced;

  useEffect(() => {
    paletteRef.current = paletteFromSeason(seasonPalettes[season], SEASON_IDX[season], stageRef.current);
    bgSeasonRef.current = -1; // invalidate sky cache on season change
  }, [season]);

  useEffect(() => {
    if (sectionId !== prevSecRef.current) {
      veinAnimRef.current = 0;
      prevSecRef.current  = sectionId;
    }
  }, [sectionId]);

  useEffect(() => {
    const parent = canvasRef.current?.parentElement;
    if (!parent) return;
    treeRef.current = buildTree("cer", parent.clientWidth, parent.clientHeight);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rebuildBg = (w: number, h: number, dpr: number) => {
      const p  = paletteRef.current;
      const sg = stageRef.current;
      let bg   = bgCacheRef.current;
      if (!bg) {
        bg = document.createElement("canvas");
        bgCacheRef.current = bg;
      }
      bg.width  = w * dpr;
      bg.height = h * dpr;
      const bctx = bg.getContext("2d");
      if (!bctx) return;
      bctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      bctx.clearRect(0, 0, w, h);
      // Re-create palette with current stage flag before baking bg
      const stagePalette = paletteFromSeason(null, p.seasonIdx, sg);
      drawSky(bctx, w, h, stagePalette);
      drawMoon(bctx, w, h, sg);
      bgSeasonRef.current = p.seasonIdx;
    };

    const rebuild = (w: number, h: number) => {
      starsRef.current = generateStars(200, w, h, 42);
      treeRef.current  = buildTree("cer", w, h);
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w   = parent.clientWidth;
      const h   = parent.clientHeight;
      canvas.width        = w * dpr;
      canvas.height       = h * dpr;
      canvas.style.width  = `${w}px`;
      canvas.style.height = `${h}px`;
      sizeRef.current     = { w, h, dpr };
      rebuild(w, h);
      rebuildBg(w, h, dpr);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);

    const paint = (now: number) => {
      const last = lastTRef.current || now;
      const isR  = reducedRef.current;
      const dt   = isR ? 0 : Math.min(0.032, (now - last) / 1000);
      lastTRef.current = now;
      const t    = isR ? 0 : now / 1000;

      if (!isR && veinAnimRef.current < 1) {
        const step = (dt || 0.016) * 1.8;
        veinAnimRef.current = Math.min(1, veinAnimRef.current + step);
      } else if (isR) {
        veinAnimRef.current = 1;
      }

      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx) return;

      const { w, h, dpr } = sizeRef.current;
      const p = paletteRef.current;

      // Invalidate bg cache if season or stage mode changed
      if ((bgSeasonRef.current !== p.seasonIdx || p.stage !== stageRef.current) && w > 0) {
        paletteRef.current = paletteFromSeason(null, p.seasonIdx, stageRef.current);
        rebuildBg(w, h, dpr);
      }

      ctx.imageSmoothingEnabled = true;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Cached static sky + moon
      const bg = bgCacheRef.current;
      if (bg) {
        ctx.drawImage(bg, 0, 0, w, h);
      } else {
        ctx.clearRect(0, 0, w, h);
        drawSky(ctx, w, h, p);
        drawMoon(ctx, w, h);
      }

      drawStars(ctx, starsRef.current, t);

      const currentMode = modeRef.current;
      const audLeaves   = audienceLeavesRef.current;
      const newestId    = newestLeafIdRef.current;
      const ts          = treeScaleRef.current;
      const fallEnabled = fallingEnaRef.current;
      const placing     = leafPlacingRef.current;
      const morphPulse  = seasonMorphRef.current;
      const finale      = isFinaleRef.current;

      if (placing) {
        if (!wasPlacingRef.current) attachRef.current = 0;
        wasPlacingRef.current = true;
        if (!isR) {
          attachRef.current = Math.min(1, attachRef.current + (dt || 0.016) / 4.2);
        } else {
          attachRef.current = 1;
        }
      } else {
        wasPlacingRef.current = false;
        attachRef.current = 1;
      }

      const attachT = attachRef.current;
      const flyT    = easeInOutCubic(Math.max(0, (attachT - 0.18) / 0.82));
      const treeAlpha = placing ? lerp(0, 1, easeInOutCubic(Math.min(1, attachT / 0.38))) : 1;
      const animScale = placing ? lerp(0.92, ts, easeInOutCubic(Math.min(1, attachT / 0.55))) : ts;

      // Smooth sway — lerp toward target each frame
      const targetSway = isR ? 0
        : Math.sin(t * 0.30) * 0.018
        + Math.sin(t * 0.71) * 0.005
        + Math.sin(t * 1.44) * 0.002;
      const swayLerp = 1 - Math.pow(0.001, dt || 0.016);
      swayRef.current += (targetSway - swayRef.current) * swayLerp;
      const sway = swayRef.current;

      if ((currentMode === "tree" || placing) && treeRef.current) {
        const hideId = placing && flyT < 0.98 ? newestId : undefined;
        ctx.save();
        const cx = w * 0.5, cy = h * 0.88;
        ctx.translate(cx, cy);
        ctx.scale(animScale, animScale);
        ctx.translate(-cx, -cy);
        drawTree(
          ctx, treeRef.current, p, w, h, sway, t, audLeaves, newestId,
          morphPulse, hideId, treeAlpha, finale,
        );
        ctx.restore();

        if (placing && attachT < 1) {
          const newestLeaf = audLeaves.find((l) => l.id === newestId)
            ?? audLeaves[audLeaves.length - 1];
          const anchor = audienceLeafAnchor(
            treeRef.current.tipPositions, newestLeaf, animScale, w, h,
          );
          const startCx = w * 0.5;
          const startCy = h * 0.47;
          const macroR  = Math.min(w, h) * 0.22;
          const endR    = Math.max(anchor.rx, anchor.ry) * 2.4;
          const leafCx  = lerp(startCx, anchor.x, flyT);
          const leafCy  = lerp(startCy, anchor.y, flyT);
          const leafR   = lerp(macroR, endR, flyT);
          const veinAnim = easeInOutCubic(Math.min(1, attachT * 1.4));
          drawMacroLeaf(
            ctx, leafCx, leafCy, leafR, p,
            Math.max(3, veinCountRef.current), 0.4, t, veinAnim,
            undefined, stageRef.current,
          );
        }

        if (!isR && fallEnabled && !placing) {
          const maxLeaves = finale ? Math.min(32, audLeaves.length) : audLeaves.length;
          fallingRef.current = updateFallingLeaves(
            fallingRef.current, w, h, sway, dt || 0.016, maxLeaves,
          );
          drawFallingLeaves(ctx, fallingRef.current, p);
        } else if (!fallEnabled) {
          fallingRef.current = [];
        }
      }

      if (currentMode === "leaf" && !placing) {
        const sid    = sectionIdRef.current;
        const scale  = leafMacroScale(sid);
        const cx     = w * 0.5;
        const cy     = h * 0.47;
        const baseR  = Math.min(w, h) * 0.24;
        const radius = baseR * (scale / 3.35);
        const veinAnim = easeInOutCubic(veinAnimRef.current);
        drawMacroLeaf(
          ctx, cx, cy, radius, p,
          veinCountRef.current, zoomTRef.current, t, veinAnim,
          leafLabelRef.current, stageRef.current,
        );
      }

      drawGroundFog(ctx, w, h, p, t);

      frameRef.current = requestAnimationFrame(paint);
    };

    frameRef.current = requestAnimationFrame(paint);
    return () => {
      cancelAnimationFrame(frameRef.current);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ willChange: "transform" }}
      aria-hidden
    />
  );
}
