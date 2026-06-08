"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Season } from "@/lib/types";
import { seasonPalettes } from "@/lib/seasons";
import { canopyPosition, leafPath, leafStemPath } from "@/lib/tree-geometry";

function ease() {
  return [0.22, 1, 0.36, 1] as const;
}

const ROOTS = [
  "M 400 575 C 340 590 280 600 220 595",
  "M 400 575 C 460 590 520 600 580 595",
  "M 400 575 C 370 610 350 630 330 640",
  "M 400 575 C 430 610 450 630 470 640",
];

const TRUNK_CORE =
  "M 400 580 C 388 480 382 380 388 300 C 392 240 396 200 400 175";

const TRUNK_BODY =
  "M 368 580 C 358 470 368 360 378 280 C 385 220 392 185 400 168 L 408 185 C 415 230 422 300 432 400 C 442 500 445 580 428 580 Z";

const TRUNK_HIGHLIGHT =
  "M 395 580 C 392 450 396 320 400 200 C 402 250 404 380 406 520";

const BRANCHES: { d: string; w: number; delay: number }[] = [
  { d: "M 400 295 C 260 275 140 230 60 165", w: 3.2, delay: 0 },
  { d: "M 400 295 C 540 275 660 230 740 165", w: 3.2, delay: 0.08 },
  { d: "M 400 265 C 310 210 250 150 210 95", w: 2.6, delay: 0.16 },
  { d: "M 400 265 C 490 210 550 150 590 95", w: 2.6, delay: 0.24 },
  { d: "M 400 245 C 365 185 348 125 340 72", w: 2.2, delay: 0.32 },
  { d: "M 400 245 C 435 185 452 125 460 72", w: 2.2, delay: 0.4 },
  { d: "M 400 320 C 290 340 200 365 130 385", w: 2.4, delay: 0.48 },
  { d: "M 400 320 C 510 340 600 365 670 385", w: 2.4, delay: 0.56 },
];

const TWIGS = [
  "M 120 200 C 95 185 75 170 58 155",
  "M 680 200 C 705 185 725 170 742 155",
  "M 210 95 C 195 82 182 72 170 62",
  "M 590 95 C 605 82 618 72 630 62",
];

