import type { LanguageCode } from "./types";

export interface LeafSavedStrings {
  savedTitle: string;
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
  updateTitle: string;
  updatePlaceholder: string;
  updateButton: string;
  updating: string;
  updateDone: string;
  remindTitle: string;
  remindButton: string;
  remindDone: string;
  remindFallback: string;
}

export const leafSavedStrings: Record<LanguageCode, LeafSavedStrings> = {
  en: {
    savedTitle: "Your leaf is saved",
    savedBadge: "On the tree",
    lookUpTitle: "Look up now",
    lookUpSub: "Your leaf is on the big screen",
    waitTitle: "Look up when ready",
    waitSub: "When the speaker asks, look at the screen — your leaf will appear on the tree",
    journeyTitle: "15 years & beyond",
    journeyBullet1: "Your answer stays on this tree for 15 years and beyond.",
    journeyBullet2: "When your purpose changes, update your answer — your leaf changes with you.",
    journeyBullet3: "In 15 years, we can look back at every path people took.",
    journeyTagline: "Five minutes a year: am I still living with intention?",
    shareTitle: "Share on the tree (optional)",
    shareLabel: "Show my leaf publicly on the shared tree",
    shareNamePlaceholder: "Your name (optional)",
    shareSave: "Save",
    shareSaved: "Saved",
    updateTitle: "Update your leaf",
    updatePlaceholder: "Your main argument of life, as it evolves…",
    updateButton: "Update my leaf",
    updating: "Updating…",
    updateDone: "Leaf updated on the tree",
    remindTitle: "Yearly check-in",
    remindButton: "Remind me every year",
    remindDone: "We'll remind you once a year",
    remindFallback: "Bookmark this page to revisit each year",
  },
  fr: {
    savedTitle: "Votre feuille est enregistrée",
    savedBadge: "Sur l'arbre",
    lookUpTitle: "Levez les yeux",
    lookUpSub: "Votre feuille est sur le grand écran",
    waitTitle: "Levez les yeux quand c'est le moment",
    waitSub: "Quand l'orateur le demande, regardez l'écran — votre feuille apparaîtra sur l'arbre",
    journeyTitle: "15 ans et au-delà",
    journeyBullet1: "Votre réponse reste sur cet arbre pendant 15 ans et plus.",
    journeyBullet2: "Quand votre but évolue, mettez à jour votre réponse — votre feuille change avec vous.",
    journeyBullet3: "Dans 15 ans, nous pourrons revoir tous les chemins empruntés.",
    journeyTagline: "Cinq minutes par an : vis-je encore avec intention ?",
    shareTitle: "Partager sur l'arbre (optionnel)",
    shareLabel: "Afficher ma feuille publiquement sur l'arbre partagé",
    shareNamePlaceholder: "Votre nom (optionnel)",
    shareSave: "Enregistrer",
    shareSaved: "Enregistré",
    updateTitle: "Mettre à jour votre feuille",
    updatePlaceholder: "L'argument principal de votre vie, au fil du temps…",
    updateButton: "Mettre à jour ma feuille",
    updating: "Mise à jour…",
    updateDone: "Feuille mise à jour sur l'arbre",
    remindTitle: "Bilan annuel",
    remindButton: "Me rappeler chaque année",
    remindDone: "Nous vous rappellerons une fois par an",
    remindFallback: "Ajoutez cette page à vos favoris pour revenir chaque année",
  },
  ar: {
    savedTitle: "ورقتك تسجلات",
    savedBadge: "فالشجرة",
    lookUpTitle: "رفع راسك دابا",
    lookUpSub: "ورقتك فالشاشة الكبيرة",
    waitTitle: "رفع راسك فالوقت المناسب",
    waitSub: "ملi الSpeaker يقول، شوف الشاشة — ورقتك غادي تبان فالشجرة",
    journeyTitle: "15 عام و أكثر",
    journeyBullet1: "الجواب ديالك غadi يبقى فhad الشجرة 15 عام و أكثر.",
    journeyBullet2: "ملi الهدف ديالك يتبدل، بدّل الجواب — الورقة كتتبدل معاك.",
    journeyBullet3: "فـ 15 عام، نقدرو نرجعو و نشوفو كل المسارات.",
    journeyTagline: "خمس دقائق فالعام: واش باقي كنعيش بالنية؟",
    shareTitle: "شارك فالشجرة (اختياري)",
    shareLabel: "ورّي ورقتي للناس فالشجرة المشتركة",
    shareNamePlaceholder: "السمية (اختياري)",
    shareSave: "حفظ",
    shareSaved: "تسجل",
    updateTitle: "حدّث ورقتك",
    updatePlaceholder: "الحجة الرئيسية ديال حياتك، كيفما كتتبدل…",
    updateButton: "حدّث ورقتي",
    updating: "كيتحدّث…",
    updateDone: "الورقة تحدّات فالشجرة",
    remindTitle: "تذكير سنوي",
    remindButton: "فكّرني كل عام",
    remindDone: "غadi نفكّروك مرة فالعام",
    remindFallback: "حفظ هاد الصفحة باش ترجع كل عام",
  },
};
