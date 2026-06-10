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

interface DistantFlower {
  x: number;
  bottom: number;
  scale: number;
  depth: number;
  label: string;
  delay: number;
  /** petal hue shift */
  hue: number;
}

const DISTANT_FLOWERS: DistantFlower[] = [
  { x: 6,  bottom: 14, scale: 1.05, depth: 0, label: "New people",      delay: 0.3, hue: 320 },
  { x: 18, bottom: 18, scale: 0.88, depth: 1, label: "New worlds",      delay: 0.5, hue: 280 },
  { x: 30, bottom: 12, scale: 1.12, depth: 0, label: "New experiences", delay: 0.7, hue: 340 },
  { x: 42, bottom: 20, scale: 0.82, depth: 2, label: "New chapters",    delay: 0.4, hue: 260 },
  { x: 58, bottom: 16, scale: 0.95, depth: 1, label: "New paths",       delay: 0.6, hue: 300 },
  { x: 70, bottom: 13, scale: 1.08, depth: 0, label: "New dreams",      delay: 0.8, hue: 330 },
  { x: 82, bottom: 19, scale: 0.85, depth: 2, label: "New places",      delay: 0.45, hue: 270 },
  { x: 93, bottom: 15, scale: 0.92, depth: 1, label: "New stories",     delay: 0.65, hue: 310 },
  { x: 24, bottom: 28, scale: 0.62, depth: 3, label: "New things",      delay: 0.9, hue: 290 },
  { x: 76, bottom: 26, scale: 0.58, depth: 3, label: "New beginnings",  delay: 1.0, hue: 350 },
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
      y: rand() * 55,
      size: 0.4 + rand() * 2.2,
      opacity: 0.25 + rand() * 0.75,
      delay: rand() * 5,
      dur: 2 + rand() * 4,
      layer: i % 3,
      twinkle: rand() > 0.75,
    }));
  }, [count, seed]);
}

function petalPath(cx: number, cy: number, rx: number, ry: number, rot: number): string {
  const cos = Math.cos(rot);
  const sin = Math.sin(rot);
  const px = (dx: number, dy: number) => cx + dx * cos - dy * sin;
  const py = (dx: number, dy: number) => cy + dx * sin + dy * cos;
  return [
    `M ${px(0, ry)}`,
    `C ${px(rx * 0.6, ry * 0.5)} ${px(rx * 0.85, 0)} ${px(0, -ry * 0.15)}`,
    `C ${px(-rx * 0.85, 0)} ${px(-rx * 0.6, ry * 0.5)} ${px(0, ry)}`,
    "Z",
  ].join(" ");
}

function DistantFlowerGraphic({
  flower,
  stage,
}: {
  flower: DistantFlower;
  stage: boolean;
}) {
  const depthAlpha = [0.95, 0.78, 0.58, 0.42][flower.depth] ?? 0.5;
  const size = 52 * flower.scale;
  const petalFill = `hsla(${flower.hue}, 42%, 78%, 0.72)`;
  const petalFill2 = `hsla(${flower.hue}, 35%, 85%, 0.55)`;
  const centerFill = `hsla(${flower.hue + 20}, 55%, 88%, 0.9)`;
  const stemStroke = "rgba(180, 198, 220, 0.55)";

  return (
    <motion.div
      className="absolute flex flex-col items-center z-[2]"
      style={{
        left: `${flower.x}%`,
        bottom: `${flower.bottom}%`,
        transform: "translateX(-50%)",
        opacity: depthAlpha,
      }}
      initial={{ opacity: 0, y: 36, scale: 0.65 }}
      animate={{ opacity: depthAlpha, y: 0, scale: 1 }}
      transition={{ duration: 2.2, delay: flower.delay, ease: ease() }}
    >
      <svg
        width={size}
        height={size * 1.35}
        viewBox="0 0 52 70"
        aria-hidden
        className="overflow-visible"
        style={{ filter: `drop-shadow(0 0 10px hsla(${flower.hue}, 50%, 70%, 0.35))` }}
      >
        {/* Stem + leaves */}
        <path
          d="M26 68 C26 52 25 42 26 32"
          stroke={stemStroke}
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
        />
        <ellipse cx="22" cy="48" rx="4" ry="2.2" fill="rgba(160, 200, 170, 0.35)" transform="rotate(-25 22 48)" />
        <ellipse cx="30" cy="44" rx="3.5" ry="2" fill="rgba(160, 200, 170, 0.28)" transform="rotate(20 30 44)" />

        {/* Petals — 6 around centre */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <path
            key={i}
            d={petalPath(26, 22, 9 + (i % 2) * 1.5, 14 + (i % 3), (i / 6) * Math.PI * 2 - Math.PI / 2)}
            fill={i % 2 === 0 ? petalFill : petalFill2}
          />
        ))}

        {/* Centre */}
        <circle cx="26" cy="22" r="4.5" fill={centerFill} />
        <circle cx="26" cy="22" r="2" fill="rgba(255, 248, 230, 0.85)" />

        {/* Soft glow behind bloom */}
        <circle cx="26" cy="22" r="16" fill={`hsla(${flower.hue}, 40%, 75%, 0.12)`} />
      </svg>

      {flower.depth < 3 && (
        <motion.span
          className={`font-serif italic text-center whitespace-nowrap tracking-wide ${
            stage ? "text-xs md:text-sm" : "text-[11px] md:text-xs"
          }`}
          style={{
            color: "rgba(235, 240, 252, 0.9)",
            textShadow: "0 2px 10px rgba(0,0,0,0.95)",
            marginTop: 2,
          }}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: flower.delay + 0.8 }}
        >
          {flower.label}
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

          <div className="absolute inset-0 z-[2]">
            {DISTANT_FLOWERS.map((flower, i) => (
              <DistantFlowerGraphic key={`${flower.label}-${i}`} flower={flower} stage={stage} />
            ))}
          </div>

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
