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
  usePresence(session.id, "audience", language);

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

  const captionText = useMemo(() => {
    if (liveState?.mode === "ended") return t.sessionEnded;
    return trans?.captionText ?? "";
  }, [trans, liveState?.mode, t.sessionEnded, language]);

  const submitOne = useCallback(async (promptId: string) => {
    const text = reflectionAnswers[promptId];
    if (!text?.trim()) return;
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
      if (res.ok) {
        const data = await res.json() as { dna?: LeafDNA };
        if (data.dna) setMyLeafDNA(data.dna);
      }
      playLeafChime();
      setShowBurst(true);
      setTimeout(() => setShowBurst(false), 2200);
    } finally {
      setSubmitting(false);
    }
  }, [session.id, reflectionAnswers, language]);

  const handleSubmit = useCallback(async (promptId: string) => {
    const isLast = reflectionStep >= session.reflectionPrompts.length - 1;
    await submitOne(promptId);
    if (isLast) {
      markSubmitted();
      setShowThanks(true);
      // In personal mode keep the leaf on screen longer — it IS the experience
      // Keep the 15-year message + options on screen indefinitely — no auto-dismiss.
      // The card stays until the ceremony ends or a new reflection round begins.
    }
  }, [reflectionStep, session.reflectionPrompts.length, submitOne, markSubmitted, isPersonal]);

  return (
    <div className={clsx("min-h-dvh flex flex-col fairy-page relative", highContrast && "high-contrast", largeText && "large-text")}>
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
      <header className="relative z-10 flex items-center justify-between px-5 py-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="flex items-center gap-2">
          <div style={{ opacity: 0.6 }}>{LEAF_SVG}</div>
          <span className="text-xs tracking-[0.2em] uppercase" style={{ color: "rgba(200,216,240,0.45)" }}>
            Class of 2026
          </span>
        </div>
        <div className="flex items-center gap-3">
          {!isLanguageBoot && (
            <LanguageSelector value={language} onChange={setLanguage} compact />
          )}
          <SyncIndicator connected={connected} error={error} />
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 flex-1 flex flex-col justify-start md:justify-center py-6 px-5 gap-6 overflow-y-auto">
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
                className="flex flex-col items-center gap-6 py-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.div
                  initial={{ scale: 0.3, opacity: 0, rotate: -20 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.2 }}
                >
                  <LeafPreview dna={myLeafDNA} size={160} />
                </motion.div>

                <motion.div
                  className="text-center space-y-2"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                >
                  <p className="font-serif text-2xl" style={{ color: "#e8ecf4" }}>
                    Your leaf
                  </p>
                  <p className="text-sm" style={{ color: "rgba(200,216,240,0.45)" }}>
                    Unique to you. Saved permanently.
                  </p>
                </motion.div>

                {/* Sync pulse — all leaves appear together */}
                {liveState?.lookUpNudge && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.7 }}
                    className="mt-2 rounded-xl px-6 py-4 text-center"
                    style={{ background: "rgba(200,216,240,0.06)", border: "1px solid rgba(200,216,240,0.1)" }}
                  >
                    <p className="font-serif text-base" style={{ color: "rgba(230,238,250,0.85)" }}>
                      Everyone is seeing their leaf right now
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <LeafSavedCard
                key="thanks"
                language={language}
                sessionId={session.id}
                myLeafDNA={myLeafDNA}
                lookUpNudge={!!liveState?.lookUpNudge}
                onLeafUpdate={setMyLeafDNA}
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
            <CaptionDisplay
              key={section.id}
              text={captionText}
              language={language}
              lookUpNudge={liveState?.lookUpNudge}
              lookUpLabel={t.lookUp}
              large={largeText}
              fairy
            />
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-5 py-5 space-y-4"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        {/* Progress dots */}
        <div className="flex justify-center gap-1">
          {session.sections.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-500"
              style={{
                width:      i === sectionIdx ? 14 : 4,
                height:     4,
                background: i === sectionIdx
                  ? "rgba(200,216,240,0.7)"
                  : i < sectionIdx
                    ? "rgba(200,216,240,0.25)"
                    : "rgba(255,255,255,0.08)",
              }}
            />
          ))}
        </div>

        {/* Accessibility toggles */}
        <div className="flex justify-center gap-5 text-xs" style={{ color: "rgba(200,216,240,0.3)" }}>
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input type="checkbox" className="accent-gray-400" checked={highContrast} onChange={e => setHighContrast(e.target.checked)} />
            {t.highContrast}
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input type="checkbox" className="accent-gray-400" checked={largeText} onChange={e => setLargeText(e.target.checked)} />
            {t.largeText}
          </label>
        </div>
      </footer>
    </div>
  );
}
