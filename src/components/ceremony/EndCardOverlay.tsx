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

/** Renders a word with a ✦ star anchored above the dot of its "i" */
function StarWord({ word, stage, delay }: { word: string; stage: boolean; delay: number }) {
  const iIdx = word.toLowerCase().indexOf("i");

  const starSpan = (
    <motion.span
      className="absolute left-1/2 -translate-x-1/2 select-none pointer-events-none"
      style={{
        top: stage ? "-1.15em" : "-1.05em",
        fontSize: stage ? "0.52em" : "0.48em",
        color: "#ffe98a",
        textShadow: "0 0 10px rgba(255,220,80,0.95), 0 0 22px rgba(255,200,60,0.55)",
        lineHeight: 1,
      }}
      initial={{ opacity: 0, y: 5, scale: 0.3 }}
      animate={{ opacity: [0, 1, 0.88, 1], y: [5, 0, 0, 0], scale: [0.3, 1.2, 0.95, 1.05] }}
      transition={{ duration: 1.0, delay, times: [0, 0.35, 0.65, 1], ease: ease() }}
    >
      ✦
    </motion.span>
  );

  const wordStyle: React.CSSProperties = {
    color: "#ffffff",
    textShadow: "0 0 20px rgba(255,230,120,0.50), 0 0 8px rgba(255,255,255,0.35)",
    fontStyle: "normal",
  };

  if (iIdx === -1) {
    return (
      <motion.span
        className="relative inline-block"
        style={wordStyle}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay }}
      >
        {starSpan}{word}
      </motion.span>
    );
  }

  const before = word.slice(0, iIdx);
  const iChar  = word[iIdx];
  const after  = word.slice(iIdx + 1);

  return (
    <motion.span
      className="inline"
      style={wordStyle}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay }}
    >
      {before}
      <span className="relative inline-block">
        {starSpan}
        {iChar}
      </span>
      {after}
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
  // Strip leading/trailing quotes if already present
  const clean = text.replace(/^["""]+|["""]+$/g, "").trim();
  const words = clean.split(/\s+/);

  return (
    <span>
      {words.map((raw, i) => {
        const stripped = raw.replace(/[.,!?;:"""]+$/, "");
        const punctuation = raw.slice(stripped.length);
        const isHighlight = HIGHLIGHT.includes(stripped.toLowerCase());
        const wordDelay = baseDelay + i * 0.055;

        if (isHighlight) {
          return (
            <span key={i}>
              <StarWord word={stripped} stage={stage} delay={wordDelay} />
              {punctuation && (
                <motion.span
                  style={{ color: "rgba(220,232,252,0.70)" }}
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
            initial={{ opacity: 0, filter: "blur(4px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.5, delay: wordDelay, ease: ease() }}
            style={{ color: "rgba(210,228,252,0.78)" }}
          >
            {raw}{" "}
          </motion.span>
        );
      })}
    </span>
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
          <div className="relative flex flex-col items-center gap-5 px-8 text-center">

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
                className={`tracking-[0.38em] uppercase font-sans font-medium ${
                  stage ? "text-xs md:text-sm" : "text-[10px] md:text-xs"
                }`}
                style={{ color: "rgba(200,218,248,0.60)" }}
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
              style={{ background: "linear-gradient(90deg, transparent, rgba(200,218,248,0.55), transparent)" }}
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 1.2, delay: 1.0, ease: ease() }}
            />

            {/* Highlighted quote — word-by-word with stars on "main" and "life" */}
            <AnimatePresence>
              {showQuote && cueText && (
                <motion.p
                  key="quote"
                  className={`font-serif italic leading-relaxed max-w-2xl ${
                    stage
                      ? "text-2xl md:text-3xl lg:text-[2.1rem]"
                      : "text-base md:text-xl"
                  }`}
                  style={{ textShadow: "0 3px 24px rgba(0,0,0,0.85)" }}
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
                </motion.p>
              )}
            </AnimatePresence>

            {/* "Thank you." — arrives last, very quiet */}
            <AnimatePresence>
              {showThanks && (
                <motion.p
                  key="thanks"
                  className={`font-serif tracking-widest uppercase ${
                    stage ? "text-sm md:text-base" : "text-xs md:text-sm"
                  }`}
                  style={{ color: "rgba(200,218,248,0.45)", letterSpacing: "0.28em" }}
                  initial={{ opacity: 0, y: 10 }}
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
