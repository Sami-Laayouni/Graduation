"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import type { LanguageCode, ReflectionPrompt } from "@/lib/types";
import { uiStrings } from "@/lib/i18n";

interface Props {
  prompts: ReflectionPrompt[];
  step: number;
  language: LanguageCode;
  answers: Record<string, string>;
  onAnswer: (promptId: string, text: string) => void;
  onNext: () => void;
  onSubmitPrompt: (promptId: string) => Promise<void>;
  submitting?: boolean;
}

export function ReflectionForm({
  prompts,
  step,
  language,
  answers,
  onAnswer,
  onNext,
  onSubmitPrompt,
  submitting,
}: Props) {
  const t = uiStrings[language];
  const prompt = prompts[step];
  const isLast = step >= prompts.length - 1;
  const isRtl = language === "ar";

  if (!prompt) return null;

  const currentAnswer = answers[prompt.id] ?? "";

  const handleContinue = async () => {
    if (!currentAnswer.trim()) return;
    await onSubmitPrompt(prompt.id);
    if (!isLast) onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={clsx(
        "w-full max-w-md mx-auto flex flex-col gap-6 fairy-reflection-card p-8",
        isRtl && "rtl-flip"
      )}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <p className="prompt-text font-serif text-xl md:text-2xl text-center leading-relaxed"
        style={{ color: "rgba(232,236,244,0.95)" }}>
        {prompt.texts[language]}
      </p>

      <textarea
        value={currentAnswer}
        onChange={(e) => onAnswer(prompt.id, e.target.value)}
        rows={4}
        className="ceremony-input w-full resize-none"
        placeholder="…"
        aria-label={prompt.texts[language]}
      />

      <button
        type="button"
        disabled={!currentAnswer.trim() || submitting}
        onClick={handleContinue}
        className="fairy-btn w-full disabled:opacity-40"
      >
        {isLast ? t.submit : t.next}
      </button>
    </motion.div>
  );
}
