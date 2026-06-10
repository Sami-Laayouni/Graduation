import type { LanguageCode } from "./types";

export interface LeafSavedStrings {
  thankYouTitle: string;
  thankYouSub: string;
  privacyNote: string;
  shareTitle: string;
  shareDescription: string;
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
    thankYouSub:
      "This leaf stays here for 15+ years. You can change your answer anytime and your leaf's shape and color on the tree will update too.",
    privacyNote: "Only you can see what you wrote.",
    shareTitle: "Share on the tree (optional)",
    shareDescription:
      "Add your name and it will show behind your leaf on the tree for everyone to see.",
    shareLabel: "Show my leaf publicly",
    shareNamePlaceholder: "Your name (optional)",
    shareSave: "Save",
    shareSaved: "Saved",
    remindTitle: "Yearly check-in",
    remindDescription: "Get one reminder per year to revisit your purpose.",
    remindButton: "Remind me yearly",
    remindDone: "You are all set",
    remindFallback: "Bookmark this page to come back later",
  },
  fr: {
    thankYouTitle: "Votre feuille est sur l'arbre",
    thankYouSub:
      "Cette feuille reste ici plus de 15 ans. Vous pouvez modifier votre réponse à tout moment et la forme et la couleur de votre feuille sur l'arbre changeront aussi.",
    privacyNote: "Vous seul voyez ce que vous avez écrit.",
    shareTitle: "Partager sur l'arbre (optionnel)",
    shareDescription:
      "Ajoutez votre nom et il apparaîtra derrière votre feuille sur l'arbre, visible par tous.",
    shareLabel: "Afficher ma feuille publiquement",
    shareNamePlaceholder: "Votre nom (optionnel)",
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
    thankYouSub:
      "had l wra9a ghadi tb9a hna 15+ snin. t9der tbddl jawab dyalek f ay wa9t w shkl w lon dyal wra9tek f shajara ghadi ytbeddel.",
    privacyNote: "ghir nta kat3ref chno ktebti.",
    shareTitle: "partager (ikhtiyari)",
    shareDescription:
      "zid smiytek w ghadi tban wara wra9tek f shajara, kolchi ghadi ychoufha.",
    shareLabel: "wri wra9ti l public",
    shareNamePlaceholder: "smiya (ikhtiyari)",
    shareSave: "7fed",
    shareSaved: "t7fedat",
    remindTitle: "tadkir sanawi",
    remindDescription: "tadkir wa7ed f l3am bach trja3 l purpose dyalek.",
    remindButton: "fkerni kol 3am",
    remindDone: "mzyan",
    remindFallback: "7fed had lpage",
  },
};
