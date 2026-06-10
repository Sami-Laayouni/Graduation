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
    lookUpHeadline: string;
    lookUpDetail: string;
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
    lookUp: "Look up ↑",
    lookUpHeadline: "Look up at the screen",
    lookUpDetail: "Your leaf is on the tree — find it on the projector now",
    lookUpReminder: "Eyes up! The big screen shows your leaf on the tree",
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
    lookUp: "Levez les yeux ↑",
    lookUpHeadline: "Regardez le grand écran",
    lookUpDetail: "Votre feuille est sur l'arbre — trouvez-la sur le projecteur",
    lookUpReminder: "Yeux levés ! Le grand écran montre votre feuille sur l'arbre",
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
    lookUp: "rfa3 rassk ↑",
    lookUpHeadline: "chouf l'écran lkbir",
    lookUpDetail: "wra9tak f shajara — l9aha 3la lprojecteur daba",
    lookUpReminder: "rfa3 rassk! l'écran kbir kaywri wra9tak f shajara",
    submit: "sft",
    next: "lji",
    sessionEnded: "l7afla salat barra l'écran",
    highContrast: "contrast 3ali",
    largeText: "khatt kbir",
  },
};
