"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import type { LanguageCode } from "@/lib/types";
import { languageLabels, uiStrings } from "@/lib/i18n";

const codes: LanguageCode[] = ["en", "fr", "ar"];

interface Props {
  language: LanguageCode;
  onChange: (code: LanguageCode) => void;
  hint?: string;
}

export function LanguageWelcome({ language, onChange, hint }: Props) {
  const t = uiStrings[language];

  return (
    <motion.div
      className="flex flex-col items-center gap-5 sm:gap-8 w-full max-w-md mx-auto px-1 sm:px-2"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="text-center space-y-2 sm:space-y-3">
        <p className="font-serif text-xl sm:text-2xl md:text-3xl text-white leading-snug px-1">
          {t.chooseLanguage}
        </p>
        <p className="text-sm md:text-base px-2" style={{ color: "rgba(220,232,250,0.72)" }}>
          {t.languageHint}
        </p>
      </div>

      <div
        className="w-full flex flex-col gap-3"
        role="radiogroup"
        aria-label={t.chooseLanguage}
      >
        {codes.map((code) => {
          const selected = language === code;
          return (
            <button
              key={code}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(code)}
              className={clsx(
                "w-full rounded-2xl border px-4 sm:px-6 py-3.5 sm:py-4 text-left transition-all duration-300 active:scale-[0.98] audience-touch min-h-[3.25rem]",
                selected
                  ? "border-white/40 bg-white/12 text-white shadow-[0_0_32px_-8px_rgba(220,232,250,0.35)]"
                  : "border-white/14 bg-white/[0.04] text-white/80 hover:border-white/28 hover:bg-white/[0.07]",
              )}
            >
              <span
                className={clsx(
                  "block font-serif text-lg sm:text-xl md:text-2xl",
                  code === "ar" && "text-right",
                )}
                dir={code === "ar" ? "rtl" : "ltr"}
              >
                {languageLabels[code].native}
              </span>
              <span
                className={clsx(
                  "block text-xs mt-1 tracking-wide uppercase",
                  selected ? "text-white/70" : "text-white/40",
                  code === "ar" && "text-right",
                )}
                dir={code === "ar" ? "rtl" : "ltr"}
              >
                {languageLabels[code].label}
              </span>
            </button>
          );
        })}
      </div>

      {hint && (
        <motion.p
          key={`${language}-${hint.slice(0, 24)}`}
          className={clsx(
            "font-serif text-center text-base sm:text-lg md:text-xl text-white/90 leading-relaxed px-1 sm:px-2",
            language === "ar" && "rtl-flip",
          )}
          dir={language === "ar" ? "rtl" : "ltr"}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {hint}
        </motion.p>
      )}
    </motion.div>
  );
}
