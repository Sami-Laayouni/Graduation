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
    lookUpReminder: string;
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
    lookUpReminder: "Try to look up at the screen, not too much at your phone",
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
    lookUpReminder: "Essayez de regarder l'écran, pas trop votre téléphone",
    submit: "Envoyer",
    next: "Suivant",
    sessionEnded: "La cérémonie continue au-delà de l'écran.",
    highContrast: "Contraste élevé",
    largeText: "Grand texte",
  },
  ar: {
    join: "tla3 l9ism dyal lkhitab المباشر",
    chooseLanguage: "khtar llogha dyalek",
    languageHint: "lktaba w lso2alat ghadi ybanu b llogha li khtarti",
    lookUp: "rfa3 rassk",
    lookUpReminder: "7awel rfa3 rassk w chouf l'écran, ma tba9ach bzzaf f téléphone",
    submit: "sft",
    next: "lji",
    sessionEnded: "l7afla salat barra l'écran",
    highContrast: "contrast 3ali",
    largeText: "khatt kbir",
  },
};
