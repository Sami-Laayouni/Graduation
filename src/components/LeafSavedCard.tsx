"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import type { LanguageCode, LeafDNA } from "@/lib/types";
import { leafSavedStrings } from "@/lib/leaf-saved-i18n";
import { LeafPreview } from "./LeafPreview";
import { getStoredUserSessionId } from "@/hooks/usePresence";

type NotifState = "idle" | "granted" | "denied" | "unsupported";
type PublicState = "idle" | "saving" | "saved" | "error";

interface Props {
  language: LanguageCode;
  sessionId: string;
  myLeafDNA: LeafDNA | null;
  lookUpNudge: boolean;
}

export function LeafSavedCard({
  language,
  sessionId,
  myLeafDNA,
  lookUpNudge,
}: Props) {
  const s = leafSavedStrings[language];
  const isRtl = language === "ar";

  const [isPublic, setIsPublic] = useState(false);
  const [publicName, setPublicName] = useState("");
  const [publicState, setPublicState] = useState<PublicState>("idle");
  const [notifState, setNotifState] = useState<NotifState>("idle");
  const [showExtras, setShowExtras] = useState(false);

  const getUid = () => getStoredUserSessionId() ?? "";

  return (
    <motion.div
      className={clsx(
        "w-full max-w-lg mx-auto flex flex-col gap-3 sm:gap-4 pb-6",
        isRtl && "rtl-flip",
      )}
      dir={isRtl ? "rtl" : "ltr"}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Hero */}
      <div className="flex flex-col items-center text-center gap-2 pt-1">
        {myLeafDNA ? (
          <LeafPreview dna={myLeafDNA} size={100} />
        ) : (
          <div
            className="rounded-full animate-pulse"
            style={{ width: 72, height: 72, background: "rgba(200,216,240,0.08)" }}
          />
        )}
        <h1 className="audience-body-lg font-serif text-white font-medium leading-tight">
          {s.thankYouTitle}
        </h1>
        <p className="audience-muted text-sm text-white/55 max-w-xs">
          {s.thankYouSub}
        </p>
      </div>

      {/* Status callout — extra emphasis when speaker triggers look-up */}
      <div
        className={clsx(
          "w-full rounded-2xl px-4 py-3.5 text-center border",
          lookUpNudge
            ? "border-emerald-400/60 bg-emerald-500/20 ring-2 ring-emerald-400/30"
            : "fairy-reflection-card border-white/15",
        )}
      >
        {lookUpNudge && (
          <motion.span
            className="block text-2xl text-emerald-300 mb-1"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            aria-hidden
          >
            ↑
          </motion.span>
        )}
        <p className={clsx(
          "audience-body-lg font-serif font-semibold",
          lookUpNudge ? "text-emerald-50 text-lg sm:text-xl" : "text-white",
        )}>
          {lookUpNudge ? s.lookUpTitle : s.waitTitle}
        </p>
        <p className={clsx(
          "audience-muted mt-1 text-sm leading-relaxed",
          lookUpNudge ? "text-emerald-100/90" : "text-white/60",
        )}>
          {lookUpNudge ? s.lookUpSub : s.waitSub}
        </p>
      </div>

      {/* Optional extras — collapsed by default to reduce scroll fatigue */}
      <button
        type="button"
        onClick={() => setShowExtras((v) => !v)}
        className="audience-touch audience-muted text-sm text-white/45 hover:text-white/70 transition-colors py-1"
      >
        {showExtras ? "▲ Less" : "▼ More options"}
      </button>

      <AnimatePresence>
        {showExtras && (
          <motion.div
            className="flex flex-col gap-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            {/* Public opt-in */}
            <section className="fairy-reflection-card p-4 space-y-3">
              <h2 className="audience-muted text-xs font-sans tracking-[0.18em] uppercase text-white/50">
                {s.shareTitle}
              </h2>
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={isPublic}
                  onClick={() => setIsPublic((v) => !v)}
                  className={clsx(
                    "audience-touch mt-0.5 flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center",
                    isPublic ? "bg-white border-white text-black" : "border-white/35",
                  )}
                >
                  {isPublic && <span className="text-sm font-bold">✓</span>}
                </button>
                <span className="audience-body text-sm text-white/85">{s.shareLabel}</span>
              </label>
              {isPublic && (
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    maxLength={28}
                    placeholder={s.shareNamePlaceholder}
                    value={publicName}
                    onChange={(e) => setPublicName(e.target.value)}
                    className="ceremony-input text-sm"
                  />
                  <button
                    type="button"
                    disabled={publicState === "saving" || publicState === "saved"}
                    onClick={async () => {
                      setPublicState("saving");
                      try {
                        const res = await fetch(`/api/session/${sessionId}/response`, {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            userSessionId: getUid(),
                            isPublic: true,
                            username: publicName,
                          }),
                        });
                        setPublicState(res.ok ? "saved" : "error");
                      } catch {
                        setPublicState("error");
                      }
                    }}
                    className={clsx(
                      "btn-ceremony w-full py-3 text-sm min-h-[2.75rem]",
                      publicState === "saved" && "border-emerald-400/40 text-emerald-200",
                    )}
                  >
                    {publicState === "saving" ? "…" : publicState === "saved" ? `✓ ${s.shareSaved}` : s.shareSave}
                  </button>
                </div>
              )}
            </section>

            {/* Yearly reminder */}
            <section className="fairy-reflection-card p-4 space-y-3">
              <h2 className="audience-muted text-xs font-sans tracking-[0.18em] uppercase text-white/50">
                {s.remindTitle}
              </h2>
              <p className="audience-body text-sm text-white/65">{s.remindDescription}</p>
              {notifState === "idle" && (
                <button
                  type="button"
                  onClick={async () => {
                    if (!("Notification" in window)) {
                      setNotifState("unsupported");
                      return;
                    }
                    const perm = await Notification.requestPermission();
                    setNotifState(perm === "granted" ? "granted" : "denied");
                    if (perm === "granted") {
                      localStorage.setItem("yearly-reminder-opted-in", new Date().toISOString());
                    }
                  }}
                  className="btn-ceremony w-full py-3 text-sm min-h-[2.75rem]"
                >
                  {s.remindButton}
                </button>
              )}
              {notifState === "granted" && (
                <p className="audience-body text-center text-sm text-emerald-200/90">✓ {s.remindDone}</p>
              )}
              {(notifState === "denied" || notifState === "unsupported") && (
                <p className="audience-muted text-center text-xs text-white/45">{s.remindFallback}</p>
              )}
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
