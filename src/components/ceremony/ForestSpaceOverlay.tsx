"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  visible: boolean;
  cueText?: string;
  stage?: boolean;
  entryKey: number;
}

function ease() { return [0.16, 1, 0.30, 1] as const; }

/** Moonlit silver — matches the main canvas palette, no blue blobs */
const MOON = {
  glow:  "rgba(200, 216, 240,",
  trunk: "rgba(180, 198, 225, 0.75)",
  leaf:  "rgba(200, 216, 240, 0.55)",
  leaf2: "rgba(190, 208, 235, 0.40)",
  label: "rgba(220, 232, 252, 0.88)",
};

interface DistantTree {
  x: number;
  bottom: number;
  scale: number;
  depth: number;
  label: string;
  delay: number;
}

const DISTANT_TREES: DistantTree[] = [
  { x: 6,  bottom: 14, scale: 1.05, depth: 0, label: "New people",      delay: 0.3 },
  { x: 18, bottom: 18, scale: 0.88, depth: 1, label: "New worlds",      delay: 0.5 },
  { x: 30, bottom: 12, scale: 1.12, depth: 0, label: "New experiences", delay: 0.7 },
  { x: 42, bottom: 20, scale: 0.82, depth: 2, label: "New chapters",    delay: 0.4 },
  { x: 58, bottom: 16, scale: 0.95, depth: 1, label: "New paths",       delay: 0.6 },
  { x: 70, bottom: 13, scale: 1.08, depth: 0, label: "New dreams",      delay: 0.8 },
  { x: 82, bottom: 19, scale: 0.85, depth: 2, label: "New places",      delay: 0.45 },
  { x: 93, bottom: 15, scale: 0.92, depth: 1, label: "New stories",     delay: 0.65 },
  { x: 24, bottom: 28, scale: 0.62, depth: 3, label: "New things",      delay: 0.9 },
  { x: 76, bottom: 26, scale: 0.58, depth: 3, label: "New beginnings",  delay: 1.0 },
];

function useStars(count: number, seed: number) {
  return useMemo(() => {
    let s = seed;
    const rand = () => {
      s = (s * 16807 + 0) % 2147483647;
      return (s - 1) / 2147483646;
    };
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: rand() * 100,
      y: rand() * 55, // keep stars in upper sky only — not over the trees
      size: 0.4 + rand() * 2.2,
      opacity: 0.25 + rand() * 0.75,
      delay: rand() * 5,
      dur: 2 + rand() * 4,
      layer: i % 3,
      twinkle: rand() > 0.75,
    }));
  }, [count, seed]);
}

function DistantTreeGraphic({
  tree,
  stage,
}: {
  tree: DistantTree;
  stage: boolean;
}) {
  const depthAlpha = [0.92, 0.72, 0.52, 0.38][tree.depth] ?? 0.5;
  const h = 72 * tree.scale;
  const w = 28 * tree.scale;

  return (
    <motion.div
      className="absolute flex flex-col items-center z-[2]"
      style={{
        left: `${tree.x}%`,
        bottom: `${tree.bottom}%`,
        transform: "translateX(-50%)",
        opacity: depthAlpha,
      }}
      initial={{ opacity: 0, y: 40, scale: 0.7 }}
      animate={{ opacity: depthAlpha, y: 0, scale: 1 }}
      transition={{ duration: 2.2, delay: tree.delay, ease: ease() }}
    >
      <svg
        width={w}
        height={h}
        viewBox="0 0 28 72"
        aria-hidden
        className="overflow-visible"
        style={{ filter: "drop-shadow(0 0 6px rgba(200,216,240,0.25))" }}
      >
        {/* Canopy — neutral moonlit, no solid blue fill blobs */}
        <ellipse cx="14" cy="18" rx="9" ry="11" fill={MOON.leaf} />
        <ellipse cx="11" cy="22" rx="6" ry="7" fill={MOON.leaf2} />
        <ellipse cx="17" cy="21" rx="5.5" ry="6.5" fill={MOON.leaf2} />
        {/* Trunk + branches */}
        <path
          d="M14 72 C14 58 13 48 14 38 C14 32 14 28 14 24"
          stroke={MOON.trunk}
          strokeWidth="1.8"
          fill="none"
          strokeLinecap="round"
        />
        <path d="M14 38 C8 32 4 26 3 20" stroke={MOON.trunk} strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.7" />
        <path d="M14 36 C20 30 24 24 25 18" stroke={MOON.trunk} strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.7" />
        <path d="M14 30 C10 24 8 18 7 14" stroke={MOON.trunk} strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.5" />
        <path d="M14 28 C18 22 20 16 21 12" stroke={MOON.trunk} strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.5" />
        {/* Tiny star on canopy */}
        <circle cx="14" cy="10" r="1" fill="rgba(255,245,220,0.85)" />
      </svg>

      {tree.depth < 3 && (
        <motion.span
          className={`font-serif italic text-center whitespace-nowrap tracking-wide ${
            stage ? "text-[11px] md:text-xs" : "text-[10px] md:text-[11px]"
          }`}
          style={{
            color: MOON.label,
            textShadow: "0 2px 8px rgba(0,0,0,0.9)",
            marginTop: -4,
          }}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: tree.delay + 0.8 }}
        >
          {tree.label}
        </motion.span>
      )}
    </motion.div>
  );
}

