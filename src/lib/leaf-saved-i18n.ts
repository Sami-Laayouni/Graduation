import type { LanguageCode } from "./types";

export interface LeafSavedStrings {
  thankYouTitle: string;
  thankYouSub: string;
  privateNote: string;
  savedBadge: string;
  lookUpTitle: string;
  lookUpSub: string;
  waitTitle: string;
  waitSub: string;
  journeyTitle: string;
  journeyBullet1: string;
  journeyBullet2: string;
  journeyBullet3: string;
  journeyTagline: string;
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
    thankYouTitle: "Thank you for answering",
    thankYouSub: "Please look up at the screen",
    privateNote: "Nobody can see your response. Your answer lives on this tree for 15 years.",
    savedBadge: "On the tree",
    lookUpTitle: "Look up now",
    lookUpSub: "Your leaf is on the big screen",
    waitTitle: "Please look up",
    waitSub: "When the speaker asks, look at the screen. Your leaf will appear on the tree.",
    journeyTitle: "15 years and beyond",
    journeyBullet1: "Your answer stays on this tree for 15 years and beyond.",
    journeyBullet2: "When your purpose changes, update your answer. Your leaf changes with you.",
    journeyBullet3: "In 15 years, we can look back at every path people took.",
    journeyTagline: "Five minutes a year: am I still living with intention?",
    shareTitle: "Share on the tree (optional)",
    shareLabel: "Show my leaf publicly on the shared tree",
    shareNamePlaceholder: "Your name (optional)",
    shareSave: "Save",
    shareSaved: "Saved",
    remindTitle: "Yearly check-in",
    remindDescription:
      "If you agree, we will send you your main goal and purpose once a year. You can see whether you are still working towards it. If not, you can update it and it will show up here as a changed leaf.",
    remindButton: "Remind me every year",
    remindDone: "We will remind you once a year",
    remindFallback: "Bookmark this page to revisit each year",
  },
  fr: {
    thankYouTitle: "Merci pour votre réponse",
    thankYouSub: "Levez les yeux vers l'écran",
    privateNote: "Personne ne peut voir votre réponse. Votre réponse vit sur cet arbre pendant 15 ans.",
    savedBadge: "Sur l'arbre",
    lookUpTitle: "Levez les yeux",
    lookUpSub: "Votre feuille est sur le grand écran",
    waitTitle: "Levez les yeux",
    waitSub: "Quand l'orateur le demande, regardez l'écran. Votre feuille apparaîtra sur l'arbre.",
    journeyTitle: "15 ans et au-delà",
    journeyBullet1: "Votre réponse reste sur cet arbre pendant 15 ans et plus.",
    journeyBullet2: "Quand votre but évolue, mettez à jour votre réponse. Votre feuille change avec vous.",
    journeyBullet3: "Dans 15 ans, nous pourrons revoir tous les chemins empruntés.",
    journeyTagline: "Cinq minutes par an : vis-je encore avec intention ?",
    shareTitle: "Partager sur l'arbre (optionnel)",
    shareLabel: "Afficher ma feuille publiquement sur l'arbre partagé",
    shareNamePlaceholder: "Votre nom (optionnel)",
    shareSave: "Enregistrer",
    shareSaved: "Enregistré",
    remindTitle: "Bilan annuel",
    remindDescription:
      "Si vous acceptez, nous vous enverrons votre objectif principal une fois par an. Vous pourrez voir si vous travaillez toujours à le réaliser. Sinon, vous pourrez le mettre à jour et il apparaîtra ici comme une feuille modifiée.",
    remindButton: "Me rappeler chaque année",
    remindDone: "Nous vous rappellerons une fois par an",
    remindFallback: "Ajoutez cette page à vos favoris pour revenir chaque année",
  },
  ar: {
    thankYouTitle: "shukran 3la ljawab dyalek",
    thankYouSub: "rfa3 rassk w chouf l'écran",
    privateNote: "7ta wa7ed ma y9der ychouf jawab dyalek. wra9tk ghadi tba9a f had lshajara 15 3am w aktar",
    savedBadge: "f shajara",
    lookUpTitle: "rfa3 rassk daba",
    lookUpSub: "wra9tk banat f l'écran lkbir",
    waitTitle: "rfa3 rassk",
    waitSub: "mli lspeaker ygol, chouf l'écran. wra9tk ghadi tban f shajara",
    journeyTitle: "15 3am w aktar",
    journeyBullet1: "jawab dyalek ghadi yba9a f had shajara 15 3am w aktar",
    journeyBullet2: "ila tbddel lhadaf dyalek, t9der tbddel ljawab. wra9a katbddl m3ak",
    journeyBullet3: "f 15 3am, n9dro nrj3ou nchofo kol tariq",
    journeyTagline: "5 dqayeq f l3omr: wash mazal kan3ichu b niya?",
    shareTitle: "sharik f shajara (ikhtiyari)",
    shareLabel: "wri wra9ti lnnas f shajara mchtaraka",
    shareNamePlaceholder: "smiya (ikhtiyari)",
    shareSave: "7fed",
    shareSaved: "ttsajel",
    remindTitle: "tadkir sanawi",
    remindDescription:
      "ila wafa9ti, ghadi nsiftou lik lhadaf dyalek kol 3am. t9der tchouf wash mazal katkhddem 3lih. ila la, t9der tbddlou w ghadi yban hna b wra9a jdida",
    remindButton: "fkerni kol 3am",
    remindDone: "ghadi nfakkrouk kol 3am",
    remindFallback: "7fed had lpage bash trj3 kol 3am",
  },
};
