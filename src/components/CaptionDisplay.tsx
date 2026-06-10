"use client";

import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import type { LanguageCode } from "@/lib/types";

interface Props {
  text: string;
  language: LanguageCode;
  lookUpNudge?: boolean;
  lookUpLabel?: string;
  lookUpHeadline?: string;
  lookUpDetail?: string;
  large?: boolean;
  fairy?: boolean;
}

export function CaptionDisplay({
  text,
  language,
  lookUpNudge,
  lookUpLabel,
  lookUpHeadline,
  lookUpDetail,
  large,
  fairy,
}: Props) {
  const isRtl = language === "ar";

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-lg mx-auto px-3">
      <AnimatePresence mode="wait">
        <motion.div
          key={text.slice(0, 48)}
          initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className={clsx(
            "w-full p-4 sm:p-7 md:p-10",
            fairy ? "fairy-caption-card" : "caption-card",
            isRtl && "rtl-flip"
          )}
          dir={isRtl ? "rtl" : "ltr"}
        >
          <p
            className={clsx(
              "caption-text font-serif leading-relaxed text-center",
              fairy ? "text-white" : "text-ceremony-text",
              large ? "text-xl sm:text-2xl md:text-3xl" : "text-lg sm:text-xl md:text-2xl"
            )}
          >
            {text}
          </p>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {lookUpNudge && (lookUpHeadline || lookUpLabel) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={clsx("w-full", isRtl && "rtl-flip")}
            dir={isRtl ? "rtl" : "ltr"}
          >
            <motion.div
              className="rounded-2xl border-2 border-emerald-400/65 bg-emerald-950/80 px-5 py-4 text-center"
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(52, 211, 153, 0.4)",
                  "0 0 24px 4px rgba(52, 211, 153, 0.3)",
                  "0 0 0 0 rgba(52, 211, 153, 0.4)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.span
                className="block text-3xl text-emerald-300 mb-1"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                aria-hidden
              >
                ↑
              </motion.span>
              <p className="font-serif text-xl sm:text-2xl font-semibold text-emerald-50">
                {lookUpHeadline ?? lookUpLabel}
              </p>
              {lookUpDetail && (
                <p className="audience-body mt-1.5 text-sm sm:text-base text-emerald-100/85">
                  {lookUpDetail}
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
