"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Season } from "@/lib/types";
import { seasonPalettes } from "@/lib/seasons";

const labels: Record<Season, string> = {
  winter: "Winter",
  spring: "Spring",
  summer: "Summer",
  autumn: "Autumn",
};

/** Life stages after high school — shown under each season name */
const LIFE_AFTER_HS: Record<Season, string> = {
  spring: "College",
  summer: "Jobs",
  autumn: "Adventures",
  winter: "Family",
};

interface Props {
  season: Season;
  stage?: boolean;
}

export function SeasonCycleBanner({ season, stage = true }: Props) {
  const p = seasonPalettes[season];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={season}
        className="absolute top-[2.5%] left-0 right-0 flex justify-center pointer-events-none z-20"
        initial={{ opacity: 0, y: -16, scale: 0.88, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: 12, scale: 0.92, filter: "blur(6px)" }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className="flex flex-col items-center text-center rounded-xl px-6 py-3 border border-white/14 backdrop-blur-sm"
          style={{
            background: "rgba(0, 0, 0, 0.55)",
            boxShadow: `0 2px 16px rgba(0,0,0,0.4), 0 0 24px -8px ${p.veinGlow}33`,
          }}
        >
          <p
            className={`font-serif uppercase tracking-[0.22em] text-white/90 ${
              stage ? "text-base md:text-lg" : "text-sm md:text-base"
            }`}
            style={{ textShadow: `0 0 12px ${p.veinGlow}44` }}
          >
            {labels[season]}
          </p>
          <motion.p
            className={`font-serif italic text-white/60 mt-0.5 ${
              stage ? "text-sm md:text-base" : "text-xs md:text-sm"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            {LIFE_AFTER_HS[season]}
          </motion.p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
