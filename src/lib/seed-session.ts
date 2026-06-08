import type { SessionContent } from "./types";
import { speechSections } from "./speech-sections";

export const DEMO_SESSION_ID = "demo";

export const demoSession: SessionContent = {
  id: DEMO_SESSION_ID,
  slug: DEMO_SESSION_ID,
  title: "Class of 2026 — The Main Argument of a Life",
  eventDate: "2026-05-28",
  status: "live",
  reflectionPrompts: [
    {
      id: "prompt_main_argument",
      promptKey: "main_argument",
      inputType: "short_text",
      texts: {
        en: "What is the purpose — the main argument — driving your life right now? (It's okay if you're unsure.)",
        fr: "Quel est le but — la thèse principale — qui guide votre vie en ce moment ? (C'est normal d'hésiter.)",
        ar: "شنو هي الغاية — الحجة الرئيسية — اللي كتحرك حياتك دابا؟ (عادي إلا ما كنتيش متأكد.)",
      },
    },
  ],
  projectorCues: {
    en: {
      idle: "",
      main_argument: "Everything has a main argument.",
      question: "What is the main argument of a life?",
      look_up: "Look up.",
      seasons: "Like the seasons, your leaves will change.",
      still_written: "The story is still being written.",
      final: "Never stop looking for the main argument in your life.",
    },
    fr: {
      idle: "",
      main_argument: "Tout a une thèse principale.",
      question: "Quelle est la thèse principale d'une vie ?",
      look_up: "Levez les yeux.",
      seasons: "Comme les saisons, vos feuilles changeront.",
      still_written: "L'histoire s'écrit encore.",
      final: "Ne cessez jamais de chercher la thèse principale de votre vie.",
    },
    ar: {
      idle: "",
      main_argument: "كلشي عندو حجة رئيسية.",
      question: "شنو هي الحجة الرئيسية ديال الحياة؟",
      look_up: "رفع راسك.",
      seasons: "بحال الفصول، ورقاتك غادي تتبدل.",
      still_written: "القصة مازال كتكتب.",
      final: "ما توقفش تقلب على الحجة الرئيسية فحياتك.",
    },
  },
  sections: speechSections,
};

export function getSessionById(id: string): SessionContent | undefined {
  if (id === DEMO_SESSION_ID) return demoSession;
  return undefined;
}
