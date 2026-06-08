"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Season } from "@/lib/types";
import { seasonPalettes } from "@/lib/seasons";
import {
  branchPaths,
  canopyPosition,
  leafPath,
  leafStemPath,
  trunkFillPath,
  veinPaths,
} from "@/lib/tree-geometry";

function ease() {
  return [0.22, 1, 0.36, 1] as const;
}

export function TreeLeaf({
  x,
  y,
  rotation,
  scale,
  season,
  delay,
  reduced,
  isNew,
  leafIndex,
}: {
  x: number;
  y: number;
  rotation: number;
  scale: number;
  season: Season;
  delay: number;
  reduced?: boolean;
  isNew?: boolean;
  leafIndex: number;
}) {
  const palette = seasonPalettes[season];
  const gradId = `lg-${leafIndex}-${season}`;

  return (
    <motion.g
      transform={`translate(${x} ${y})`}
      initial={
        isNew
          ? { opacity: 0, scale: 0.15, rotate: rotation - 50 }
          : { opacity: 0, scale: 0 }
      }
      animate={{ opacity: 1, scale: 1, rotate: rotation }}
      transition={{
        duration: reduced ? 0.01 : isNew ? 2.6 : 1.4,
        delay: reduced ? 0 : delay,
        ease: ease(),
      }}
    >
      <defs>
        <linearGradient id={gradId} x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor={palette.leafLight} />
          <stop offset="55%" stopColor={palette.veinGlow} stopOpacity="0.9" />
          <stop offset="100%" stopColor={palette.leafDark} />
        </linearGradient>
      </defs>
      <path d={leafPath(scale)} fill={`url(#${gradId})`} filter="url(#leafGlow)" />
      <path
        d={leafStemPath(scale)}
        stroke={palette.leafDark}
        strokeWidth="1.3"
        fill="none"
        opacity="0.75"
      />
    </motion.g>
  );
}

function FoliageMass({
  season,
  opacity,
}: {
  season: Season;
  opacity: number;
}) {
  const p = seasonPalettes[season];
  return (
    <motion.ellipse
      cx="400"
      cy="215"
      rx="175"
      ry="130"
      fill={p.leafDark}
      opacity={opacity * 0.35}
      filter="url(#canopyBlur)"
      animate={{ rx: [170, 180, 170], ry: [125, 135, 125] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

interface TreeProps {
  displaySeason: Season;
  showTrunk: boolean;
  showBranches: boolean;
  showVeins: boolean;
  canopyLeafCount: number;
  audienceLeaves: { index: number; season: Season; isNew?: boolean }[];
  reduced?: boolean;
  seasonTransitionKey: string;
}

export function OrganicTree({
  displaySeason,
  showTrunk,
  showBranches,
  showVeins,
  canopyLeafCount,
  audienceLeaves,
  reduced,
  seasonTransitionKey,
}: TreeProps) {
  const palette = seasonPalettes[displaySeason];

  return (
    <svg viewBox="0 0 800 600" className="w-full h-full" aria-hidden>
      <defs>
        <linearGradient id="trunkGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#1a0f08" />
          <stop offset="40%" stopColor="#4a3020" />
          <stop offset="100%" stopColor="#8b6350" />
        </linearGradient>
        <linearGradient id="branchGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor={palette.vein} stopOpacity="0.6" />
          <stop offset="100%" stopColor={palette.veinGlow} />
        </linearGradient>
        <radialGradient id="groundGlow" cx="50%" cy="100%" r="45%">
          <stop offset="0%" stopColor={palette.veinGlow} stopOpacity="0.15" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <filter id="leafGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="canopyBlur">
          <feGaussianBlur stdDeviation="18" />
        </filter>
        <filter id="treeShadow">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodOpacity="0.5" />
        </filter>
      </defs>

      <ellipse cx="400" cy="560" rx="220" ry="40" fill="url(#groundGlow)" />

      {showTrunk && (
        <motion.g filter="url(#treeShadow)" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <path d={trunkFillPath} fill="url(#trunkGrad)" />
        </motion.g>
      )}

      {showBranches &&
        branchPaths.map((b, i) => (
          <motion.path
            key={b.d}
            d={b.d}
            fill="none"
            stroke="url(#branchGrad)"
            strokeWidth={b.width}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.95 }}
            transition={{
              duration: reduced ? 0.01 : 2,
              delay: reduced ? 0 : i * 0.1,
              ease: ease(),
            }}
          />
        ))}

      {showVeins &&
        veinPaths.map((d, i) => (
          <motion.path
            key={d}
            d={d}
            fill="none"
            stroke="url(#branchGrad)"
            strokeWidth="0.9"
            strokeLinecap="round"
            opacity="0.4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: reduced ? 0.01 : 2.5, delay: i * 0.15 }}
          />
        ))}

      <AnimatePresence mode="wait">
        <motion.g key={`foliage-${seasonTransitionKey}`}>
          {(showTrunk || canopyLeafCount > 0) && (
            <>
              <FoliageMass season={displaySeason} opacity={0.8} />
              <FoliageMass season={displaySeason} opacity={0.5} />
            </>
          )}
        </motion.g>
      </AnimatePresence>

      <AnimatePresence mode="popLayout">
        <motion.g key={`leaves-${seasonTransitionKey}`}>
          {Array.from({ length: canopyLeafCount }).map((_, i) => {
            const pos = canopyPosition(i, Math.max(canopyLeafCount, 8), 400, 200, 170);
            return (
              <TreeLeaf
                key={`c-${i}`}
                x={pos.x}
                y={pos.y}
                rotation={pos.rotation}
                scale={pos.scale}
                season={displaySeason}
                delay={i * 0.035}
                reduced={reduced}
                leafIndex={i}
              />
            );
          })}
        </motion.g>
      </AnimatePresence>

      {audienceLeaves.map(({ index, season: leafSeason, isNew }) => {
        const pos = canopyPosition(
          index,
          Math.max(audienceLeaves.length, 8),
          400,
          195,
          195
        );
        return (
          <TreeLeaf
            key={`a-${index}-${seasonTransitionKey}`}
            x={pos.x}
            y={pos.y}
            rotation={pos.rotation}
            scale={pos.scale * 1.2}
            season={leafSeason}
            delay={0}
            reduced={reduced}
            isNew={isNew}
            leafIndex={500 + index}
          />
        );
      })}
    </svg>
  );
}
