"use client";

import { useState, type ReactNode } from "react";
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

function SectionCard({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={clsx("w-full fairy-reflection-card p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4", className)}>
      <h2 className="text-xs font-sans font-medium tracking-[0.22em] uppercase text-white/55">
        {title}
      </h2>
      {children}
    </section>
  );
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

  const getUid = () => getStoredUserSessionId() ?? "";

  return (
    <motion.div
      className={clsx(
        "w-full max-w-lg mx-auto flex flex-col gap-4 sm:gap-5 pb-2 sm:pb-4 px-0.5 sm:px-0",
        isRtl && "rtl-flip",
      )}
      dir={isRtl ? "rtl" : "ltr"}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Hero — large leaf preview so the person can identify it on the big screen */}
      <div className="flex flex-col items-center text-center gap-3 pt-2">
        {myLeafDNA ? (
          <div className="relative">
            <LeafPreview dna={myLeafDNA} size={108} />
          </div>
        ) : (
          /* Placeholder while DNA loads (fades out when real leaf arrives) */
          <div
            className="rounded-full animate-pulse"
            style={{ width: 80, height: 80, background: "rgba(200,216,240,0.08)" }}
          />
        )}

        <div className="space-y-1.5">
          <span className="inline-block rounded-full px-3 py-1 text-xs font-medium tracking-widest uppercase bg-white/10 border border-white/20 text-white/80">
            {s.savedBadge}
          </span>
          <h1 className="font-serif text-xl sm:text-2xl md:text-3xl text-white font-medium leading-tight">
            {s.thankYouTitle}
          </h1>
          <p className="text-sm text-white/60 mt-1 leading-relaxed max-w-xs mx-auto">
            {s.thankYouSub}
          </p>
        </div>
      </div>

      {/* Look up callout — single place to say "look up" */}
      <div
        className={clsx(
          "w-full rounded-2xl px-4 sm:px-5 py-3.5 sm:py-4 text-center border",
          lookUpNudge
            ? "bg-emerald-500/15 border-emerald-400/35"
            : "bg-white/[0.06] border-white/18",
        )}
      >
        <p className={clsx(
          "font-serif text-base sm:text-lg md:text-xl font-medium",
          lookUpNudge ? "text-emerald-100" : "text-white",
        )}>
          {lookUpNudge ? s.lookUpTitle : s.waitTitle}
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-white/65 max-w-sm mx-auto">
          {lookUpNudge ? s.lookUpSub : s.waitSub}
        </p>
        <p className="mt-2 text-xs text-white/35 leading-relaxed">
          {s.privateNote}
        </p>
      </div>

      {/* 15-year journey */}
      <SectionCard title={s.journeyTitle}>
        <ul className="space-y-2.5 text-sm md:text-base leading-relaxed text-white/85">
          {[s.journeyBullet1, s.journeyBullet2, s.journeyBullet3].map((line) => (
            <li key={line} className="flex gap-3 items-start">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/40" aria-hidden />
              <span>{line}</span>
            </li>
          ))}
        </ul>
        <p className="pt-1 text-xs md:text-sm italic text-white/50 border-t border-white/10">
          {s.journeyTagline}
        </p>
      </SectionCard>

      {/* Public opt-in */}
      <SectionCard title={s.shareTitle}>
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <button
            type="button"
            role="checkbox"
            aria-checked={isPublic}
            onClick={() => setIsPublic((v) => !v)}
            className={clsx(
              "mt-0.5 flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors",
              isPublic
                ? "bg-white border-white text-black"
                : "border-white/35 bg-transparent",
            )}
          >
            {isPublic && <span className="text-sm font-bold">✓</span>}
          </button>
          <span className="text-sm text-white/85 leading-snug">{s.shareLabel}</span>
        </label>
        <AnimatePresence>
          {isPublic && (
            <motion.div
              className="flex flex-col gap-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <input
                type="text"
                maxLength={28}
                placeholder={s.shareNamePlaceholder}
                value={publicName}
                onChange={(e) => setPublicName(e.target.value)}
                className="ceremony-input flex-1 text-sm"
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
                  "btn-ceremony w-full sm:w-auto shrink-0 px-4 py-3 text-sm min-h-[2.75rem]",
                  publicState === "saved" && "border-emerald-400/40 text-emerald-200",
                )}
              >
                {publicState === "saving" ? "…" : publicState === "saved" ? `✓ ${s.shareSaved}` : s.shareSave}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </SectionCard>

      {/* Yearly reminder */}
      <SectionCard title={s.remindTitle}>
        <p className="text-sm text-white/65 leading-relaxed">
          {s.remindDescription}
        </p>
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
                new Notification("You are on the tree", {
                  body: "We will remind you once a year to revisit your main argument.",
                  icon: "/favicon.ico",
                });
              }
            }}
            className="btn-ceremony w-full py-3 text-sm"
          >
            {s.remindButton}
          </button>
        )}
        {notifState === "granted" && (
          <p className="text-center text-sm text-emerald-200/90">✓ {s.remindDone}</p>
        )}
        {(notifState === "denied" || notifState === "unsupported") && (
          <p className="text-center text-xs text-white/45">{s.remindFallback}</p>
        )}
      </SectionCard>
    </motion.div>
  );
}
