"use client";

import { motion } from "framer-motion";
import type { Season } from "@/lib/types";
import { seasonPalettes } from "@/lib/seasons";
import { TOTAL_ASI_VEINS } from "@/lib/visual-progress";

const LEAF_OUTLINE =
  "M 400 520 C 520 480 560 360 540 240 C 520 140 460 80 400 60 C 340 80 280 140 260 240 C 240 360 280 480 400 520 Z";

/** One path per ASI speech beat — order matches ASI_VEIN_SECTIONS */
const STORY_VEINS: { d: string; w: number }[] = [
  { d: "M 400 500 L 400 120", w: 2.5 },
  { d: "M 400 450 C 320 420 260 380 220 320", w: 2.1 },
  { d: "M 400 450 C 480 420 540 380 580 320", w: 2.1 },
  { d: "M 400 400 C 350 350 310 290 290 230", w: 1.8 },
  { d: "M 400 400 C 450 350 490 290 510 230", w: 1.8 },
  { d: "M 400 350 C 370 300 355 250 348 200", w: 1.6 },
  { d: "M 400 350 C 430 300 445 250 452 200", w: 1.6 },
  { d: "M 400 300 C 360 270 330 230 310 180", w: 1.4 },
  { d: "M 400 300 C 440 270 470 230 490 180", w: 1.4 },
];

function ease() {
  return [0.22, 1, 0.36, 1] as const;
}

export function LeafMacroVisual({
  season,
  veinCount,
  sectionId,
  zoomT,
  reduced,
}: {
  season: Season;
  veinCount: number;
  sectionId: string;
  zoomT: number;
  reduced?: boolean;
}) {
  const p = seasonPalettes[season];
  const count = Math.min(
    STORY_VEINS.length,
    Math.max(0, Math.min(veinCount, TOTAL_ASI_VEINS))
  );
  const clipId = `macroLeafClip-${season}`;
  const fillId = `macroLeafFill-${season}`;
  const veinId = `macroVein-${season}`;
  const showGhosts = zoomT < 0.45;

  return (
    <svg viewBox="0 0 800 600" className="w-full h-full" aria-hidden>
      <defs>
        <clipPath id={clipId}>
          <path d={LEAF_OUTLINE} />
        </clipPath>
        <linearGradient id={fillId} x1="50%" y1="100%" x2="50%" y2="0%">
          <stop offset="0%" stopColor={p.leafDark} stopOpacity="0.65" />
          <stop offset="40%" stopColor={p.leafDark} stopOpacity="0.35" />
          <stop offset="100%" stopColor={p.leafLight} stopOpacity="0.12" />
        </linearGradient>
        <linearGradient id={veinId} x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor={p.vein} stopOpacity="0.6" />
          <stop offset="60%" stopColor={p.veinGlow} stopOpacity="0.95" />
          <stop offset="100%" stopColor="#fff8e0" />
        </linearGradient>
        <filter id="macroGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="softBloom">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <radialGradient id={`macroInner-${season}`} cx="50%" cy="45%" r="45%">
          <stop offset="0%" stopColor={p.veinGlow} stopOpacity="0.2" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      <motion.ellipse
        cx="400"
        cy="300"
        rx="220"
        ry="280"
        fill={p.veinGlow}
        opacity="0.08"
        animate={{ opacity: [0.05, 0.12, 0.05], rx: [210, 230, 210] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      <path
        d={LEAF_OUTLINE}
        fill={`url(#macroInner-${season})`}
        opacity="0.5"
      />

      <path
        d={LEAF_OUTLINE}
        fill={`url(#${fillId})`}
        stroke={p.veinGlow}
        strokeWidth="1"
        opacity={0.35 + zoomT * 0.2}
      />

      <g clipPath={`url(#${clipId})`}>
        {showGhosts &&
          STORY_VEINS.map((v, i) =>
            i >= count ? (
              <path
                key={`ghost-${i}`}
                d={v.d}
                fill="none"
                stroke={p.veinGlow}
                strokeWidth={v.w * 0.6}
                strokeLinecap="round"
                opacity={0.07}
              />
            ) : null
          )}

        {STORY_VEINS.slice(0, count).map((v, i) => {
          const isNew = i === count - 1;
          return (
            <motion.path
              key={`${v.d}-${i}`}
              d={v.d}
              fill="none"
              stroke={`url(#${veinId})`}
              strokeWidth={v.w}
              strokeLinecap="round"
              filter="url(#macroGlow)"
              initial={
                isNew ? { pathLength: 0, opacity: 0 } : { pathLength: 1, opacity: 1 }
              }
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: reduced ? 0.01 : isNew ? 2.6 : 0.01,
                delay: reduced ? 0 : isNew ? 0.15 : 0,
                ease: ease(),
              }}
            />
          );
        })}

        {count >= 5 &&
          Array.from({ length: 6 }).map((_, i) => {
            const angle = (i / 6) * Math.PI * 2 + 0.2;
            const len = 40 + (i % 3) * 20;
            const x1 = 400 + Math.cos(angle) * 25;
            const y1 = 290 + Math.sin(angle) * 40;
            const x2 = 400 + Math.cos(angle) * len;
            const y2 = 290 + Math.sin(angle) * (len * 0.85);
            return (
              <motion.line
                key={`cap-${i}-${sectionId}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={p.veinGlow}
                strokeWidth="0.55"
                initial={{ opacity: 0 }}
                animate={{ opacity: count >= 7 ? 0.45 : 0.2 }}
                transition={{ duration: 1.5, delay: 0.3 + i * 0.08 }}
              />
            );
          })}

        {zoomT > 0.2 && (
          <motion.circle
            cx="400"
            cy="280"
            r="40"
            fill={p.veinGlow}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.04, 0.12, 0.04], r: [35, 50, 35] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        )}
      </g>

      <path
        d={LEAF_OUTLINE}
        fill="none"
        stroke={p.leafLight}
        strokeWidth="1.5"
        opacity={0.15 + zoomT * 0.2}
        filter="url(#softBloom)"
      />

      {zoomT > 0.5 && (
        <motion.text
          x="400"
          y="555"
          textAnchor="middle"
          fill={p.veinGlow}
          fontSize="11"
          fontFamily="Georgia, serif"
          letterSpacing="0.2em"
          opacity={0.35}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.35 }}
        >
          PART OF YOU — NOT ALL OF YOU
        </motion.text>
      )}

      <path
        d="M 400 520 L 400 545"
        stroke={p.vein}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}
