"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import type { LanguageCode } from "@/lib/types";
import { uiStrings } from "@/lib/i18n";

interface Props {
  language: LanguageCode;
  /** Sticky bar under header vs inline block */
  sticky?: boolean;
  className?: string;
}

export function LookUpBanner({ language, sticky = false, className }: Props) {
  const t = uiStrings[language];
  const isRtl = language === "ar";

  return (
    <motion.div
      role="status"
      aria-live="polite"
      className={clsx(
        "w-full z-20 pointer-events-none",
        sticky && "sticky top-0",
        className,
      )}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className={clsx(
          "relative overflow-hidden rounded-2xl border-2 px-4 py-3.5 sm:py-4 text-center",
          "border-emerald-400/70 bg-emerald-950/85",
          isRtl && "rtl-flip",
        )}
        dir={isRtl ? "rtl" : "ltr"}
        animate={{
          boxShadow: [
            "0 0 0 0 rgba(52, 211, 153, 0.45)",
            "0 0 28px 6px rgba(52, 211, 153, 0.35)",
            "0 0 0 0 rgba(52, 211, 153, 0.45)",
          ],
        }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: "linear-gradient(105deg, transparent 40%, rgba(110, 231, 183, 0.25) 50%, transparent 60%)",
          }}
          aria-hidden
        />

        <div className="relative flex flex-col items-center gap-1.5">
          <motion.span
            className="text-2xl sm:text-3xl leading-none text-emerald-300"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden
          >
            ↑
          </motion.span>
          <p className="font-serif text-lg sm:text-xl md:text-2xl font-semibold text-emerald-50 tracking-wide">
            {t.lookUpHeadline}
          </p>
          <p className="audience-body text-sm sm:text-base text-emerald-100/90 max-w-sm leading-snug">
            {t.lookUpDetail}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
