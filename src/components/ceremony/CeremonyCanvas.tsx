"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { LeafDNA, ProjectorVisualState, Season } from "@/lib/types";
import { nextSeason } from "@/lib/seasons";
import {
  asiVeinCount,
  leafZoomT,
  shouldShowAsiLeaf,
  visualLayer,
} from "@/lib/visual-progress";
import { MoonlitCanvasScene, type CanvasSceneMode } from "./MoonlitCanvasScene";
import { SeasonCycleBanner } from "./SeasonCycleBanner";
import { LifeStageBanner, LIFE_STAGES } from "./LifeStageBanner";
import { ClassmatesBoard } from "./ClassmatesBoard";
import { LeafPopEffect } from "./LeafPopEffect";
import { EndCardOverlay } from "./EndCardOverlay";
import { ForestSpaceOverlay } from "./ForestSpaceOverlay";
import { CeremonyQR } from "../CeremonyQR";

interface Props {
  state:          ProjectorVisualState;
  season:         Season;
  sessionId:      string;
  sectionId:      string;
  leafCount?:     number;
  leafPulseAt?:   number;
  cueText?:       string;
  /** Projector is present but may be washed-out — pump contrast and slow transitions */
  stage?:         boolean;
  reducedMotion?: boolean;
}

function ease() { return [0.22, 1, 0.36, 1] as const; }
function stageDuration(stage: boolean, base: number) { return stage ? base * 2.2 : base; }

const FALLING_LEAF_STATES: ProjectorVisualState[] = [
  "seasons_cycle", "forest_zoom", "life_stages", "end_card",
];

