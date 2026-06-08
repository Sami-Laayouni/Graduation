"use client";

import clsx from "clsx";
import type { LanguageCode } from "@/lib/types";
import { languageLabels } from "@/lib/i18n";

const codes: LanguageCode[] = ["en", "fr", "ar"];

interface Props {
  value: LanguageCode;
  onChange: (code: LanguageCode) => void;
  compact?: boolean;
}

export function LanguageSelector({ value, onChange, compact }: Props) {
  return (
    <div
      className={clsx(
        "flex gap-2",
        compact ? "flex-row flex-wrap justify-center" : "flex-col w-full",
      )}
      role="radiogroup"
      aria-label="Language"
    >
      {codes.map((code) => (
        <button
          key={code}
          type="button"
          role="radio"
          aria-checked={value === code}
          onClick={() => onChange(code)}
          className={clsx(
            "rounded-xl border transition-all duration-300",
            compact ? "px-3 py-1.5 text-xs" : "px-5 py-3 text-base w-full text-left",
            value === code
              ? "border-white/35 bg-white/12 text-white"
              : "border-white/12 bg-transparent text-white/60 hover:border-white/25 hover:text-white/85",
          )}
        >
          <span className={code === "ar" ? "font-sans" : ""} dir={code === "ar" ? "rtl" : "ltr"}>
            {languageLabels[code].native}
          </span>
        </button>
      ))}
    </div>
  );
}
