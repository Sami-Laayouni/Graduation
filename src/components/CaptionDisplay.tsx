"use client";

import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import type { LanguageCode } from "@/lib/types";

interface Props {
  text: string;
  language: LanguageCode;
  lookUpNudge?: boolean;
  lookUpLabel?: string;
  large?: boolean;
  fairy?: boolean;
}

export function CaptionDisplay({
  text,
  language,
  lookUpNudge,
  lookUpLabel,
  large,
  fairy,
}: Props) {
  const isRtl = language === "ar";

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto px-3">
      <AnimatePresence mode="wait">
        <motion.div
          key={text.slice(0, 48)}
          initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className={clsx(
            "w-full p-5 sm:p-7 md:p-10",
            fairy ? "fairy-caption-card" : "caption-card",
            isRtl && "rtl-flip"
          )}
          dir={isRtl ? "rtl" : "ltr"}
        >
          <p
            className={clsx(
              "caption-text font-serif leading-relaxed text-center",
              fairy ? "text-white" : "text-ceremony-text",
              large ? "text-xl sm:text-2xl md:text-3xl" : "text-base sm:text-lg md:text-xl"
            )}
          >
            {text}
          </p>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {lookUpNudge && lookUpLabel && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-3"
          >
            <motion.div
              className="h-px w-16 bg-gradient-to-r from-transparent via-ceremony-glow to-transparent"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
            <p className="text-ceremony-glow text-sm md:text-base tracking-[0.35em] uppercase font-sans">
              {lookUpLabel}
            </p>
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="h-8 w-px bg-ceremony-glow/60"
              aria-hidden
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
