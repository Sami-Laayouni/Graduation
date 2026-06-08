"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import type { Season } from "@/lib/types";
import { seasonPalettes } from "@/lib/seasons";

const STARS = Array.from({ length: 120 }).map((_, i) => ({
  id: i,
  x: (i * 17.3) % 100,
  y: (i * 23.7) % 100,
  r: 0.5 + (i % 4) * 0.4,
  opacity: 0.2 + (i % 5) * 0.12,
  twinkle: 2 + (i % 7),
}));

export function SpaceBackground({
  season,
  seasonBlend,
}: {
  season: Season;
  seasonBlend?: Season;
}) {
  const p = seasonPalettes[season];
  const blend = seasonBlend ? seasonPalettes[seasonBlend] : null;

  const nebula = useMemo(
    () =>
      blend
        ? `radial-gradient(ellipse 90% 60% at 30% 20%, ${p.mist} 0%, transparent 50%),
         radial-gradient(ellipse 70% 50% at 70% 30%, ${blend.mist} 0%, transparent 45%),
         radial-gradient(ellipse 100% 80% at 50% 100%, ${p.ground} 0%, #030508 70%)`
        : `radial-gradient(ellipse 100% 70% at 50% 0%, ${p.mist} 0%, transparent 50%),
         radial-gradient(ellipse 80% 50% at 20% 80%, ${p.mist} 0%, transparent 40%),
         linear-gradient(180deg, #020308 0%, ${p.skyTop} 35%, ${p.skyBottom} 70%, ${p.ground} 100%)`,
    [p, blend]
  );

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      <motion.div
        className="absolute inset-0"
        animate={{ background: nebula }}
        transition={{ duration: 3, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Distant galaxy band */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 120% 30% at 50% 40%, rgba(120, 140, 255, 0.08) 0%, transparent 70%)",
        }}
      />

      {STARS.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.r,
            height: s.r,
          }}
          animate={{ opacity: [s.opacity * 0.5, s.opacity, s.opacity * 0.5] }}
          transition={{
            duration: s.twinkle,
            repeat: Infinity,
            ease: "easeInOut",
            delay: (s.id % 10) * 0.2,
          }}
        />
      ))}
    </div>
  );
}
