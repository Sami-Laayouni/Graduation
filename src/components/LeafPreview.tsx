"use client";

import { motion } from "framer-motion";
import type { LeafDNA } from "@/lib/types";
import { leafHsla, leafVisualFromDna } from "@/lib/leaf-visual";

interface Props {
  dna: LeafDNA;
  size?: number;
  animate?: boolean;
}

export function LeafPreview({ dna, size: SIZE = 88, animate = true }: Props) {
  const cx = SIZE / 2;
  const cy = SIZE / 2;
  const vis = leafVisualFromDna(dna, SIZE / 88);
  const { rx, ry } = vis;
  const col = leafHsla(vis);

  const leafD = `
    M ${cx} ${cy + ry}
    C ${cx + rx * 0.85} ${cy + ry * 0.35},
      ${cx + rx * 0.92} ${cy - ry * 0.35},
      ${cx} ${cy - ry}
    C ${cx - rx * 0.92} ${cy - ry * 0.35},
      ${cx - rx * 0.85} ${cy + ry * 0.35},
      ${cx} ${cy + ry}
    Z
  `;

  const svg = (
    <svg
      width={SIZE}
      height={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      style={{ filter: `drop-shadow(0 0 16px ${leafHsla(vis, 0.55)})` }}
      aria-hidden
    >
      <defs>
        <linearGradient id={`lf-grad-${dna.id}`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor={col} stopOpacity="0.60" />
          <stop offset="45%" stopColor={col} stopOpacity="0.92" />
          <stop offset="100%" stopColor={col} stopOpacity="0.72" />
        </linearGradient>
      </defs>
      <path d={leafD} fill={`url(#lf-grad-${dna.id})`} />
      <line
        x1={cx} y1={cy + ry * 0.88}
        x2={cx} y2={cy - ry * 0.85}
        stroke={col} strokeOpacity="0.55" strokeWidth="0.8" strokeLinecap="round"
      />
      <line x1={cx} y1={cy + ry * 0.20} x2={cx + rx * 0.60} y2={cy - ry * 0.18}
        stroke={col} strokeOpacity="0.32" strokeWidth="0.6" strokeLinecap="round" />
      <line x1={cx} y1={cy + ry * 0.20} x2={cx - rx * 0.60} y2={cy - ry * 0.18}
        stroke={col} strokeOpacity="0.32" strokeWidth="0.6" strokeLinecap="round" />
    </svg>
  );

  if (!animate) return svg;

  return (
    <motion.div
      initial={{ scale: 0.4, opacity: 0, rotate: -12 }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 160, damping: 14, delay: 0.1 }}
    >
      {svg}
    </motion.div>
  );
}
