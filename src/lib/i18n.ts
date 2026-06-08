import type { LanguageCode } from "./types";

export const languageLabels: Record<
  LanguageCode,
  { native: string; label: string }
> = {
  en: { native: "English", label: "English" },
  fr: { native: "Français", label: "French" },
  ar: { native: "Darija", label: "Moroccan Darija" },
};

export const uiStrings: Record<
  LanguageCode,
  {
    join: string;
    chooseLanguage: string;
    languageHint: string;
    lookUp: string;
    submit: string;
    next: string;
    sessionEnded: string;
    highContrast: string;
    largeText: string;
  }
> = {
  en: {
    join: "Join the live speech",
    chooseLanguage: "Choose your language",
    languageHint: "Captions and prompts will appear in the language you pick.",
    lookUp: "Look up",
    submit: "Send",
    next: "Next",
    sessionEnded: "The ceremony continues beyond the screen.",
    highContrast: "High contrast",
    largeText: "Large text",
  },
  fr: {
    join: "Rejoindre le discours",
    chooseLanguage: "Choisissez votre langue",
    languageHint: "Les sous-titres et les questions s'afficheront dans la langue choisie.",
    lookUp: "Levez les yeux",
    submit: "Envoyer",
    next: "Suivant",
    sessionEnded: "La cérémonie continue au-delà de l'écran.",
    highContrast: "Contraste élevé",
    largeText: "Grand texte",
  },
  ar: {
    join: "انضم للخطاب المباشر",
    chooseLanguage: "اختار اللغة ديالك",
    languageHint: "النص والأسئلة غادي يبانو باللغة li ghadi tختار.",
    lookUp: "رفع راسك",
    submit: "صيفط",
    next: "التالي",
    sessionEnded: "الحفل كيكمل خارج الشاشة.",
    highContrast: "تباين عالي",
    largeText: "نص كبير",
  },
};
