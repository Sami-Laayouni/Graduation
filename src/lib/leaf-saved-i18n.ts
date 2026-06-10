import type { LanguageCode } from "./types";

export interface LeafSavedStrings {
  thankYouTitle: string;
  thankYouSub: string;
  lookUpTitle: string;
  lookUpSub: string;
  waitTitle: string;
  waitSub: string;
  shareTitle: string;
  shareLabel: string;
  shareNamePlaceholder: string;
  shareSave: string;
  shareSaved: string;
  remindTitle: string;
  remindDescription: string;
  remindButton: string;
  remindDone: string;
  remindFallback: string;
}

export const leafSavedStrings: Record<LanguageCode, LeafSavedStrings> = {
  en: {
    thankYouTitle: "Your leaf is on the tree",
    thankYouSub: "Private — only you know what you wrote",
    lookUpTitle: "↑ Look up now",
    lookUpSub: "Your leaf is live on the projector — spot it on the tree",
    waitTitle: "Saved",
    waitSub: "Look up when the speaker says so — your leaf will be on the tree",
    shareTitle: "Go public (optional)",
    shareLabel: "Show my leaf on the shared tree",
    shareNamePlaceholder: "Name (optional)",
    shareSave: "Save",
    shareSaved: "Saved",
    remindTitle: "Yearly check-in",
    remindDescription: "One reminder per year to revisit your purpose.",
    remindButton: "Remind me yearly",
    remindDone: "You're set",
    remindFallback: "Bookmark this page",
  },
  fr: {
    thankYouTitle: "Votre feuille est sur l'arbre",
    thankYouSub: "Privé — vous seul savez ce que vous avez écrit",
    lookUpTitle: "↑ Levez les yeux",
    lookUpSub: "Votre feuille est sur le projecteur — repérez-la sur l'arbre",
    waitTitle: "Enregistré",
    waitSub: "Regardez quand l'orateur le dira — votre feuille sera sur l'arbre",
    shareTitle: "Rendre public (optionnel)",
    shareLabel: "Afficher ma feuille sur l'arbre partagé",
    shareNamePlaceholder: "Nom (optionnel)",
    shareSave: "Enregistrer",
    shareSaved: "Enregistré",
    remindTitle: "Bilan annuel",
    remindDescription: "Un rappel par an pour revisiter votre but.",
    remindButton: "Me rappeler chaque année",
    remindDone: "C'est noté",
    remindFallback: "Ajoutez cette page à vos favoris",
  },
  ar: {
    thankYouTitle: "wra9tak f shajara",
    thankYouSub: "sir — ghir nta kat3ref chno ktebti",
    lookUpTitle: "↑ rfa3 rassk daba",
    lookUpSub: "wra9tak banat f lprojecteur — l9aha f shajara",
    waitTitle: "t7fedat",
    waitSub: "chouf lfo9 mlli ygoul lmo7arrir — wra9tak ghadi tban",
    shareTitle: "public (ikhtiyari)",
    shareLabel: "wri wra9ti f shajara",
    shareNamePlaceholder: "smiya (ikhtiyari)",
    shareSave: "7fed",
    shareSaved: "ttsajel",
    remindTitle: "tadkir sanawi",
    remindDescription: "tadkir wa7ed f l3am bach trja3 l hadaf dyalek.",
    remindButton: "fkerni kol 3am",
    remindDone: "mzyan",
    remindFallback: "7fed had lpage",
  },
};
