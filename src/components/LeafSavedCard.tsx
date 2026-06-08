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
  onLeafUpdate: (dna: LeafDNA) => void;
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
    <section className={clsx("w-full fairy-reflection-card p-5 md:p-6 space-y-4", className)}>
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
  onLeafUpdate,
}: Props) {
  const s = leafSavedStrings[language];
  const isRtl = language === "ar";

  const [isPublic, setIsPublic] = useState(false);
  const [publicName, setPublicName] = useState("");
  const [publicState, setPublicState] = useState<PublicState>("idle");
  const [updateText, setUpdateText] = useState("");
  const [updating, setUpdating] = useState(false);
  const [updateDone, setUpdateDone] = useState(false);
  const [notifState, setNotifState] = useState<NotifState>("idle");

  const getUid = () => getStoredUserSessionId() ?? "";

  return (
    <motion.div
      className={clsx(
        "w-full max-w-lg mx-auto flex flex-col gap-5 pb-4",
        isRtl && "rtl-flip",
      )}
      dir={isRtl ? "rtl" : "ltr"}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Hero */}
      <div className="flex flex-col items-center text-center gap-4 pt-2">
        {myLeafDNA && <LeafPreview dna={myLeafDNA} size={100} />}

        <div className="space-y-2">
          <span className="inline-block rounded-full px-3 py-1 text-xs font-medium tracking-widest uppercase bg-white/10 border border-white/20 text-white/80">
            ✓ {s.savedBadge}
          </span>
          <h1 className="font-serif text-3xl md:text-4xl text-white font-medium leading-tight">
            {s.savedTitle}
          </h1>
        </div>
      </div>

      {/* Look up callout */}
      <div
        className={clsx(
          "w-full rounded-2xl px-5 py-5 text-center border",
          lookUpNudge
            ? "bg-emerald-500/15 border-emerald-400/35"
            : "bg-white/[0.06] border-white/18",
        )}
      >
        <p className={clsx(
          "font-serif text-xl md:text-2xl font-medium",
          lookUpNudge ? "text-emerald-100" : "text-white",
        )}>
          {lookUpNudge ? s.lookUpTitle : s.waitTitle}
        </p>
        <p className="mt-2 text-sm md:text-base leading-relaxed text-white/75 max-w-sm mx-auto">
          {lookUpNudge ? s.lookUpSub : s.waitSub}
        </p>
      </div>

      {/* 15-year journey */}
      <SectionCard title={s.journeyTitle}>
        <ul className="space-y-3 text-base md:text-lg leading-relaxed text-white/90">
          {[s.journeyBullet1, s.journeyBullet2, s.journeyBullet3].map((line) => (
            <li key={line} className="flex gap-3 items-start">
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white/50" aria-hidden />
              <span>{line}</span>
            </li>
          ))}
        </ul>
        <p className="pt-1 text-sm md:text-base italic text-white/60 border-t border-white/10">
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
          <span className="text-base text-white/90 leading-snug">{s.shareLabel}</span>
        </label>
        <AnimatePresence>
          {isPublic && (
            <motion.div
              className="flex flex-col sm:flex-row gap-2"
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
                className="ceremony-input flex-1 text-base"
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
                  "btn-ceremony shrink-0 px-5 py-3 text-base",
                  publicState === "saved" && "border-emerald-400/40 text-emerald-200",
                )}
              >
                {publicState === "saving" ? "…" : publicState === "saved" ? `✓ ${s.shareSaved}` : s.shareSave}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </SectionCard>

      {/* Update leaf */}
      <SectionCard title={s.updateTitle}>
        {!updateDone ? (
          <div className="space-y-3">
            <textarea
              rows={3}
              placeholder={s.updatePlaceholder}
              value={updateText}
              onChange={(e) => setUpdateText(e.target.value)}
              className="ceremony-input text-base min-h-[88px]"
            />
            <button
              type="button"
              disabled={!updateText.trim() || updating}
              onClick={async () => {
                if (!updateText.trim()) return;
                setUpdating(true);
                try {
                  const res = await fetch(`/api/session/${sessionId}/response`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      userSessionId: getUid(),
                      responseText: updateText,
                    }),
                  });
                  if (res.ok) {
                    const data = await res.json() as { dna?: LeafDNA };
                    if (data.dna) onLeafUpdate(data.dna);
                    setUpdateDone(true);
                  }
                } finally {
                  setUpdating(false);
                }
              }}
              className="btn-ceremony-primary w-full py-3.5 text-base disabled:opacity-40"
            >
              {updating ? s.updating : s.updateButton}
            </button>
          </div>
        ) : (
          <p className="text-center text-base text-emerald-200/90 py-2">
            ✓ {s.updateDone}
          </p>
        )}
      </SectionCard>

      {/* Yearly reminder */}
      <SectionCard title={s.remindTitle}>
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
                new Notification("You're on the tree", {
                  body: "We'll remind you once a year to revisit your main argument.",
                  icon: "/favicon.ico",
                });
              }
            }}
            className="btn-ceremony w-full py-3.5 text-base"
          >
            {s.remindButton}
          </button>
        )}
        {notifState === "granted" && (
          <p className="text-center text-base text-emerald-200/90">✓ {s.remindDone}</p>
        )}
        {(notifState === "denied" || notifState === "unsupported") && (
          <p className="text-center text-sm text-white/55">{s.remindFallback}</p>
        )}
      </SectionCard>
    </motion.div>
  );
}