export function CeremonyCanvas({
  state,
  season,
  sessionId,
  sectionId,
  leafCount    = 0,
  leafPulseAt  = 0,
  cueText,
  stage        = true,
  reducedMotion: reducedProp,
}: Props) {
  const prefersReduced = useReducedMotion();
  const reduced        = reducedProp ?? prefersReduced ?? false;

  const [cycleSeason,    setCycleSeason]    = useState<Season>(season);
  const [stageIdx,       setStageIdx]       = useState(0);
  const [audienceLeaves, setAudienceLeaves] = useState<LeafDNA[]>([]);
  const [seasonMorphPulse, setSeasonMorphPulse] = useState(0);
  const newestLeafRef  = useRef<string | undefined>(undefined);
  const prevPulseRef   = useRef(leafPulseAt ?? 0);
  const prevCycleRef   = useRef<Season>(season);
  const morphInitRef   = useRef(false);
  const morphRafRef    = useRef(0);

  // Fetch (and re-fetch) persisted leaves from the server
  const fetchLeaves = useCallback(async () => {
    try {
      const res = await fetch(`/api/session/${sessionId}/leaves`);
      if (!res.ok) return;
      const data = await res.json() as { leaves: LeafDNA[] };
      setAudienceLeaves(data.leaves);
      if (data.leaves.length > 0)
        newestLeafRef.current = data.leaves[data.leaves.length - 1].id;
    } catch { /* ignore */ }
  }, [sessionId]);

  // Initial load + re-fetch whenever a new leaf is added
  useEffect(() => { fetchLeaves(); }, [fetchLeaves]);
  useEffect(() => {
    if ((leafPulseAt ?? 0) !== prevPulseRef.current) {
      prevPulseRef.current = leafPulseAt ?? 0;
      fetchLeaves();
    }
  }, [leafPulseAt, fetchLeaves]);

  const layer              = visualLayer(state, sectionId);
  const isSeasonsSection   = state === "seasons_cycle" && sectionId === "look_up_2";
  const isLifeStages       = state === "life_stages";
  const isClassmatesRoll   = state === "classmates_roll";
  const leafPlacing          = state === "leaf_placing";
  const showQr         = state === "qr_intro" || state === "qr_reflection";
  const showAsiLeaf    = shouldShowAsiLeaf(sectionId, state);
  const veinCount      = asiVeinCount(sectionId);
  const zoomT          = leafZoomT(sectionId);

  useEffect(() => { setCycleSeason(season); }, [season]);

  // Season cycle — section 30 only (one place, no double cycling)
  // 5 s between changes gives the audience time to feel each season
  useEffect(() => {
    if (!isSeasonsSection || reduced) return;
    const id = setInterval(() => setCycleSeason((s) => nextSeason(s)), 5000);
    return () => clearInterval(id);
  }, [isSeasonsSection, reduced]);

  // Dramatic leaf morph pulse when season changes (section 30)
  useEffect(() => {
    if (!isSeasonsSection) {
      morphInitRef.current = false;
      setSeasonMorphPulse(0);
      return;
    }
    if (!morphInitRef.current) {
      morphInitRef.current = true;
      prevCycleRef.current = cycleSeason;
      return;
    }
    if (prevCycleRef.current === cycleSeason) return;
    prevCycleRef.current = cycleSeason;

    cancelAnimationFrame(morphRafRef.current);
    const start = performance.now();
    const duration = 4500; // longer morph so the colour wash fully saturates

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setSeasonMorphPulse(t);
      if (t < 1) {
        morphRafRef.current = requestAnimationFrame(tick);
      }
    };
    morphRafRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(morphRafRef.current);
  }, [cycleSeason, isSeasonsSection]);

  // Life-stage cycle — advance every 5s, but DO NOT change the tree season
  // (seasons only cycle during the dedicated seasons_cycle section)
  useEffect(() => {
    if (!isLifeStages) { setStageIdx(0); return; }
    setStageIdx(0);
    const id = setInterval(() => {
      setStageIdx((i) => {
        const next = i + 1;
        if (next >= LIFE_STAGES.length) { clearInterval(id); return i; }
        return next;
      });
    }, 5200);
    return () => clearInterval(id);
  }, [isLifeStages]);

  const displaySeason = (isSeasonsSection || isLifeStages) ? cycleSeason : season;

  const isForestZoom = state === "forest_zoom";

  const canvasMode: CanvasSceneMode = useMemo(() => {
    if (showQr)         return "cosmos";
    if (leafPlacing)    return "tree";
    if (showAsiLeaf)    return "leaf";
    if (isForestZoom)   return "forest";
    if (layer === "tree") return "tree";
    return "cosmos";
  }, [showQr, leafPlacing, showAsiLeaf, isForestZoom, layer]);

  const treeScale = useMemo(() => {
    if (state === "forest_zoom")  return 0.34;
    if (state === "life_stages")  return 0.68;
    if (state === "end_card")     return 0.82;
    return 0.82;
  }, [state]);

  // Falling leaves only when people have actually responded AND in the right phase
  const enableFallingLeaves = useMemo(() =>
    leafCount > 0 && FALLING_LEAF_STATES.includes(state),
    [leafCount, state]
  );

  const isEndCard = state === "end_card";

  // Re-key the space overlay each time we enter forest mode
  const forestEntryKeyRef = useRef(0);
  const prevForestRef     = useRef(false);
  if (isForestZoom && !prevForestRef.current) {
    forestEntryKeyRef.current += 1;
  }
  prevForestRef.current = isForestZoom;

  // Full-screen season colour wash — applied only during the seasons_cycle section.
  // Each season gets a subtle tint that transforms the entire page feel.
  const SEASON_WASH: Record<Season, string> = {
    winter: "rgba(140, 180, 255, 0.09)",
    spring: "rgba(140, 230, 160, 0.08)",
    summer: "rgba(160, 235, 130, 0.09)",
    autumn: "rgba(255, 165,  80, 0.11)",
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#010205]">
      <motion.div
        className="absolute inset-0"
        key={isEndCard ? "scene-finale" : "scene"}
        initial={isEndCard ? { scale: 0.32, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={isEndCard ? { duration: 2.6, ease: [0.14, 1, 0.34, 1] } : { duration: 0 }}
        style={{ transformOrigin: "50% 72%" }}
      >
        <MoonlitCanvasScene
          mode               = {canvasMode}
          season             = {displaySeason}
          sectionId          = {sectionId}
          veinCount          = {veinCount}
          zoomT              = {zoomT}
          audienceLeaves     = {audienceLeaves}
          newestLeafId       = {newestLeafRef.current}
          treeScale          = {treeScale}
          enableFallingLeaves= {enableFallingLeaves}
          isFinale           = {isEndCard}
          leafLabel          = {sectionId === "memories_2" ? cueText : undefined}
          leafPlacing        = {leafPlacing}
          seasonMorphPulse   = {isSeasonsSection ? seasonMorphPulse : 0}
          stage              = {stage}
          reduced            = {reduced}
        />
      </motion.div>

      {/* Full-page seasonal colour wash — only during seasons section */}
      {isSeasonsSection && (
        <div
          className="absolute inset-0 pointer-events-none z-[1] transition-[background-color] duration-[2400ms] ease-in-out"
          style={{ backgroundColor: SEASON_WASH[displaySeason] }}
        />
      )}

      <LeafPopEffect trigger={layer === "tree" ? leafPulseAt : 0} stage={stage} />

      <AnimatePresence>
        {isClassmatesRoll && <ClassmatesBoard stage={stage} />}
      </AnimatePresence>

      {isSeasonsSection && <SeasonCycleBanner season={displaySeason} stage={stage} />}

      {isLifeStages && (
        <LifeStageBanner
          stage={LIFE_STAGES[stageIdx]}
          index={stageIdx}
        />
      )}

      <EndCardOverlay
        visible={isEndCard}
        cueText={cueText}
        stage={stage}
      />

      <ForestSpaceOverlay
        visible={isForestZoom}
        cueText={cueText}
        stage={stage}
        entryKey={forestEntryKeyRef.current}
      />

      <AnimatePresence mode="wait">
        {showQr && (
          <motion.div
            key="qr"
            className="absolute inset-0 z-20 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: stageDuration(stage, 1) }}
          >
            <CeremonyQR
              sessionId={sessionId}
              large   ={state !== "qr_intro"}
              variant ={state === "qr_intro" ? "intro" : "reflection"}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Normal bottom cue — shown for all other tree states */}
      <AnimatePresence mode="wait">
        {cueText && !showQr && !isLifeStages && !isClassmatesRoll && !isForestZoom && state !== "end_card" && layer === "tree" && (
          <motion.div
            key={cueText}
            className="absolute bottom-[8%] left-0 right-0 px-8 z-10 pointer-events-none"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: stageDuration(stage, 1.4), ease: ease() }}
          >
            <p className={`font-serif text-center tracking-wide mx-auto max-w-4xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] ${
              stage
                ? "text-4xl md:text-6xl lg:text-7xl text-white font-medium"
                : "text-3xl md:text-4xl text-white/95"
            }`}>
              {cueText}
            </p>
            {leafCount > 0 && (
              <p className={`font-sans text-center mt-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] ${
                stage ? "text-sm md:text-base" : "text-xs md:text-sm"
              }`} style={{ color: "rgba(200,218,248,0.55)" }}>
                {leafCount} {leafCount === 1 ? "purpose on this tree" : "purposes on this tree"}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
