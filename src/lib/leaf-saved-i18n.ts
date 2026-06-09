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
    thankYouTitle: "This is your leaf",
    thankYouSub: "It's on the tree — look for it on the big screen",
    privateNote: "Your response is private. Nobody else can see what you wrote.",
    savedBadge: "On the tree",
    lookUpTitle: "Look up now",
    lookUpSub: "Your leaf is live on the big screen — can you spot it?",
    waitTitle: "Find your leaf on the screen",
    waitSub: "Look up at the projector. Each leaf on the tree belongs to someone in this room.",
    journeyTitle: "Your leaf on the tree",
    journeyBullet1: "Your answer is saved and lives on this tree.",
    journeyBullet2: "When your purpose changes, update your answer. Your leaf changes with you.",
    journeyBullet3: "One day we can look back at every path everyone took.",
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
    thankYouTitle: "C'est votre feuille",
    thankYouSub: "Elle est sur l'arbre — cherchez-la sur le grand écran",
    privateNote: "Votre réponse est privée. Personne d'autre ne peut voir ce que vous avez écrit.",
    savedBadge: "Sur l'arbre",
    lookUpTitle: "Levez les yeux",
    lookUpSub: "Votre feuille est sur le grand écran — pouvez-vous la repérer ?",
    waitTitle: "Trouvez votre feuille sur l'écran",
    waitSub: "Regardez le projecteur. Chaque feuille sur l'arbre appartient à quelqu'un dans cette salle.",
    journeyTitle: "Votre feuille sur l'arbre",
    journeyBullet1: "Votre réponse est sauvegardée et vit sur cet arbre.",
    journeyBullet2: "Quand votre but évolue, mettez à jour votre réponse. Votre feuille change avec vous.",
    journeyBullet3: "Un jour, nous pourrons revoir tous les chemins que chacun a empruntés.",
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
    thankYouTitle: "hadi wra9tak",
    thankYouSub: "hiya f shajara — dawwz 3liha f l'écran lkbir",
    privateNote: "jawab dyalek sir. 7ta wa7ed ma y9der ychouf chno ktebti.",
    savedBadge: "f shajara",
    lookUpTitle: "rfa3 rassk daba",
    lookUpSub: "wra9tak banat f l'écran lkbir — t9der tchoufha?",
    waitTitle: "l9a wra9tak f l'écran",
    waitSub: "chouf l'projecteur. kol wra9a f shajara khassa b wa7ed mn had lqa3a.",
    journeyTitle: "wra9tak f shajara",
    journeyBullet1: "jawab dyalek mt7fed w ghadi yba9a f had shajara.",
    journeyBullet2: "ila tbddel lhadaf dyalek, t9der tbddel ljawab. wra9a katbddl m3ak.",
    journeyBullet3: "yom mn lyam, n9dro nrj3ou nchofo kol tariq li salkha lwahed.",
    journeyTagline: "5 dqayeq f l3am: wash mazal kan3ichu b niya?",
    shareTitle: "sharik f shajara (ikhtiyari)",
    shareLabel: "wri wra9ti lnnas f shajara mchtaraka",
    shareNamePlaceholder: "smiya (ikhtiyari)",
    shareSave: "7fed",
    shareSaved: "ttsajel",
    remindTitle: "tadkir sanawi",
    remindDescription:
      "ila wafa9ti, ghadi nsiftou lik lhadaf dyalek kol 3am. t9der tchouf wash mazal katkhddem 3lih. ila la, t9der tbddlou w ghadi yban hna b wra9a jdida.",
    remindButton: "fkerni kol 3am",
    remindDone: "ghadi nfakkrouk kol 3am",
    remindFallback: "7fed had lpage bash trj3 kol 3am",
  },
};
