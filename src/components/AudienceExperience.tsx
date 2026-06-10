"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import type { LeafDNA, SessionContent } from "@/lib/types";
import { useLiveSession } from "@/hooks/useLiveSession";
import { usePresence, getStoredUserSessionId } from "@/hooks/usePresence";
import { useAudienceStore } from "@/store/audience-store";
import { uiStrings } from "@/lib/i18n";
import { LanguageSelector } from "./LanguageSelector";
import { LanguageWelcome } from "./LanguageWelcome";
import { CaptionDisplay } from "./CaptionDisplay";
import { ReflectionForm } from "./ReflectionForm";
import { SyncIndicator } from "./SyncIndicator";
import { LeafBurst } from "./LeafBurst";
import { LeafPreview } from "./LeafPreview";
import { LeafSavedCard } from "./LeafSavedCard";
import { LookUpBanner } from "./LookUpBanner";
import { playLeafChime } from "@/lib/sounds";
interface Props { session: SessionContent; }

const LEAF_SVG = (
  <svg width="16" height="20" viewBox="0 0 16 20" fill="none" aria-hidden>
    <path d="M8 19C12 15 14 9 13 4 12 1 10 0 8 0 6 0 4 1 3 4 2 9 4 15 8 19Z"
      fill="rgba(200,216,240,0.35)" stroke="rgba(200,216,240,0.6)" strokeWidth="0.7"/>
    <line x1="8" y1="18" x2="8" y2="3" stroke="rgba(200,216,240,0.5)" strokeWidth="0.7" strokeLinecap="round"/>
  </svg>
);

