"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

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
 * Highlighted word with a ✦ star precisely over the dot of the "i".
 *
 * We measure the actual pixel position of the "i" character after mount
 * using getBoundingClientRect — the only way to get the right spot in a
 * proportional serif font where "m" is 3× wider than "i".
 *
 * The star animates in after a delay so the brief initial position (50%)
 * is never visible.
 */
function StarWord({ word, stage, delay }: { word: string; stage: boolean; delay: number }) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const iCharRef     = useRef<HTMLSpanElement>(null);
  const [starLeft, setStarLeft] = useState<number | null>(null);

  const iIdx = word.toLowerCase().indexOf("i");

  useEffect(() => {
    function measure() {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();

      if (iCharRef.current) {
        const iRect = iCharRef.current.getBoundingClientRect();
        setStarLeft(iRect.left - containerRect.left + iRect.width / 2);
      } else {
        // No "i" — centre over the whole word
        setStarLeft(containerRect.width / 2);
      }
    }

    measure();

    // Re-measure if the window resizes (font size / layout changes)
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [word]);

  const wordContent = iIdx >= 0 ? (
    <>
      {word.slice(0, iIdx)}
      <span ref={iCharRef}>{word[iIdx]}</span>
      {word.slice(iIdx + 1)}
    </>
  ) : word;

  return (
    <motion.span
      ref={containerRef}
      className="relative inline-block"
      style={{
        fontStyle: "normal",
        color: "#ffffff",
        textShadow: "0 0 18px rgba(255,230,120,0.45), 0 0 6px rgba(255,255,255,0.28)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay }}
    >
      {/* Star renders only once measured so it never flashes at wrong position */}
      {starLeft !== null && (
        <motion.span
          className="absolute select-none pointer-events-none"
          style={{
            left: starLeft,
            top: stage ? "-0.80em" : "-0.72em",
            transform: "translateX(-50%)",
            fontSize: stage ? "0.50em" : "0.44em",
            lineHeight: 1,
            fontStyle: "normal",
            color: "#ffe98a",
            textShadow: "0 0 10px rgba(255,220,80,0.95), 0 0 20px rgba(255,200,60,0.55)",
          }}
          initial={{ opacity: 0, y: 5, scale: 0.3 }}
          animate={{ opacity: [0, 1, 0.88, 1], y: [5, 0, 0, 0], scale: [0.3, 1.2, 0.95, 1.05] }}
          transition={{ duration: 0.9, delay: delay + 0.1, times: [0, 0.35, 0.65, 1], ease: ease() }}
        >
          ✦
        </motion.span>
      )}
      {wordContent}
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
            style={{ color: "rgba(210,228,252,0.78)" }}
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

            {/* "Thank you" — arrives last, very quiet */}
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
