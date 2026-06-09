"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface Props {
  visible: boolean;
  cueText?: string;
  stage?: boolean;
}

function ease() { return [0.22, 1, 0.36, 1] as const; }

/** Radial shimmer particles that drift outward */
function Shimmer({ stage }: { stage: boolean }) {
  const particles = Array.from({ length: 28 }, (_, i) => {
    const angle = (i / 28) * 360;
    const dist  = 44 + (i % 6) * 14;
    return { angle, dist, delay: (i / 28) * 2.2, size: 1 + (i % 3) };
  });

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{ width: p.size, height: p.size }}
          initial={{ opacity: 0, x: 0, y: 0 }}
          animate={{
            opacity: [0, stage ? 0.65 : 0.40, 0],
            x: Math.cos((p.angle * Math.PI) / 180) * p.dist * (stage ? 3.0 : 2.0),
            y: Math.sin((p.angle * Math.PI) / 180) * p.dist * (stage ? 3.0 : 2.0),
          }}
          transition={{
            duration: stage ? 3.5 : 2.6,
            delay: p.delay + 0.4,
            repeat: Infinity,
            repeatDelay: 1.4,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

/**
 * Highlighted word with a ✦ star over the dot of the "i".
 *
 * The star is a child of the "i" character's own span so its position is
 * always exact — no JS measurement, no font-load race conditions.
 *
 * The "i" span is display:inline-block with lineHeight:1 so its height
 * equals exactly 1em.  bottom:"72%" places the star's bottom edge just
 * above the dot (which sits at ~70% from the span's bottom in serif fonts).
 */
function StarWord({ word, stage, delay }: { word: string; stage: boolean; delay: number }) {
  const iIdx = word.toLowerCase().indexOf("i");

  return (
    <motion.span
      className="inline"
      style={{
        fontStyle: "normal",
        color: "#ffffff",
        textShadow: "0 0 18px rgba(255,230,120,0.45), 0 0 6px rgba(255,255,255,0.28)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay }}
    >
      {iIdx < 0 ? word : (
        <>
          {word.slice(0, iIdx)}
          {/* relative inline-block with lineHeight:1 gives a crisp 1em box */}
          <span style={{ position: "relative", display: "inline-block", lineHeight: 1 }}>
            <motion.span
              aria-hidden
              className="absolute select-none pointer-events-none"
              style={{
                /*
                 * Dot position in Times New Roman (Windows default serif):
                 *   baseline ≈ 22% from span-bottom (lineHeight:1)
                 *   dot-center ≈ 72% of em above baseline → 22+72 = 94% from span-bottom
                 * Star center = bottom + half-star-height (25%) → bottom = 94-25 = 69%
                 */
                bottom: "69%",
                left: "50%",
                transform: "translateX(-50%)",
                fontSize: stage ? "0.48em" : "0.42em",
                lineHeight: 1,
                fontStyle: "normal",
                color: "#ffe98a",
                textShadow: "0 0 10px rgba(255,220,80,0.95), 0 0 20px rgba(255,200,60,0.55)",
              }}
              initial={{ opacity: 0, y: 4, scale: 0.3 }}
              animate={{ opacity: [0, 1, 0.88, 1], y: [4, 0, 0, 0], scale: [0.3, 1.2, 0.95, 1.05] }}
              transition={{ duration: 0.9, delay: delay + 0.1, times: [0, 0.35, 0.65, 1], ease: ease() }}
            >
              ✦
            </motion.span>
            {word[iIdx]}
          </span>
          {word.slice(iIdx + 1)}
        </>
      )}
    </motion.span>
  );
}

/** Splits the quote text and highlights specific words with a star above */
function HighlightedQuote({
  text,
  stage,
  baseDelay,
}: {
  text: string;
  stage: boolean;
  baseDelay: number;
}) {
  const HIGHLIGHT = ["main", "life"];
  const clean = text.replace(/^["""]+|["""]+$/g, "").trim();
  const words = clean.split(/\s+/);

  return (
    <>
      {words.map((raw, i) => {
        const stripped     = raw.replace(/[.,!?;:"""]+$/, "");
        const punctuation  = raw.slice(stripped.length);
        const isHighlight  = HIGHLIGHT.includes(stripped.toLowerCase());
        const wordDelay    = baseDelay + i * 0.055;

        if (isHighlight) {
          return (
            <span key={i} className="inline">
              <StarWord word={stripped} stage={stage} delay={wordDelay} />
              {punctuation && (
                <motion.span
                  style={{ color: "rgba(220,232,252,0.70)", fontStyle: "italic" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: wordDelay + 0.15 }}
                >
                  {punctuation}
                </motion.span>
              )}{" "}
            </span>
          );
        }

        return (
          <motion.span
            key={i}
            className="inline"
            initial={{ opacity: 0, filter: "blur(4px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.5, delay: wordDelay, ease: ease() }}
            style={{ color: "rgba(218,234,255,0.92)" }}
          >
            {raw}{" "}
          </motion.span>
        );
      })}
    </>
  );
}

export function EndCardOverlay({ visible, cueText, stage = true }: Props) {
  const [showQuote, setShowQuote]   = useState(false);
  const [showThanks, setShowThanks] = useState(false);

  useEffect(() => {
    if (!visible) {
      setShowQuote(false);
      setShowThanks(false);
      return;
    }
    const q = setTimeout(() => setShowQuote(true),  stage ? 2600 : 1900);
    const k = setTimeout(() => setShowThanks(true), stage ? 7500 : 5500);
    return () => { clearTimeout(q); clearTimeout(k); };
  }, [visible, stage]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="end-card"
          className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: stage ? 2.2 : 1.4, ease: ease() }}
        >
          {/* Layered radial glow backdrop */}
          <div
            className="absolute inset-0"
            style={{
              background: [
                "radial-gradient(ellipse 65% 50% at 50% 48%, rgba(200,218,255,0.14) 0%, transparent 60%)",
                "radial-gradient(ellipse 100% 80% at 50% 50%, rgba(0,0,0,0.52) 0%, transparent 100%)",
              ].join(", "),
            }}
          />

          {/* Particle shimmer burst */}
          <Shimmer stage={stage} />

          {/* Main content */}
          <div className="relative flex flex-col items-center gap-5 px-8 text-center w-full max-w-4xl mx-auto">

            {/* "Class of 2026" header */}
            <motion.div
              className="flex items-center gap-4"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 1.4, delay: 0.2, ease: ease() }}
              style={{ transformOrigin: "center" }}
            >
              <div className="h-px w-20 md:w-32 bg-gradient-to-r from-transparent to-white/40" />
              <span
                className={`tracking-[0.38em] uppercase font-sans font-semibold ${
                  stage ? "text-sm md:text-base" : "text-xs md:text-sm"
                }`}
                style={{
                  color: "rgba(220,234,255,0.92)",
                  textShadow: "0 0 18px rgba(180,210,255,0.50), 0 2px 8px rgba(0,0,0,0.85)",
                }}
              >
                Class of 2026
              </span>
              <div className="h-px w-20 md:w-32 bg-gradient-to-l from-transparent to-white/40" />
            </motion.div>

            {/* "Congratulations" */}
            <motion.h1
              className={`font-serif leading-none tracking-tight ${
                stage
                  ? "text-6xl md:text-8xl lg:text-9xl"
                  : "text-4xl md:text-6xl"
              }`}
              style={{
                color: "#ffffff",
                textShadow: stage
                  ? "0 0 60px rgba(200,218,255,0.60), 0 0 140px rgba(180,200,255,0.28), 0 4px 28px rgba(0,0,0,0.95)"
                  : "0 0 40px rgba(200,218,255,0.45), 0 4px 18px rgba(0,0,0,0.9)",
              }}
              initial={{ opacity: 0, y: 28, filter: "blur(14px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: stage ? 1.9 : 1.3, delay: 0.5, ease: ease() }}
            >
              Congratulations
            </motion.h1>

            {/* Accent divider */}
            <motion.div
              className={`rounded-full ${stage ? "h-px w-40 md:w-72" : "h-px w-28 md:w-52"}`}
              style={{ background: "linear-gradient(90deg, transparent, rgba(210,228,255,0.80), transparent)" }}
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 1.2, delay: 1.0, ease: ease() }}
            />

            {/* Highlighted quote with stars on "main" and "life" */}
            <AnimatePresence>
              {showQuote && cueText && (
                <motion.div
                  key="quote"
                  className={`font-serif italic text-center w-full ${
                    stage
                      ? "text-2xl md:text-3xl lg:text-[2.1rem]"
                      : "text-base md:text-xl"
                  }`}
                  style={{
                    textShadow: "0 3px 24px rgba(0,0,0,0.85)",
                    lineHeight: 2.4,    /* extra height so stars don't clip */
                    paddingTop: "0.6em", /* breathing room at top */
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.01 }}
                >
                  <motion.span
                    style={{ color: "rgba(210,228,252,0.55)" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    &ldquo;
                  </motion.span>
                  <HighlightedQuote text={cueText} stage={stage} baseDelay={0.15} />
                  <motion.span
                    style={{ color: "rgba(210,228,252,0.55)" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 1.6 }}
                  >
                    &rdquo;
                  </motion.span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* "Thank you" — arrives last */}
            <AnimatePresence>
              {showThanks && (
                <motion.p
                  key="thanks"
                  className={`font-serif tracking-widest uppercase ${
                    stage ? "text-xl md:text-2xl" : "text-base md:text-lg"
                  }`}
                  style={{
                    color: "rgba(225,238,255,0.95)",
                    letterSpacing: "0.32em",
                    textShadow: stage
                      ? "0 0 28px rgba(200,220,255,0.55), 0 0 60px rgba(180,200,255,0.22), 0 3px 14px rgba(0,0,0,0.90)"
                      : "0 0 18px rgba(200,220,255,0.40), 0 3px 10px rgba(0,0,0,0.85)",
                  }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: stage ? 1.8 : 1.2, ease: ease() }}
                >
                  Thank you
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