export function AudienceExperience({ session }: Props) {
  const {
    language, reflectionStep, reflectionAnswers, submitted,
    reflectionRoundId, setLanguage, setReflectionAnswer,
    nextReflectionStep, markSubmitted, beginReflectionRound,
  } = useAudienceStore();

  const { liveState, connected, error } = useLiveSession(session.id);
  usePresence(session.id, "audience", language, liveState?.currentSectionId);

  const [highContrast, setHighContrast] = useState(false);
  const [largeText,    setLargeText]    = useState(false);
  const [submitting,   setSubmitting]   = useState(false);
  const [showThanks,   setShowThanks]   = useState(false);
  const [showBurst,    setShowBurst]    = useState(false);
  const [myLeafDNA,    setMyLeafDNA]    = useState<LeafDNA | null>(null);

  const t             = uiStrings[language];
  const isPersonal    = liveState?.projectorMode === "personal";
  const sectionIdx    = session.sections.findIndex(s => s.id === liveState?.currentSectionId);
  const section       = session.sections[sectionIdx] ?? session.sections[0];
  const trans         = section.translations[language];

  const inReflection =
    liveState?.audienceState === "reflection_input" ||
    liveState?.audienceState === "response_collection";

  const roundKey = `${liveState?.currentSectionId}-${liveState?.timestamp ?? 0}`;

  useEffect(() => {
    if (!inReflection) return;
    if (reflectionRoundId !== roundKey) beginReflectionRound(roundKey);
  }, [inReflection, roundKey, reflectionRoundId, beginReflectionRound]);

  const showReflection = inReflection && !submitted && !showThanks;
  const isLanguageBoot = section.id === "qr_intro";
  const showLookUpPrompt = !!(liveState?.lookUpNudge || showThanks);

  const captionText = useMemo(() => {
    if (liveState?.mode === "ended") return t.sessionEnded;
    return trans?.captionText ?? "";
  }, [trans, liveState?.mode, t.sessionEnded, language]);

  // submitOne returns the LeafDNA on success so handleSubmit can batch all
  // state updates (DNA + showThanks) into the same synchronous block, which
  // guarantees React renders the card with the leaf already present.
  const submitOne = useCallback(async (promptId: string): Promise<LeafDNA | null> => {
    const text = reflectionAnswers[promptId];
    if (!text?.trim()) return null;
    setSubmitting(true);
    const uid = getStoredUserSessionId();
    try {
      const res = await fetch(`/api/session/${session.id}/response`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userSessionId: uid,
          promptId,
          responseText: text,
          languageCode: language,
        }),
      });
      playLeafChime();
      setShowBurst(true);
      setTimeout(() => setShowBurst(false), 2200);
      if (res.ok) {
        const data = await res.json() as { dna?: LeafDNA };
        return data.dna ?? null;
      }
      return null;
    } finally {
      setSubmitting(false);
    }
  }, [session.id, reflectionAnswers, language]);

  const handleSubmit = useCallback(async (promptId: string) => {
    const isLast = reflectionStep >= session.reflectionPrompts.length - 1;
    const dna = await submitOne(promptId);
    if (isLast) {
      // Set DNA and showThanks synchronously so they land in the same render —
      // the LeafSavedCard will always mount with the leaf already populated.
      if (dna) setMyLeafDNA(dna);
      markSubmitted();
      setShowThanks(true);
    }
  }, [reflectionStep, session.reflectionPrompts.length, submitOne, markSubmitted]);

  // Fallback: if the card is visible but DNA is still missing (e.g. a network
  // hiccup on submit, or the user refreshed mid-session), fetch it from the server.
  useEffect(() => {
    if (!showThanks || myLeafDNA) return;
    const uid = getStoredUserSessionId();
    if (!uid) return;
    fetch(`/api/session/${session.id}/response?userSessionId=${encodeURIComponent(uid)}`, {
      cache: "no-store",
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { leaf?: LeafDNA } | null) => {
        if (data?.leaf) setMyLeafDNA(data.leaf);
      })
      .catch(() => {/* ignore */});
  }, [showThanks, myLeafDNA, session.id]);

  // Once the speech advances past the reflection section, go back to normal captions
  useEffect(() => {
    if (showThanks && !inReflection) {
      setShowThanks(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inReflection]);

  return (
    <div className={clsx(
      "min-h-dvh flex flex-col fairy-page relative overflow-x-hidden",
      highContrast && "high-contrast",
      largeText && "large-text",
    )}>
      {showBurst && <LeafBurst />}

      {/* Subtle ambient particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full fairy-sparkle"
            style={{
              width:  3 + (i % 3),
              height: 3 + (i % 3),
              left:   `${15 + i * 14}%`,
              top:    `${20 + (i % 3) * 18}%`,
              animationDelay: `${i * 1.1}s`,
              animationDuration: `${6 + i}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header
        className="relative z-10 flex items-center justify-between gap-2 audience-safe-x audience-safe-top px-3 sm:px-4 py-2.5 sm:py-3 shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <div className="shrink-0" style={{ opacity: 0.6 }}>{LEAF_SVG}</div>
          <span className="text-[10px] sm:text-[11px] tracking-[0.14em] sm:tracking-[0.18em] uppercase truncate max-w-[30vw] sm:max-w-none"
            style={{ color: "rgba(200,216,240,0.45)" }}>
            Class of 2026
          </span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {!isLanguageBoot && (
            <LanguageSelector value={language} onChange={setLanguage} compact />
          )}
          <SyncIndicator connected={connected} error={error} compact />
        </div>
      </header>

      {/* Main — scrollable; start-aligned so post-submit content scrolls on phone */}
      <main className={clsx(
        "relative z-10 flex-1 flex flex-col min-h-0 py-3 sm:py-4 px-2 sm:px-3 gap-3 sm:gap-4 overflow-y-auto overscroll-y-contain audience-safe-x",
        showThanks || showReflection ? "justify-start" : "justify-center",
      )}>
        {showLookUpPrompt && (
          <LookUpBanner language={language} sticky className="shrink-0" />
        )}
        <AnimatePresence mode="wait">
          {showReflection ? (
            <motion.div
              key="reflection"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ReflectionForm
                prompts={session.reflectionPrompts}
                step={reflectionStep}
                language={language}
                answers={reflectionAnswers}
                onAnswer={setReflectionAnswer}
                onNext={nextReflectionStep}
                onSubmitPrompt={handleSubmit}
                submitting={submitting}
              />
            </motion.div>
          ) : showThanks ? (
            isPersonal && myLeafDNA ? (
              /* ── Personal mode: the leaf IS the experience ── */
              <motion.div
                key="personal-leaf"
                className="flex flex-col items-center gap-4 sm:gap-6 py-4 sm:py-6 w-full max-w-sm mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.div
                  initial={{ scale: 0.3, opacity: 0, rotate: -20 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.2 }}
                >
                  <LeafPreview dna={myLeafDNA} size={128} />
                </motion.div>

                <motion.div
                  className="text-center space-y-2"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                >
                  <p className="font-serif text-xl sm:text-2xl" style={{ color: "#e8ecf4" }}>
                    Your leaf
                  </p>
                  <p className="text-sm" style={{ color: "rgba(200,216,240,0.45)" }}>
                    Unique to you. Saved permanently.
                  </p>
                </motion.div>
              </motion.div>
            ) : (
              <LeafSavedCard
                key="thanks"
                language={language}
                sessionId={session.id}
                myLeafDNA={myLeafDNA}
                lookUpNudge={!!(liveState?.lookUpNudge || showThanks)}
              />
            )
          ) : isLanguageBoot ? (
            <LanguageWelcome
              key="language-welcome"
              language={language}
              onChange={setLanguage}
              hint={captionText}
            />
          ) : (
            <motion.div
              key={section.id}
              className="flex flex-col gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <CaptionDisplay
                text={captionText}
                language={language}
                lookUpNudge={liveState?.lookUpNudge && !showLookUpPrompt}
                lookUpLabel={t.lookUp}
                lookUpHeadline={t.lookUpHeadline}
                lookUpDetail={t.lookUpDetail}
                large={largeText}
                fairy
              />
              {liveState?.lookUpNudge && !showLookUpPrompt && (
                <p
                  className="audience-muted text-center text-sm sm:text-base font-medium leading-relaxed px-2 sm:px-4 max-w-md mx-auto text-emerald-200/80"
                  dir={language === "ar" ? "rtl" : "ltr"}
                >
                  {t.lookUpReminder}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer
        className="relative z-10 audience-safe-x audience-safe-bottom px-3 sm:px-4 py-2.5 sm:py-3 space-y-2.5 sm:space-y-3 shrink-0"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        {/* Progress — show only a window of dots around the current section */}
        <div className="flex justify-center gap-[3px] overflow-hidden">
          {session.sections.map((_, i) => {
            const dist = Math.abs(i - sectionIdx);
            if (dist > 8) return null;
            return (
              <div
                key={i}
                className="rounded-full transition-all duration-500 flex-shrink-0"
                style={{
                  width:      i === sectionIdx ? 16 : 4,
                  height:     4,
                  opacity:    dist === 0 ? 1 : Math.max(0.12, 0.7 - dist * 0.09),
                  background: i === sectionIdx
                    ? "rgba(200,216,240,0.80)"
                    : i < sectionIdx
                      ? "rgba(200,216,240,0.32)"
                      : "rgba(255,255,255,0.10)",
                }}
              />
            );
          })}
        </div>

        {/* Accessibility toggles */}
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs sm:text-sm" style={{ color: "rgba(200,216,240,0.38)" }}>
          <label className="flex items-center gap-2 cursor-pointer select-none audience-touch px-1">
            <input type="checkbox" className="accent-gray-400 w-4 h-4 shrink-0" checked={highContrast} onChange={e => setHighContrast(e.target.checked)} />
            {t.highContrast}
          </label>
          <label className="flex items-center gap-2 cursor-pointer select-none audience-touch px-1">
            <input type="checkbox" className="accent-gray-400 w-4 h-4 shrink-0" checked={largeText} onChange={e => setLargeText(e.target.checked)} />
            {t.largeText}
          </label>
        </div>
      </footer>
    </div>
  );
}
