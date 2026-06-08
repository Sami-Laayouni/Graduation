"use client";

import { motion } from "framer-motion";

const COLORS = ["#bbf7d0", "#86efac", "#fde68a", "#fdba74", "#c8dce8"];

const FLAKES = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  x: 28 + (i * 7) % 44,
  delay: i * 0.08,
  color: COLORS[i % COLORS.length],
  rot: -30 + i * 12,
  drift: 100 + (i % 5) * 24,
}));

export function LeafBurst() {
  return (
    <div className="leaf-burst flex items-center justify-center" aria-hidden>
      {FLAKES.map((f) => (
        <motion.div
          key={f.id}
          className="absolute w-3 h-5"
          style={{
            left: `${f.x}%`,
            bottom: "40%",
            background: f.color,
            boxShadow: `0 0 12px ${f.color}`,
            borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
          }}
          initial={{ opacity: 0, y: 0, rotate: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            y: -f.drift,
            rotate: f.rot,
            scale: [0, 1.2, 0.6],
          }}
          transition={{
            duration: 2.2,
            delay: f.delay,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      ))}
      <motion.p
        className="absolute font-serif text-xl text-ceremony-glow text-center px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ duration: 3, times: [0, 0.2, 0.7, 1] }}
      >
        A leaf joins the tree
      </motion.p>
    </div>
  );
}