export function GrandTreeVisual({
  season,
  canopyCount,
  audienceLeaves,
  reduced,
  seasonKey,
}: {
  season: Season;
  canopyCount: number;
  audienceLeaves: { index: number; isNew?: boolean }[];
  reduced?: boolean;
  seasonKey: string;
}) {
  const p = seasonPalettes[season];

  return (
    <svg viewBox="0 0 800 600" className="w-full h-full" aria-hidden>
      <defs>
        <linearGradient id="gtTrunkDeep" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0d0604" />
          <stop offset="35%" stopColor="#2a1810" />
          <stop offset="70%" stopColor="#5c3d2e" />
          <stop offset="100%" stopColor="#8a6355" />
        </linearGradient>
        <linearGradient id="gtTrunkHi" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="50%" stopColor="#c9a88a" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#f0dcc8" stopOpacity="0.25" />
        </linearGradient>
        <linearGradient id="gtBranch" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3d2818" />
          <stop offset="50%" stopColor={p.vein} />
          <stop offset="100%" stopColor={p.veinGlow} />
        </linearGradient>
        <radialGradient id="gtCanopyInner" cx="48%" cy="38%" r="42%">
          <stop offset="0%" stopColor={p.leafLight} stopOpacity="0.55" />
          <stop offset="55%" stopColor={p.leafDark} stopOpacity="0.28" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id="gtCanopyOuter" cx="50%" cy="42%" r="55%">
          <stop offset="0%" stopColor={p.leafLight} stopOpacity="0.12" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <filter id="gtGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="gtSoft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
        <pattern
          id="gtBark"
          width="12"
          height="12"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-12)"
        >
          <line x1="0" y1="6" x2="12" y2="6" stroke="#1a0e08" strokeWidth="0.4" opacity="0.35" />
        </pattern>
      </defs>

      {/* Ground mist */}
      <motion.ellipse
        cx="400"
        cy="565"
        rx="320"
        ry="65"
        fill={p.veinGlow}
        opacity="0.1"
        animate={{ opacity: [0.06, 0.14, 0.06], rx: [310, 330, 310] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Roots */}
      {ROOTS.map((d, i) => (
        <motion.path
          key={d}
          d={d}
          fill="none"
          stroke="#1a0e08"
          strokeWidth={2.5 - i * 0.3}
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.85 }}
          transition={{
            duration: reduced ? 0.01 : 1.8,
            delay: reduced ? 0 : i * 0.1,
            ease: ease(),
          }}
        />
      ))}

      {/* Trunk */}
      <motion.g
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduced ? 0.01 : 2.8, ease: ease() }}
      >
        <path d={TRUNK_BODY} fill="url(#gtTrunkDeep)" />
        <path d={TRUNK_BODY} fill="url(#gtBark)" opacity="0.5" />
        <path
          d={TRUNK_HIGHLIGHT}
          fill="none"
          stroke="url(#gtTrunkHi)"
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.7"
        />
        <path d={TRUNK_CORE} fill="none" stroke="#120a06" strokeWidth="1.5" opacity="0.5" />
      </motion.g>

      {/* Main branches */}
      {BRANCHES.map((b) => (
        <motion.path
          key={b.d}
          d={b.d}
          fill="none"
          stroke="url(#gtBranch)"
          strokeWidth={b.w}
          strokeLinecap="round"
          filter="url(#gtGlow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.95 }}
          transition={{
            duration: reduced ? 0.01 : 2.2,
            delay: reduced ? 0 : 1 + b.delay,
            ease: ease(),
          }}
        />
      ))}

      {/* Twigs */}
      {TWIGS.map((d, i) => (
        <motion.path
          key={d}
          d={d}
          fill="none"
          stroke={p.vein}
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.7"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: reduced ? 0.01 : 1.2,
            delay: reduced ? 0 : 2.2 + i * 0.08,
          }}
        />
      ))}

      {/* Layered canopy glow */}
      <motion.ellipse
        cx="400"
        cy="195"
        rx="250"
        ry="195"
        fill="url(#gtCanopyOuter)"
        filter="url(#gtSoft)"
        animate={{ rx: [245, 258, 245], ry: [190, 200, 190] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        key={`outer-${seasonKey}`}
      />
      <motion.ellipse
        cx="400"
        cy="188"
        rx="195"
        ry="150"
        fill="url(#gtCanopyInner)"
        animate={{ opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 5, repeat: Infinity }}
        key={`inner-${seasonKey}`}
      />

      {/* Canopy leaves */}
      <AnimatePresence mode="popLayout">
        <motion.g key={`canopy-${seasonKey}-${canopyCount}`}>
          {Array.from({ length: canopyCount }).map((_, i) => {
            const pos = canopyPosition(
              i,
              Math.max(canopyCount, 8),
              400,
              178,
              215
            );
            const gid = `gl-${i}-${seasonKey}`;
            const depth = pos.y < 200 ? 1.05 : 0.92;
            return (
              <motion.g
                key={i}
                transform={`translate(${pos.x} ${pos.y}) rotate(${pos.rotation})`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: 0.92 * depth,
                  scale: pos.scale * depth,
                }}
                transition={{
                  opacity: { duration: reduced ? 0.01 : 1.4, delay: reduced ? 0 : 1.8 + i * 0.035 },
                  scale: { duration: reduced ? 0.01 : 1.6, delay: reduced ? 0 : 1.8 + i * 0.035, ease: ease() },
                }}
              >
                <defs>
                  <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={p.leafLight} />
                    <stop offset="55%" stopColor={p.leafDark} />
                    <stop offset="100%" stopColor={p.vein} stopOpacity="0.8" />
                  </linearGradient>
                </defs>
                <path d={leafPath(1.05)} fill={`url(#${gid})`} filter="url(#gtGlow)" />
                <path
                  d={leafStemPath(1.05)}
                  stroke={p.leafDark}
                  strokeWidth="0.9"
                  fill="none"
                  opacity="0.55"
                />
                <path
                  d="M -4 -8 C 0 -12 4 -8 0 -4"
                  fill={p.leafLight}
                  opacity="0.35"
                />
              </motion.g>
            );
          })}
        </motion.g>
      </AnimatePresence>

      {/* Audience reflection leaves — golden accent */}
      {audienceLeaves.map(({ index, isNew }) => {
        const pos = canopyPosition(
          index,
          Math.max(audienceLeaves.length, 8),
          400,
          168,
          225
        );
        const gid = `aud-${index}-${seasonKey}`;
        return (
          <motion.g
            key={`aud-${index}-${seasonKey}`}
            transform={`translate(${pos.x} ${pos.y}) rotate(${pos.rotation})`}
            initial={
              isNew
                ? { opacity: 0, scale: 0.15, filter: "brightness(2)" }
                : { opacity: 0, scale: 0 }
            }
            animate={{
              opacity: 1,
              scale: pos.scale * 1.2,
              filter: "brightness(1)",
            }}
            transition={{
              duration: isNew ? 2.8 : 1.4,
              ease: ease(),
            }}
          >
            <defs>
              <radialGradient id={gid} cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#fff8e8" />
                <stop offset="40%" stopColor={p.leafLight} />
                <stop offset="100%" stopColor={p.veinGlow} />
              </radialGradient>
            </defs>
            {isNew && (
              <motion.circle
                cx="0"
                cy="0"
                r="28"
                fill={p.veinGlow}
                opacity="0.35"
                initial={{ scale: 0.5, opacity: 0.6 }}
                animate={{ scale: 2.2, opacity: 0 }}
                transition={{ duration: 2.5 }}
              />
            )}
            <path d={leafPath(1.15)} fill={`url(#${gid})`} filter="url(#gtGlow)" />
          </motion.g>
        );
      })}

      {/* Fireflies in canopy */}
      {!reduced &&
        Array.from({ length: 6 }).map((_, i) => (
          <motion.circle
            key={`fly-${i}-${seasonKey}`}
            r="1.5"
            fill={p.veinGlow}
            cx={320 + (i * 47) % 160}
            cy={140 + (i * 31) % 100}
            animate={{
              opacity: [0.2, 0.9, 0.2],
              cy: [140 + (i * 31) % 100, 130 + (i * 31) % 100, 140 + (i * 31) % 100],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.4,
            }}
          />
        ))}
    </svg>
  );
}
