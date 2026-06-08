"use client";

import { motion } from "framer-motion";
import { leafPath } from "@/lib/tree-geometry";

interface Props {
  trigger: number;
  stage?: boolean;
}

export function LeafPopEffect({ trigger, stage = true }: Props) {
  if (!trigger) return null;

  const size = stage ? 180 : 120;
  const dur  = stage ? 3.8  : 2.5;

  return (
    <motion.div
      key={trigger}
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0, rotate: -25, opacity: 0 }}
        animate={{ scale: [0, 2.0, 1.4], rotate: [0, 12, 0], opacity: [0, 1, 0] }}
        transition={{ duration: dur, ease: [0.22, 1, 0.36, 1] }}
      >
        <svg
          width={size} height={size * 1.16}
          viewBox="-20 -25 40 50"
          style={{ filter: stage ? "drop-shadow(0 0 28px rgba(255,255,255,0.6))" : "none" }}
        >
          <defs>
            <radialGradient id="popLeafStage" cx="40%" cy="30%">
              <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.98" />
              <stop offset="55%"  stopColor="#d4e4ff" stopOpacity="0.82" />
              <stop offset="100%" stopColor="#aac4f8" stopOpacity="0.20" />
            </radialGradient>
            <radialGradient id="popLeafNormal" cx="40%" cy="30%">
              <stop offset="0%"   stopColor="#bbf7d0" />
              <stop offset="100%" stopColor="#34d399" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="b" />
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          <path
            d={leafPath(1.2)}
            fill={stage ? "url(#popLeafStage)" : "url(#popLeafNormal)"}
            filter="url(#glow)"
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}
