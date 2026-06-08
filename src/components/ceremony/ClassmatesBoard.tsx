"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const CLASSMATES = [
  "Abdelkarim Abbou",
  "Mamoun Achibat",
  "Hania Badiss",
  "Aya Boudina",
  "Lina Chekayri",
  "Nicole Coleman",
  "Doha Daoudi",
  "Rayane El Belkacemi",
  "Rayane El Bourakkadi",
  "Bilal Nour Elheggach",
  "Hiba El Idrissi",
  "Mohammed El Idrissi",
  "Idriss El Mhammedi Alaoui",
  "Rayane Essafi",
  "Majda Ftouh",
  "Lina Jadid",
  "Ola Kettani",
  "Souhayla Manou",
  "Rached Marri",
  "Zakaria Moussaid",
  "Aya Mrani Alaoui",
  "Meryem Rachidi",
  "Rihame Rafiq",
  "Sonia Ruth Sefiane",
  "Najima Zilali",
];

const DEFAULT_NAME_COLOR = "rgba(218,230,250,0.92)";

interface NameStyle {
  color:       string;
  textShadow?: string;
  fontWeight?: number;
}

/** Special tints for shout-out classmates */
const NAME_STYLE: Record<string, NameStyle> = {
  "Bilal Nour Elheggach": {
    color:       "rgba(175, 245, 200, 1)",
    textShadow:  "0 0 18px rgba(110, 231, 160, 0.55), 0 0 36px rgba(74, 222, 128, 0.28)",
    fontWeight:  500,
  },
  "Hiba El Idrissi": {
    color:       "rgba(255, 232, 150, 1)",
    textShadow:  "0 0 18px rgba(251, 191, 36, 0.55), 0 0 36px rgba(245, 200, 80, 0.30)",
    fontWeight:  500,
  },
  "Mohammed El Idrissi": {
    color:       "rgba(190, 220, 255, 1)",
    textShadow:  "0 0 18px rgba(147, 197, 253, 0.55), 0 0 36px rgba(96, 165, 250, 0.32)",
    fontWeight:  500,
  },
};

interface Props {
  stage?: boolean;
}

export function ClassmatesBoard({ stage = false }: Props) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [scroll, setScroll]   = useState<{ start: number; end: number; dur: number } | null>(null);
  const [fading, setFading]   = useState(false);

  const nameSize   = stage ? "1.45rem" : "1.20rem";
  const headerSize = stage ? "0.80rem" : "0.68rem";
  const rowPx      = stage ? 54 : 46;

  useEffect(() => {
    const measure = () => {
      const el = contentRef.current;
      if (!el) return;
      const vh      = window.innerHeight;
      const content = el.offsetHeight;
      const pxPerSec = stage ? 34 : 30;

      // Start almost in view — header peeks in immediately, names follow fast
      const start = vh - rowPx * 3;
      const end   = -(content - rowPx * 2);

      setScroll({
        start,
        end,
        dur: (start - end) / pxPerSec,
      });
    };

    measure();
    const ro = new ResizeObserver(measure);
    if (contentRef.current) ro.observe(contentRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [stage, rowPx]);

  useEffect(() => {
    if (!scroll) return;
    const fadeDelay = (0.15 + scroll.dur + 1.2) * 1000;
    const id = setTimeout(() => setFading(true), fadeDelay);
    return () => clearTimeout(id);
  }, [scroll]);

  return (
    <motion.div
      className="absolute inset-0 z-30 overflow-hidden"
      style={{ background: "rgba(1,2,6,0.96)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: fading ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: fading ? 2.5 : 0.35, ease: "easeInOut" }}
    >
      <div
        className="absolute top-0 left-0 right-0 z-10 pointer-events-none"
        style={{
          height: "14%",
          background: "linear-gradient(to bottom, rgba(1,2,6,1) 0%, transparent 100%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none"
        style={{
          height: "14%",
          background: "linear-gradient(to top, rgba(1,2,6,1) 0%, transparent 100%)",
        }}
      />

      <motion.div
        key={scroll ? "credits-run" : "credits-measure"}
        ref={contentRef}
        className="absolute left-0 right-0 will-change-transform"
        style={{ top: 0, visibility: scroll ? "visible" : "hidden" }}
        initial={{ y: scroll?.start ?? 0 }}
        animate={{ y: scroll?.end ?? scroll?.start ?? 0 }}
        transition={
          scroll
            ? { duration: scroll.dur, delay: 0.15, ease: "linear" }
            : { duration: 0 }
        }
      >
        {/* Compact header — names arrive sooner */}
        <div
          className="flex flex-col items-center text-center"
          style={{ paddingTop: rowPx * 0.4, paddingBottom: rowPx * 0.6 }}
        >
          <div
            style={{
              width: 50,
              height: 1,
              background: "linear-gradient(90deg, transparent, rgba(210,224,248,0.40), transparent)",
              marginBottom: rowPx * 0.35,
            }}
          />
          <p
            className="font-serif"
            style={{
              color: "rgba(200,218,245,0.50)",
              fontSize: headerSize,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              marginBottom: rowPx * 0.25,
            }}
          >
            Class of 2026
          </p>
          <p
            className="font-serif"
            style={{
              color: "rgba(218,230,250,0.86)",
              fontSize: stage ? "1.55rem" : "1.25rem",
              letterSpacing: "0.07em",
              lineHeight: 1.25,
            }}
          >
            And to all these amazing people
          </p>
          <div
            style={{
              width: 120,
              height: 1,
              background: "linear-gradient(90deg, transparent, rgba(210,224,248,0.30), transparent)",
              marginTop: rowPx * 0.4,
            }}
          />
        </div>

        <div className="flex flex-col items-center">
          {CLASSMATES.map((name) => {
            const style = NAME_STYLE[name];
            return (
            <div
              key={name}
              className="flex items-center justify-center w-full"
              style={{ height: rowPx }}
            >
              <span
                className="font-serif text-center"
                style={{
                  color:       style?.color ?? DEFAULT_NAME_COLOR,
                  fontSize:    nameSize,
                  letterSpacing: "0.06em",
                  textShadow:  style?.textShadow,
                  fontWeight:  style?.fontWeight,
                }}
              >
                {name}
              </span>
            </div>
            );
          })}
        </div>

        <div style={{ height: rowPx }} aria-hidden />
      </motion.div>
    </motion.div>
  );
}
