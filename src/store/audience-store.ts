"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LanguageCode } from "@/lib/types";

interface AudienceStore {
  language: LanguageCode;
  reflectionStep: number;
  reflectionAnswers: Record<string, string>;
  submitted: boolean;
  reflectionRoundId: string;
  setLanguage: (lang: LanguageCode) => void;
  setReflectionAnswer: (promptId: string, text: string) => void;
  nextReflectionStep: () => void;
  markSubmitted: () => void;
  resetReflection: () => void;
  beginReflectionRound: (roundId: string) => void;
}

export const useAudienceStore = create<AudienceStore>()(
  persist(
    (set) => ({
      language: "en",
      reflectionStep: 0,
      reflectionAnswers: {},
      submitted: false,
      reflectionRoundId: "",
      setLanguage: (language) => set({ language }),
      setReflectionAnswer: (promptId, text) =>
        set((s) => ({
          reflectionAnswers: { ...s.reflectionAnswers, [promptId]: text },
        })),
      nextReflectionStep: () =>
        set((s) => ({ reflectionStep: s.reflectionStep + 1 })),
      markSubmitted: () => set({ submitted: true }),
      resetReflection: () =>
        set({ reflectionStep: 0, reflectionAnswers: {}, submitted: false }),
      beginReflectionRound: (roundId) =>
        set({
          reflectionRoundId: roundId,
          reflectionStep: 0,
          reflectionAnswers: {},
          submitted: false,
        }),
    }),
    { name: "graduation-audience" }
  )
);
