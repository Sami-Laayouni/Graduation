"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
}

export function LeafSavedCard({
  language,
  sessionId,
  myLeafDNA,
}: Props) {
  const s = leafSavedStrings[language];
  const isRtl = language === "ar";

  const [isPublic, setIsPublic] = useState(false);
  const [publicName, setPublicName] = useState("");
  const [publicState, setPublicState] = useState<PublicState>("idle");
  const [notifState, setNotifState] = useState<NotifState>("idle");

  const getUid = () => getStoredUserSessionId() ?? "";

  return (
    <motion.div
      className={clsx("w-full max-w-md mx-auto pb-8", isRtl && "rtl-flip")}
      dir={isRtl ? "rtl" : "ltr"}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="fairy-reflection-card overflow-hidden">
        {/* Hero */}
        <div
          className="flex flex-col items-center text-center px-5 pt-8 pb-6"
          style={{
            background:
              "linear-gradient(180deg, rgba(200,216,240,0.06) 0%, transparent 100%)",
          }}
        >
          <div
            className="mb-5 rounded-full flex items-center justify-center"
            style={{
              width: 120,
              height: 120,
              background: "radial-gradient(circle, rgba(200,216,240,0.12) 0%, transparent 70%)",
            }}
          >
            {myLeafDNA ? (
              <LeafPreview dna={myLeafDNA} size={96} />
            ) : (
              <div
                className="rounded-full animate-pulse"
                style={{ width: 72, height: 72, background: "rgba(200,216,240,0.08)" }}
              />
            )}
          </div>

          <h1 className="audience-body-lg font-serif text-white font-medium leading-snug mb-2">
            {s.thankYouTitle}
          </h1>
          <p className="audience-body text-sm sm:text-base text-white/75 leading-relaxed max-w-[20rem]">
            {s.thankYouSub}
          </p>
          <p className="audience-muted text-xs text-white/40 mt-3">
            {s.privacyNote}
          </p>
        </div>

        <div className="h-px mx-5" style={{ background: "rgba(255,255,255,0.08)" }} />

        {/* Share */}
        <section className="px-5 py-5 space-y-3">
          <h2 className="audience-body text-sm font-medium text-white/80">
            {s.shareTitle}
          </h2>
          <p className="audience-body text-sm text-white/55 leading-relaxed">
            {s.shareDescription}
          </p>
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <button
              type="button"
              role="checkbox"
              aria-checked={isPublic}
              onClick={() => setIsPublic((v) => !v)}
              className={clsx(
                "audience-touch mt-0.5 flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors",
                isPublic
                  ? "bg-white border-white text-black"
                  : "border-white/30 bg-white/5",
              )}
            >
              {isPublic && <span className="text-xs font-bold leading-none">✓</span>}
            </button>
            <span className="audience-body text-sm text-white/70 leading-snug">{s.shareLabel}</span>
          </label>
          {isPublic && (
            <div className="flex flex-col gap-2 pl-8">
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
                  "fairy-btn w-full py-2.5 text-sm min-h-[2.75rem]",
                  publicState === "saved" && "border-emerald-400/40 text-emerald-200",
                )}
              >
                {publicState === "saving" ? "…" : publicState === "saved" ? s.shareSaved : s.shareSave}
              </button>
            </div>
          )}
        </section>

        <div className="h-px mx-5" style={{ background: "rgba(255,255,255,0.08)" }} />

        {/* Reminder */}
        <section className="px-5 py-5 space-y-3">
          <h2 className="audience-body text-sm font-medium text-white/80">
            {s.remindTitle}
          </h2>
          <p className="audience-body text-sm text-white/55 leading-relaxed">{s.remindDescription}</p>
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
              className="fairy-btn w-full py-2.5 text-sm min-h-[2.75rem]"
            >
              {s.remindButton}
            </button>
          )}
          {notifState === "granted" && (
            <p className="audience-body text-center text-sm text-emerald-200/90">{s.remindDone}</p>
          )}
          {(notifState === "denied" || notifState === "unsupported") && (
            <p className="audience-muted text-center text-xs text-white/45">{s.remindFallback}</p>
          )}
        </section>
      </div>
    </motion.div>
  );
}
