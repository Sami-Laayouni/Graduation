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
  summer: "j** (jobs)",
  autumn: "Learning",
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
          className="flex flex-col items-center text-center rounded-2xl px-8 py-4 sm:px-10 sm:py-5 border border-white/20 backdrop-blur-md min-w-[min(92vw,28rem)]"
          style={{
            background: "rgba(0, 0, 0, 0.72)",
            boxShadow: `0 4px 24px rgba(0,0,0,0.5), 0 0 32px -8px ${p.veinGlow}44`,
          }}
        >
          <p
            className={`font-serif uppercase tracking-[0.18em] text-white ${
              stage ? "text-2xl md:text-3xl lg:text-4xl" : "text-xl md:text-2xl"
            }`}
            style={{ textShadow: `0 0 16px ${p.veinGlow}55` }}
          >
            {labels[season]}
          </p>
          <motion.p
            className={`font-serif italic text-white/75 mt-1 ${
              stage ? "text-xl md:text-2xl lg:text-3xl" : "text-lg md:text-xl"
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
