"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Season } from "@/lib/types";

export interface LifeStage {
  label:     string;
  sub:       string;
  season:    Season;
}

export const LIFE_STAGES: LifeStage[] = [
  { label: "Class of '26",   sub: "Today",           season: "spring"  },
  { label: "College",        sub: "The first leap",  season: "summer"  },
  { label: "First Chapter",  sub: "Building",        season: "autumn"  },
  { label: "A Decade Later", sub: "Still becoming",  season: "winter"  },
  { label: "Reunion",        sub: "Look how far",    season: "spring"  },
];

interface Props {
  stage: LifeStage;
  index: number;
}

export function LifeStageBanner({ stage, index }: Props) {
  const isFirst = index === 0;
  const isLast  = index === LIFE_STAGES.length - 1;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stage.label}
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Horizontal rule */}
        <motion.div
          className="mb-8 flex items-center gap-4"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          style={{ transformOrigin: "center" }}
        >
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-white/20" />
          <span className="text-[10px] tracking-[0.4em] uppercase" style={{ color: "rgba(200,216,240,0.3)" }}>
            {stage.sub}
          </span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-white/20" />
        </motion.div>

        {/* Stage label */}
        <motion.p
          className="font-serif text-5xl md:text-7xl tracking-tight text-center px-8"
          style={{ color: isLast ? "rgba(220,230,248,0.95)" : "rgba(200,216,240,0.85)" }}
          initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        >
          {stage.label}
        </motion.p>

        {/* Progress dots */}
        <motion.div
          className="mt-10 flex gap-2 items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          {LIFE_STAGES.map((_, i) => (
            <motion.div
              key={i}
              className="rounded-full"
              style={{ background: "rgba(200,216,240,1)" }}
              animate={{
                width:   i === index ? 20 : 4,
                height:  4,
                opacity: i === index ? 0.75 : i < index ? 0.35 : 0.12,
              }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            />
          ))}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