export function ForestSpaceOverlay({ visible, cueText, stage = true, entryKey }: Props) {
  const stars = useStars(260, 42 + entryKey);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={`forest-space-${entryKey}`}
          className="absolute inset-0 z-[6] pointer-events-none overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
        >
          {/* Subtle dark vignette only — transparent centre so canvas trees show through */}
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 2.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 4.8, ease: ease() }}
            style={{
              background: [
                "radial-gradient(ellipse 50% 40% at 50% 55%, transparent 0%, rgba(0,0,0,0.30) 100%)",
                "radial-gradient(ellipse 100% 50% at 50% 100%, rgba(0,0,0,0.40) 0%, transparent 55%)",
              ].join(", "),
            }}
          />

          {/* Stars — upper sky only, plain white */}
          <div className="absolute inset-x-0 top-0 h-[58%]">
            {stars.map((star) => (
              <motion.span
                key={star.id}
                className="absolute rounded-full bg-white"
                style={{
                  left: `${star.x}%`,
                  top: `${(star.y / 55) * 100}%`,
                  width: star.size,
                  height: star.size,
                  opacity: star.opacity * (star.layer === 0 ? 1 : star.layer === 1 ? 0.65 : 0.4),
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: star.twinkle
                    ? [0, star.opacity, star.opacity * 0.5, star.opacity]
                    : [0, star.opacity, star.opacity * 0.8, star.opacity],
                  scale: [0, 1, 1, 1],
                }}
                transition={{
                  opacity: { duration: star.dur, delay: star.delay + 0.2, repeat: Infinity, ease: "easeInOut" },
                  scale: { duration: 0.5, delay: star.delay * 0.2 },
                }}
              />
            ))}
          </div>

          {/* Labeled distant trees */}
          <div className="absolute inset-0 z-[2]">
            {DISTANT_TREES.map((tree, i) => (
              <DistantTreeGraphic key={`${tree.label}-${i}`} tree={tree} stage={stage} />
            ))}
          </div>

          {/* Centre cue text */}
          {cueText && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center px-8 md:px-16 z-[3]"
              initial={{ opacity: 0, y: 32, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 2.4, delay: 1.4, ease: ease() }}
            >
              <p
                className={`font-serif text-center tracking-wide leading-tight max-w-4xl ${
                  stage
                    ? "text-3xl md:text-5xl lg:text-6xl font-light"
                    : "text-2xl md:text-4xl font-light"
                }`}
                style={{
                  color: "rgba(240,248,255,0.94)",
                  textShadow: "0 4px 24px rgba(0,0,0,0.95), 0 0 40px rgba(0,0,0,0.5)",
                }}
              >
                {cueText}
              </p>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
