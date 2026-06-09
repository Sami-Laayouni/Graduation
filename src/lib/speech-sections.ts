import type { SpeechSection } from "./types";

type S = Omit<SpeechSection, "translations"> & {
  captionEn: string;
  captionFr?: string;
  captionAr?: string;
  projectorCue?: string;
};

function block(p: S): SpeechSection {
  const { captionEn, captionFr, captionAr, projectorCue, ...rest } = p;
  return {
    ...rest,
    translations: {
      en: { captionText: captionEn, projectorCue },
      fr: { captionText: captionFr ?? captionEn, projectorCue },
      ar: { captionText: captionAr ?? captionEn, projectorCue },
    },
  };
}

/** Exact graduation speech — one beat per section; captions match speaker script */
export const speechSections: SpeechSection[] = [
  block({
    id: "qr_intro",
    title: "1. Scan QR (pre-speech)",
    speakerText:
      "(Audience scans QR on screen before you begin speaking.)",
    projectorState: "qr_intro",
    season: "winter",
    audienceState: "captions_visible",
    ceremonyState: "boot",
    estimatedDurationSec: 25,
    captionEn: "You're in. Follow the graduation speech live on your phone.",
    captionFr: "Vous êtes connectés. Suivez le discours de remise des diplômes ici, sur votre téléphone.",
    captionAr: "nti m3ana daba. tabi3 khitab t-takhrej mubashara mn téléphone dyalek.",
  }),
  block({
    id: "welcome_1",
    title: "2. Hello",
    speakerText:
      "Hello everybody!\nI would like to welcome all of you here today, parents, friends, family, teachers, that random cat that decided to walk in, and, of course, the Class of 2026 (claps).",
    projectorState: "cosmos",
    season: "winter",
    audienceState: "captions_visible",
    ceremonyState: "intro",
    estimatedDurationSec: 20,
    captionEn:
      "Hello everybody!\nI would like to welcome all of you here today, parents, friends, family, teachers, that random cat that decided to walk in, and, of course, the Class of 2026 (claps).",
    captionFr:
      "Bonjour à toutes et à tous !\nJe voudrais vous souhaiter la bienvenue ici aujourd'hui : parents, amis, famille, enseignants, ce chat aléatoire qui a décidé d'entrer, et bien sûr, la promotion 2026 (applaudissements).",
    captionAr:
      "Salam 3likom kamlin!\nBghit nرحب bikom lyoum hna: lwalidin, s7ab, 3a2ila, الأساتذة, dik lqitta li d5lat ghalta, w b tabi3a, دفعة 2026 (tapliss).",
  }),
  block({
    id: "welcome_2",
    title: "3. Milestone",
    speakerText:
      "I am very excited to be here with all of you to celebrate this important milestone in our lives.",
    projectorState: "cosmos",
    season: "winter",
    audienceState: "captions_visible",
    ceremonyState: "intro",
    estimatedDurationSec: 12,
    captionEn:
      "I am very excited to be here with all of you to celebrate this important milestone in our lives.",
    captionFr:
      "Je suis très heureux d'être ici avec vous tous pour célébrer cette étape importante de nos vies.",
    captionAr:
      "Ana فرحان بزاف nكون m3akom lyoum باش nhtaflo b had lmohim f 7yatna.",
  }),
  block({
    id: "three_minutes",
    title: "4. 5 minutes",
    speakerText:
      "Now, since I am only allowed to speak for 5 minutes, if your friend has just left to use the restroom, they just missed the entire speech.",
    projectorState: "cosmos",
    season: "winter",
    audienceState: "captions_visible",
    ceremonyState: "intro",
    estimatedDurationSec: 12,
    captionEn:
      "Now, since I am only allowed to speak for 5 minutes, if your friend has just left to use the restroom, they just missed the entire speech.",
    captionFr:
      "Maintenant, comme je n'ai droit qu'à 5 minutes de parole, si votre ami vient juste de partir aux toilettes, il vient de rater tout le discours.",
    captionAr:
      "Daba 7it 3andi ghir 5 dqayeq nhdar, ila s7abk tla3 ltoilet daba, rah fatou kol lkhotba.",
  }),
  block({
    id: "thanks_1",
    title: "5. Thank yous",
    speakerText:
      "Before I begin, as is common tradition, I would like to thank everyone who made this journey possible. Now, of course, I won't bore you with the names of all these people.",
    projectorState: "cosmos",
    season: "winter",
    audienceState: "captions_visible",
    ceremonyState: "intro",
    estimatedDurationSec: 16,
    captionEn:
      "Before I begin, as is common tradition, I would like to thank everyone who made this journey possible. Now, of course, I won't bore you with the names of all these people.",
    captionFr:
      "Avant de commencer, comme le veut la tradition, je voudrais remercier toutes les personnes qui ont rendu ce parcours possible. Bien sûr, je ne vais pas vous ennuyer avec les noms de tout le monde.",
    captionAr:
      "Qbel ma nbda, 3la 3adatna, bghit nshkor kol wa7d sahm f had tariq. Tab3an ma ghadi n9der nshkor smiyat kolshi.",
  }),
  block({
    id: "thanks_2",
    title: "6. Real thanks",
    speakerText:
      "And I also don't think that simply mentioning their names in a speech is enough to show the level of appreciation these people deserve.\nSo I encourage us all to really take the time to show our appreciation for our supporters, friends, family, emotional support animals, and so on by spending time with them.",
    projectorState: "cosmos",
    season: "winter",
    audienceState: "captions_visible",
    ceremonyState: "intro",
    estimatedDurationSec: 20,
    captionEn:
      "And I also don't think that simply mentioning their names in a speech is enough to show the level of appreciation these people deserve.\nSo I encourage us all to really take the time to show our appreciation for our supporters, friends, family, emotional support animals, and so on by spending time with them.",
    captionFr:
      "Et je ne pense pas non plus que le simple fait de citer des noms dans un discours suffise à montrer le niveau de reconnaissance que ces personnes méritent.\nJe nous encourage donc tous à vraiment prendre le temps de montrer notre gratitude envers nos soutiens, nos amis, notre famille, nos animaux de soutien émotionnel, etc., en passant du temps avec eux.",
    captionAr:
      "W ma n9drch n9ol ghir smiyat f khotba w nsali, hit hadchi ma kaykafich bash n3tiw lqima li yastahloha had nass.\nBghit nkouno kamlin n3tiw wa9t lli 7adna: l3a2ila, s7ab, li kaychdo fina, w hatta l7ayawanat dyal lsupport l3atfi.",
  }),
  block({
    id: "bilal",
    title: "7. Bilal & Simo",
    speakerText:
      "However, I would like to make an exception to shout out my friends Bilal and Simo. You guys each owe me 50 DH now.",
    projectorState: "cosmos",
    season: "spring",
    audienceState: "captions_visible",
    ceremonyState: "storytelling",
    estimatedDurationSec: 10,
    captionEn:
      "However, I would like to make an exception to shout out my friends Bilal and Simo. You guys each owe me 50 DH now.",
    captionFr:
      "Cependant, je voudrais faire une exception pour remercier mes amis Bilal et Simo. Vous me devez chacun 50 DH maintenant.",
    captionAr:
      "Walakin bghit ndir exception nshkor s7abi Bilal w Simo. 3ndkom 50 dh kol wa7d.",
  }),
  block({
    id: "classmates",
    title: "7b. Classmates",
    speakerText:
      "But I would like to take the time to thank everyone here for being a part of this journey.",
    projectorState: "classmates_roll",
    season: "spring",
    audienceState: "captions_visible",
    ceremonyState: "storytelling",
    estimatedDurationSec: 40,
    captionEn:
      "But I would like to take the time to thank everyone here for being a part of this journey.",
    captionFr:
      "Mais je voudrais quand même prendre le temps de remercier tout le monde ici pour avoir fait partie de ce parcours.",
    captionAr:
      "W bghit n9ol shukran lkol wa7d hna 3la had ljourney.",
  }),
  block({
    id: "wizards_1",
    title: "8. Transition",
    speakerText:
      "This moment represents a very special transitional period for us.",
    projectorState: "cosmos",
    season: "spring",
    audienceState: "captions_visible",
    ceremonyState: "storytelling",
    estimatedDurationSec: 8,
    captionEn:
      "This moment represents a very special transitional period for us.",
    captionFr:
      "Ce moment représente une période de transition très particulière pour nous.",
    captionAr:
      "Had lmoment kaymthel wa7d mar7la transition mhomma f 7yatna.",
  }),
  block({
    id: "wizards_2",
    title: "9. Wizard robes",
    speakerText:
      "At one point, we probably all wished to dress up like wizards outside of Halloween. Also, in true wizarding fashion, our robes were rumored to turn invisible and disappear before we could put them on.",
    projectorState: "cosmos",
    season: "spring",
    audienceState: "captions_visible",
    ceremonyState: "storytelling",
    estimatedDurationSec: 16,
    captionEn:
      "At one point, we probably all wished to dress up like wizards outside of Halloween. Also, in true wizarding fashion, our robes were rumored to turn invisible and disappear before we could put them on.",
    captionFr:
      "À un moment, nous avons probablement tous voulu nous déguiser en sorciers en dehors d'Halloween. Et, fidèle à l'esprit du monde des sorciers, nos robes étaient soi-disant devenues invisibles et avaient disparu avant même qu'on puisse les enfiler.",
    captionAr:
      "F wa7d lwa9t kna kamlin bghina ntlbaso wizardat barra mn Halloween. W b nafs style dyal Harry Potter, kanto kay9olou robes ghadi ttwla invisible w tghebro qbel ma ntlbsohom.",
  }),
  block({
    id: "asi_intro",
    title: "10. ASI lessons",
    speakerText:
      "We have learned many valuable lessons during our time at ASI, which are unique only to an ASI education. These will prepare us as we move on to our next adventures and try to find meaning and purpose in our lives, before ChatGPT takes it all away from us.",
    projectorState: "leaf_fragment",
    season: "spring",
    audienceState: "captions_visible",
    ceremonyState: "storytelling",
    estimatedDurationSec: 18,
    captionEn:
      "We have learned many valuable lessons during our time at ASI, which are unique only to an ASI education. These will prepare us as we move on to our next adventures and try to find meaning and purpose in our lives, before ChatGPT takes it all away from us.",
    captionFr:
      "Nous avons appris beaucoup de leçons importantes durant notre passage à l'ASI, des leçons uniques à une éducation à l'ASI. Elles nous préparent à nos prochaines aventures et à chercher un sens et un but dans nos vies, avant que ChatGPT ne nous enlève tout cela.",
    captionAr:
      "T3llamna bzzaf dyal llessons f ASI, w hadchi khas ASI b zaf. Ghadi y3awno fina f lmostaqbal w f b7th 3la meaning w purpose f 7yatna, qbel ChatGPT ykhdha kamla.",
  }),
  block({
    id: "ameur_1",
    title: "11. Never give up",
    speakerText: 'We learned to "never ever" give up in life.',
    projectorState: "leaf_fragment",
    season: "spring",
    audienceState: "captions_visible",
    ceremonyState: "storytelling",
    estimatedDurationSec: 8,
    captionEn: 'We learned to "never ever" give up in life.',
    captionFr: 'Nous avons appris à "ne jamais jamais" abandonner dans la vie.',
    captionAr: 'T3llamna "never ever" ns7abou l2amal.',
  }),
  block({
    id: "ameur_2",
    title: "12. Math & physics",
    speakerText:
      "And that everything except math and physics in life is useless, from Dr. Ameur. He is probably disgusted right now as he sees us move towards disciplines like biology and medicine.",
    projectorState: "leaf_fragment",
    season: "spring",
    audienceState: "captions_visible",
    ceremonyState: "storytelling",
    estimatedDurationSec: 16,
    captionEn:
      "And that everything except math and physics in life is useless, from Dr. Ameur. He is probably disgusted right now as he sees us move towards disciplines like biology and medicine.",
    captionFr:
      "Et que tout sauf les mathématiques et la physique dans la vie est inutile, selon le Dr Ameur. Il est probablement dégoûté en nous voyant nous diriger vers des disciplines comme la biologie et la médecine.",
    captionAr:
      "W 2anna ghir math w physics howa li mohim f l7ayat, 3la 9awl Dr Ameur. W hwa tawa9a3 kayt3seb dba kifa shufna nmshiw lbiology w medicine.",
  }),
  block({
    id: "ameur_3",
    title: "13. Always harder",
    speakerText:
      "Another lesson we learned from Dr. Ameur is that when life gets really hard, it can always get harder. If you just finished an AP Calc exam, life might give you an exam that is three times harder than the AP exam on the last day of school.",
    projectorState: "leaf_fragment",
    season: "summer",
    audienceState: "captions_visible",
    ceremonyState: "storytelling",
    estimatedDurationSec: 18,
    captionEn:
      "Another lesson we learned from Dr. Ameur is that when life gets really hard, it can always get harder. If you just finished an AP Calc exam, life might give you an exam that is three times harder than the AP exam on the last day of school.",
    captionFr:
      "Une autre leçon que nous avons apprise du Dr Ameur est que lorsque la vie devient vraiment difficile, elle peut toujours devenir encore plus difficile. Si vous venez de terminer un examen d'AP Calc, la vie peut vous en donner un trois fois plus difficile le dernier jour d'école.",
    captionAr:
      "Lesson okhra mn Dr Ameur hiya ila l7ayat s3ba, t9der twlli s3ba aktar. Ila saliti AP Calc exam, t9der tl9a exam 3la 3 f marat as3ab f nhar lakhir.",
  }),
  block({
    id: "zineb",
    title: "14. Dr. Zineb",
    speakerText:
      "From Dr Zineb, we were equipped with the ability to survive and stay focused in some of the most difficult environments.\n\nThe science experiments in her class seemed to produce a different smell every day for three years straight. Therefore, I am very certain that no matter where we end up, we can definitely stay concentrated, even if someone decides to make elephant toothpaste in the corner.",
    projectorState: "leaf_fragment",
    season: "summer",
    audienceState: "captions_visible",
    ceremonyState: "storytelling",
    estimatedDurationSec: 22,
    captionEn:
      "From Dr Zineb, we were equipped with the ability to survive and stay focused in some of the most difficult environments.\n\nThe science experiments in her class seemed to produce a different smell every day for three years straight. Therefore, I am very certain that no matter where we end up, we can definitely stay concentrated, even if someone decides to make elephant toothpaste in the corner.",
    captionFr:
      "De la part du Dr Zineb, nous avons acquis la capacité de survivre et de rester concentrés dans certains des environnements les plus difficiles.\n\nLes expériences scientifiques dans sa classe semblaient produire une odeur différente chaque jour pendant trois ans d'affilée. Je suis donc certain que, peu importe où nous irons, nous saurons rester concentrés, même si quelqu'un décide de faire de l'\"elephant toothpaste\" dans un coin.",
    captionAr:
      "Mn Dr Zineb t3llamna kifash nb9aw n9dro n9awmo rassna f conditions s3bin.\n\nExperiments f class dyalha kano kaydiru ri7a jdida kol nhar mda 3am. Daba ana mti2en blli fin ma mchina ghadi n9dro nrkkzo hatta ila chi wa7d dar elephant toothpaste f jnabna.",
  }),
  block({
    id: "digital",
    title: "15. Platforms",
    speakerText:
      "It is also only through our journey at ASI that we managed to learn how to use Alma, Microsoft Teams, Google Classroom, Wayground, MAP, Rediker, Ingrade, Apex, Edunation, and of course NoteSwap (shameless shoutout). So that whatever we end up using in the future, we have the proper experience to do so.",
    projectorState: "leaf_fragment",
    season: "summer",
    audienceState: "captions_visible",
    ceremonyState: "storytelling",
    estimatedDurationSec: 18,
    captionEn:
      "It is also only through our journey at ASI that we managed to learn how to use Alma, Microsoft Teams, Google Classroom, Wayground, MAP, Rediker, Ingrade, Apex, Edunation, and of course NoteSwap (shameless shoutout). So that whatever we end up using in the future, we have the proper experience to do so.",
    captionFr:
      "C'est aussi uniquement grâce à notre parcours à l'ASI que nous avons appris à utiliser Alma, Microsoft Teams, Google Classroom, Wayground, MAP, Rediker, Ingrade, Apex, Edunation, et bien sûr NoteSwap (auto-promo assumée). Ainsi, quoi que nous utilisions dans le futur, nous aurons l'expérience nécessaire.",
    captionAr:
      "W ghir f ASI t3llamna nst3mlo Alma, Microsoft Teams, Google Classroom, Wayground, MAP, Rediker, Ingrade, Apex, Edunation, w b tabi3a NoteSwap (shoutout bla 7shma). Daba f ay chi ghadi nst3mlo f lmostaqbal, 3andna l5ibra dyal kol wa7d.",
  }),
  block({
    id: "friendships",
    title: "16. Friendships",
    speakerText:
      "On a more serious note, ASI's small number of students also made it possible to develop close and meaningful connections with your friends. And I hope that as we begin to face the mythical \"real world,\" that supposedly only our parents live in, we keep these friendships, especially in the difficult times when we need them the most.",
    projectorState: "leaf_fragment",
    season: "summer",
    audienceState: "captions_visible",
    ceremonyState: "storytelling",
    estimatedDurationSec: 20,
    captionEn:
      "On a more serious note, ASI's small number of students also made it possible to develop close and meaningful connections with your friends. And I hope that as we begin to face the mythical \"real world,\" that supposedly only our parents live in, we keep these friendships, especially in the difficult times when we need them the most.",
    captionFr:
      "Sur une note plus sérieuse, le petit nombre d'élèves à l'ASI nous a aussi permis de développer des liens proches et significatifs avec nos amis. Et j'espère qu'en entrant dans le mythique \"monde réel\", qui semble n'être habité que par nos parents, nous garderons ces amitiés, surtout dans les moments difficiles où nous en aurons le plus besoin.",
    captionAr:
      "3la note serious, 9illa dyal tlaba f ASI 3awnetna nbniw relationships 9riba w s7i7a m3a s7abna. W ntmenaw f \"real world\" li kaybano ghir walidina fih, n7afdo 3la had l3la9at, khusosan f lwa9tat s3ab.",
  }),
  block({
    id: "memories_1",
    title: "17. Memories",
    speakerText:
      "And it is sad to think that all those memories made within the confines of ASI, the Speech and Debate tournaments, the MUN, MASAC tournaments, and even the small times you hung out with your friends at the Mahata…\n\nAll the good, all the bad are now memories.\n\nWhile it is sad to think that these are all memories, there will always be something that is left over that will remind you of them.",
    projectorState: "leaf_fragment",
    season: "summer",
    audienceState: "captions_visible",
    ceremonyState: "storytelling",
    estimatedDurationSec: 22,
    captionEn:
      "And it is sad to think that all those memories made within the confines of ASI, the Speech and Debate tournaments, the MUN, MASAC tournaments, and even the small times you hung out with your friends at the Mahata…\n\nAll the good, all the bad are now memories.\n\nWhile it is sad to think that these are all memories, there will always be something that is left over that will remind you of them.",
    captionFr:
      "Et il est triste de penser que tous ces souvenirs créés au sein de l'ASI, les tournois de Speech and Debate, le MUN, les tournois MASAC, et même les petits moments passés avec vos amis au Mahata…\n\nTout le bon, tout le mauvais ne sont désormais que des souvenirs.\n\nMême s'il est triste de penser que tout cela n'est plus que des souvenirs, il restera toujours quelque chose qui nous les rappellera.",
    captionAr:
      "W 7zen n9olo blli kol dik memories dyal ASI, Speech and Debate, MUN, MASAC, w lwa9t sghir m3a s7ab f Mahata…\n\nKolshi wlla memories dba.\n\nB7al ila kolshi wlla memories, kaybqa wa7d l7aja ghadi tfdl tddkrna bihom:",
  }),
  block({
    id: "memories_2",
    title: "18. Who you became",
    speakerText:
      "And that is the person you became as a result of everything that happened.",
    projectorState: "leaf_reveal",
    season: "summer",
    audienceState: "captions_visible",
    ceremonyState: "storytelling",
    estimatedDurationSec: 10,
    captionEn:
      "And that is the person you became as a result of everything that happened.",
    captionFr:
      "Et c'est la personne que vous êtes devenue à cause de tout ce qui s'est passé.",
    captionAr:
      "W hiya chkon wllina b sabab kol dakchi.",
    projectorCue: "You appear",
  }),
  block({
    id: "search_1",
    title: "19. No perfect lesson",
    speakerText:
      "Now I figured this is probably the time when I give you all a very inspirational story, one last important life lesson from ASI, that will change the course of your lives. No pressure, right?\n\nHowever, when looking for a lesson or story good enough to surpass the test of time, I couldn't.\n\nAnd trust me, I looked.",
    projectorState: "leaf_reveal",
    season: "autumn",
    audienceState: "captions_visible",
    ceremonyState: "storytelling",
    estimatedDurationSec: 18,
    captionEn:
      "Now I figured this is probably the time when I give you all a very inspirational story, one last important life lesson from ASI, that will change the course of your lives. No pressure, right?\n\nHowever, when looking for a lesson or story good enough to surpass the test of time, I couldn't.\n\nAnd trust me, I looked.",
    captionFr:
      "Je pense que c'est probablement le moment où je devrais vous raconter une histoire inspirante, une dernière leçon de vie importante de l'ASI qui changera le cours de vos vies. Pas de pression, hein ?\n\nCependant, en cherchant une leçon ou une histoire assez forte pour résister à l'épreuve du temps, je n'ai pas réussi.\n\nEt croyez-moi, j'ai cherché.",
    captionAr:
      "Daba mra7ba, ghadi nkoun hna wa7d lmoment li n9dr n3tikom fih story inspiration wa7da akhira li tbdl 7yatkom. Bla pressure.\nWalakin mnin bdit kan9lb 3la lesson kbir yb9a ma l9it.\n\nW sda9ni, 7awlt.",
  }),
  block({
    id: "search_2",
    title: "20. Steve Jobs… LEGO",
    speakerText:
      "I watched many motivational speeches, from Steve Jobs' famous commencement address to SpongeBob SquarePants telling Squidward to live a little, and the Lego Movie's catchy song encouraging people that \"everything is awesome\".\n\nAnd to be honest, after two days, I think I forgot 50% of what each speech was about. So I realized I had only one choice: either come up with a very catchy song with a lesson you guys will actually remember",
    projectorState: "leaf_reveal",
    season: "autumn",
    audienceState: "captions_visible",
    ceremonyState: "storytelling",
    estimatedDurationSec: 22,
    captionEn:
      "I watched many motivational speeches, from Steve Jobs' famous commencement address to SpongeBob SquarePants telling Squidward to live a little, and the Lego Movie's catchy song encouraging people that \"everything is awesome\".\n\nAnd to be honest, after two days, I think I forgot 50% of what each speech was about. So I realized I had only one choice: either come up with a very catchy song with a lesson you guys will actually remember",
    captionFr:
      "J'ai regardé beaucoup de discours motivants, du célèbre discours de remise de diplôme de Steve Jobs à Bob l'éponge disant à Squidward de profiter un peu de la vie, et la chanson entraînante du Lego Movie disant que \"everything is awesome\".\n\nEt honnêtement, après deux jours, j'ai oublié 50 % de ce que chaque discours disait. Donc j'ai compris que je n'avais qu'un seul choix : soit inventer une chanson très accrocheuse que vous retiendrez vraiment",
    captionAr:
      "Shft speeches motiva, Steve Jobs, SpongeBob kay9ol Squidward y3ich chwiya, w Lego Movie \"everything is awesome\".\n\nW b sra7a, mlli dazat 2 nharat, nsit 50% mn kol wa7d. Fhamt ghir blli khasni nji b chi solution okhra.",
  }),
  block({
    id: "search_3",
    title: "21. No catchy song",
    speakerText:
      "Fortunately enough for you guys… I didn't end up doing this.\n\nSo I decided to explore something different for this speech. And to do so, I would like to build off of another lesson we learned at ASI for my motivational message.",
    projectorState: "leaf_reveal",
    season: "autumn",
    audienceState: "captions_visible",
    ceremonyState: "storytelling",
    estimatedDurationSec: 16,
    captionEn:
      "Fortunately enough for you guys… I didn't end up doing this.\n\nSo I decided to explore something different for this speech. And to do so, I would like to build off of another lesson we learned at ASI for my motivational message.",
    captionFr:
      "Heureusement pour vous… je ne l'ai pas fait.\n\nJ'ai donc décidé d'explorer autre chose pour ce discours. Et pour cela, je voudrais m'appuyer sur une autre leçon que nous avons apprise à l'ASI.",
    captionAr:
      "L7amdoulillah 3likom… ma drtch hadchi.\n\nFa 9rrت nst3ml lesson okhra mn ASI.",
  }),
  block({
    id: "main_1",
    title: "22. Main argument",
    speakerText:
      "I think by this point, we have all been trained into being able to identify the main argument in texts and documents, thanks to Mr. Mouad and Miss Shillingsburg.\nAnd to quote one of these teachers: \"Everything has a main argument. Now go back and find the main argument in Neo-Islamism vs. Post-Islamism.\"",
    projectorState: "leaf_reveal",
    season: "autumn",
    audienceState: "captions_visible",
    ceremonyState: "pivot_to_main_argument",
    estimatedDurationSec: 18,
    captionEn:
      "I think by this point, we have all been trained into being able to identify the main argument in texts and documents, thanks to Mr. Mouad and Miss Shillingsburg.\nAnd to quote one of these teachers: \"Everything has a main argument. Now go back and find the main argument in Neo-Islamism vs. Post-Islamism.\"",
    captionFr:
      "Je pense qu'à ce stade, nous avons tous été entraînés à identifier l'argument principal dans les textes et documents, grâce à M. Mouad et Mme Shillingsburg.\nEt pour citer l'un de ces professeurs : \"Tout a un argument principal. Maintenant retournez trouver l'argument principal dans Neo-Islamism vs. Post-Islamism.\"",
    captionAr:
      "F had lwa9t, t3llamna kamlin kifash n9lbou 3la main argument f textes, b help dyal Mr Mouad w Miss Shillingsburg.\nW 9al wa7d lprof: \"kolchi 3ndo main argument, rj3 t9lb 3lih f Neo-Islamism vs Post-Islamism.\"",
    projectorCue: "Everything has a main argument.",
  }),
  block({
    id: "main_2",
    title: "23. Your life's thesis",
    speakerText:
      "So now, applying what we learned in class, I would like to challenge everybody, including Mr. Mouad, to look for the main argument, or arguments, in their lives. What is the purpose that is driving your life?\n\nBecause when was the last time you truly thought about this? That one time your phone was off in the bathroom? I mean, that was when I wrote this speech, so no judging. But the point is that yes, you will probably reflect on this question during this important transitional period, but when do you see beyond those times?",
    projectorState: "leaf_reveal",
    season: "autumn",
    audienceState: "captions_visible",
    ceremonyState: "pivot_to_main_argument",
    estimatedDurationSec: 24,
    captionEn:
      "So now, applying what we learned in class, I would like to challenge everybody, including Mr. Mouad, to look for the main argument, or arguments, in their lives. What is the purpose that is driving your life?\n\nBecause when was the last time you truly thought about this? That one time your phone was off in the bathroom? I mean, that was when I wrote this speech, so no judging. But the point is that yes, you will probably reflect on this question during this important transitional period, but when do you see beyond those times?",
    captionFr:
      "Donc, en appliquant ce que nous avons appris en classe, je voudrais défier tout le monde, y compris M. Mouad, à chercher l'argument principal, ou les arguments, dans leur vie. Quel est le but qui dirige votre vie ?\n\nParce que quand est-ce que vous avez vraiment réfléchi à cela pour la dernière fois ? Ce moment où votre téléphone était éteint dans la salle de bain ? C'est là que j'ai écrit ce discours, donc pas de jugement. Mais le point est que oui, vous allez probablement réfléchir à cette question pendant cette période de transition, mais quand allez-vous aller au-delà de cela ?",
    captionAr:
      "Daba, bnafs logique, bghit n9olakom kamlin, hatta Mr Mouad, tl9aw main argument f 7yatokom. Chno howa purpose li kayhrek 7yatak?\n\nHit mta fach 9blt f 3omrk fkrti f hadchi? F wa9t li tlf ltelefon f toilet? Ana hna ktbt had speech.\nLpoint hiya blli ghadi t9lb 3la had question f transitions, walakin ch7al mn mra katkhdmo f life b7al hakda?",
    projectorCue: "What is the main argument of a life?",
  }),
  block({
    id: "science_1",
    title: "24. Purpose",
    speakerText:
      "The reason I want to stress this point is because it is the most fundamental question we can ask ourselves, and above all, we humans are really driven by our purpose.",
    projectorState: "leaf_reveal",
    season: "autumn",
    audienceState: "captions_visible",
    ceremonyState: "pivot_to_main_argument",
    estimatedDurationSec: 14,
    captionEn:
      "The reason I want to stress this point is because it is the most fundamental question we can ask ourselves, and above all, we humans are really driven by our purpose.",
    captionFr:
      "La raison pour laquelle je veux insister sur ce point est que c'est la question la plus fondamentale que nous puissions nous poser, et surtout, nous les humains sommes profondément guidés par notre but.",
    captionAr:
      "Had question mohim hit humans kayt7arko b purpose.",
  }),
  block({
    id: "science_2",
    title: "25. Citation",
    speakerText:
      'For example, a research paper compared two groups of 7,000 adults: one group consisted of individuals who had a deep sense of motivation and a very clear purpose in life, while the other group did not ("Alimujiang et al., 2019").\n\nIf people didn\'t get it: stupid in-text citation.\n\nThe research suggests that simply having a clear sense of purpose can result in significantly better health outcomes and lower mortality risk.',
    projectorState: "single_leaf",
    season: "autumn",
    audienceState: "captions_visible",
    ceremonyState: "pivot_to_main_argument",
    estimatedDurationSec: 22,
    captionEn:
      'For example, a research paper compared two groups of 7,000 adults: one group consisted of individuals who had a deep sense of motivation and a very clear purpose in life, while the other group did not ("Alimujiang et al., 2019").\n\nIf people didn\'t get it: stupid in-text citation.\n\nThe research suggests that simply having a clear sense of purpose can result in significantly better health outcomes and lower mortality risk.',
    captionFr:
      'Par exemple, une étude a comparé deux groupes de 7 000 adultes : un groupe composé d\'individus ayant un fort sens de la motivation et un but clair dans la vie, et un autre groupe n\'en ayant pas ("Alimujiang et al., 2019").\n\nPour ceux qui n\'ont pas compris : citation ridicule dans le texte.\n\nL\'étude suggère que le simple fait d\'avoir un but clair peut conduire à de meilleurs résultats de santé et à un risque de mortalité plus faible.',
    captionAr:
      'Matalan: research 9arat juj groupes dyal 7000 adult: wa7d 3ndo purpose w motivation w wa7d la ("Alimujiang et al., 2019").\nIla ma fhmtouch: in-text citation ghalat.\n\nResult: l7ayat dyal nass li 3andhom purpose katkon afdal w health outcomes a7san w mortality risk a9al.',
  }),
  block({
    id: "qr_reflection",
    title: "26. Scan QR now",
    speakerText:
      "Now, to continue my lesson, I will give you 20 seconds to scan the QR code above if you haven't already, read through what it says carefully, and try to answer honestly. When you submit your answer, look up at the screen and you should see a leaf be added to this tree.",
    projectorState: "qr_reflection",
    season: "spring",
    audienceState: "captions_visible",
    ceremonyState: "reflection_prompt",
    estimatedDurationSec: 25,
    captionEn:
      "Now, to continue my lesson, I will give you 20 seconds to scan the QR code above if you haven't already, read through what it says carefully, and try to answer honestly. When you submit your answer, look up at the screen and you should see a leaf be added to this tree.",
    captionFr:
      "Maintenant, pour continuer ma leçon, je vais vous donner 45 secondes pour scanner le QR code au-dessus si ce n'est pas déjà fait, lire attentivement ce qu'il dit et essayer de répondre honnêtement. Quand vous soumettez votre réponse, regardez l'écran et vous devriez voir une feuille apparaître sur cet arbre.",
    captionAr:
      "Daba ghadi n3tikom 45 seconde tscanew QR code, qraw chno fih mzyan w jawbou b sda9a. Mlli tsift jawab, ghadi tchouf wra7 shajara katkbar w ttzad wra9a.",
  }),
  block({
    id: "reflection_1",
    title: "27. Privacy joke",
    speakerText:
      "None of your answers can be viewed by anyone besides you.\n\nExcept if things get really bad for me later on, and I need to sell your data for some money.",
    projectorState: "leaf_placing",
    season: "spring",
    audienceState: "reflection_input",
    ceremonyState: "reflection_prompt",
    estimatedDurationSec: 14,
    captionEn:
      "None of your answers can be viewed by anyone besides you.\n\nExcept if things get really bad for me later on, and I need to sell your data for some money.",
    captionFr:
      "Aucune de vos réponses ne peut être vue par quelqu'un d'autre que vous.\n\nSauf si les choses tournent vraiment mal pour moi plus tard, et que je dois vendre vos données pour de l'argent.",
    captionAr:
      "Ma kayn 7ta wa7d ychouf ajwbatkom ghir ntoma.\n\nIlla ma nbi3ch data dyalkom ila t3a9dt l2omor.",
    projectorCue: "What is the main argument of your life?",
  }),
  block({
    id: "music_joke",
    title: "28. Inner thoughts",
    speakerText:
      "I am obviously way too awkward to just stand still for a few seconds, so here is some beautiful music to listen to:\n\nYou know what never mind.\n\nJust listen to your inner thoughts.\n\n20 seconds later… (Website changes to tell them to look up)",
    projectorState: "tree_growing",
    season: "spring",
    audienceState: "response_collection",
    ceremonyState: "response_collection",
    estimatedDurationSec: 20,
    captionEn:
      "I am obviously way too awkward to just stand still for a few seconds, so here is some beautiful music to listen to:\n\nYou know what never mind.\n\nJust listen to your inner thoughts.",
    captionFr:
      "Je suis évidemment beaucoup trop gêné pour rester immobile quelques secondes, alors voici une belle musique à écouter :\n\nOups, problèmes techniques\n\nÉcoutez simplement vos pensées intérieures.",
    captionAr:
      "Sma3o had musique…\n\nOops technical difficulties\n\nGhir sma3o l afkar dyalkom.",
  }),
  block({
    id: "look_up_1",
    title: "29. Look up",
    speakerText:
      "Now all of you probably had a different experience in these last few seconds. Obviously, I don't expect anybody here to be able to come up with the main argument or purpose of your life in that short amount of time.\n\nIf you were, I am concerned.\n\nSome of you might feel certain about your direction.\nSome of you might feel unsure.\nAnd honestly, both are completely normal.\n\nRight now, if you look up, you will see a leaf representing your answer.",
    projectorState: "tree_growing",
    season: "spring",
    audienceState: "look_up_nudge",
    ceremonyState: "return_to_speech",
    estimatedDurationSec: 22,
    captionEn:
      "Now all of you probably had a different experience in these last few seconds. Obviously, I don't expect anybody here to be able to come up with the main argument or purpose of your life in that short amount of time.\n\nIf you were, I am concerned.\n\nSome of you might feel certain about your direction.\nSome of you might feel unsure.\nAnd honestly, both are completely normal.\n\nRight now, if you look up, you will see a leaf representing your answer.",
    captionFr:
      "Maintenant, vous avez probablement tous vécu une expérience différente durant ces dernières secondes. Évidemment, je ne m'attends pas à ce que quelqu'un ici puisse trouver l'argument principal ou le but de sa vie en si peu de temps.\n\nSi c'était le cas, je serais inquiet.\n\nCertains d'entre vous peuvent se sentir certains de leur direction.\nCertains peuvent se sentir incertains.\nEt honnêtement, les deux sont complètement normaux.\n\nMaintenant, si vous regardez, vous verrez une feuille représentant votre réponse.",
    captionAr:
      "Daba kolla wa7d 3ash experience mkhtalfa. Ma kan3tbdch 7ta wa7d y9dr yjawb 3la purpose dyal 7yato f had lwa9t sghir.\n\nIla kant, kan9alaq 3lik.\n\nBa3dkom confident, ba3dkom mchatk.\nW juj normal.\n\nDaba ila tlfd, ghadi tchouf wra9a katmthel jawab dyalk.",
  }),
  block({
    id: "look_up_2",
    title: "30. Seasons",
    speakerText:
      "And just like the seasons, those leaves change. As time goes on, you will change, and your main argument, the purpose that drives you, may change as well. And when it does, you can update that on the website and it will change here.\n\nSo my point is not that you need to find one purpose and hold onto it forever. My point is to live through those changes consciously, so that you are the one choosing your direction, rather than simply drifting wherever life happens to take you.",
    projectorState: "seasons_cycle",
    season: "summer",
    audienceState: "look_up_nudge",
    ceremonyState: "return_to_speech",
    estimatedDurationSec: 22,
    captionEn:
      "And just like the seasons, those leaves change. As time goes on, you will change, and your main argument, the purpose that drives you, may change as well. And when it does, you can update that on the website and it will change here.\n\nSo my point is not that you need to find one purpose and hold onto it forever. My point is to live through those changes consciously, so that you are the one choosing your direction, rather than simply drifting wherever life happens to take you.",
    captionFr:
      "Et comme les saisons, ces feuilles changent. Avec le temps, vous changerez, et votre argument principal, le but qui vous guide, peut aussi changer. Et quand cela arrive, vous pourrez le mettre à jour sur le site et il changera ici.\n\nDonc mon point n'est pas que vous devez trouver un seul but et vous y accrocher pour toujours. Mon point est de vivre ces changements consciemment, afin que vous soyez ceux qui choisissent votre direction, plutôt que de simplement dériver là où la vie vous emmène.",
    captionAr:
      "W b7al l seasons, had lwr9at katbddl. Nta katbddl, w purpose dyalk y9der ybddl.\n\nW machi ddroori tl9a purpose wa7d w t9ad tbqa fih 3omrk kaml. Limportant howa tkoun wa3i b had lchange w tchoof fin katmchi.",
    projectorCue: "Like the seasons, your leaves will change.",
  }),
  block({
    id: "closing_1",
    title: "31. Forget the words",
    speakerText:
      "After this speech, I am sure most of you will forget the words I am going to speak, just as we all forget about our Apex classes until the end of the semester. It is very hard to considerably impact the way you think in the course of 5 minutes.\n\nI mean, we have all attended some classes for years without it happening.\n\nSo I wanted to keep something that will stay with you guys after your graduation.\nSo tonight, when you leave here, I want to leave you with one idea and one tool.",
    projectorState: "forest_zoom",
    season: "autumn",
    audienceState: "captions_visible",
    ceremonyState: "closing",
    estimatedDurationSec: 22,
    captionEn:
      "After this speech, I am sure most of you will forget the words I am going to speak, just as we all forget about our Apex classes until the end of the semester. It is very hard to considerably impact the way you think in the course of 5 minutes.\n\nI mean, we have all attended some classes for years without it happening.\n\nSo I wanted to keep something that will stay with you guys after your graduation.\nSo tonight, when you leave here, I want to leave you with one idea and one tool.",
    captionFr:
      "Après ce discours, je suis sûr que la plupart d'entre vous oublieront ce que je vais dire, tout comme nous oublions nos cours d'Apex jusqu'à la fin du semestre. Il est très difficile de changer considérablement la manière dont quelqu'un pense en 5 minutes.\n\nJe veux donc vous laisser quelque chose qui restera avec vous après votre graduation.\n\nCe soir, quand vous partirez d'ici, je veux vous laisser avec une idée et un outil.",
    captionAr:
      "Mlli tsali, ghadi tnsaw had lklam b7al ma kannsaw AP classes. S3b bzzaf tbddl tariqat lfkir dyal chi wa7d f 5 dqayeq.\n\nBghit nkhlli fikom wa7d idea w wa7d tool.",
  }),
  block({
    id: "closing_2",
    title: "32. The idea and the tool",
    speakerText:
      "The idea is simple: choose who you want to become, and keep looking for the purpose that drives you. You do not have to discover it today, and you do not have to get it right the first time. Just keep asking yourself the question, and be REALLY honest with yourself about the answer.\n\nThe website is simply a tool to help with that. Every now and then, it will ask you to check in and reflect. Just as you will change, your leaf will change as well. And by the way, none of this is public. Again, none of this is shared publicly, and by the way, by listening to my speech, you agree to my terms and conditions.\n\nAnd if you ever see ads pop up on the website, you may want to check up on me.",
    projectorState: "forest_zoom",
    season: "autumn",
    audienceState: "captions_visible",
    ceremonyState: "closing",
    estimatedDurationSec: 28,
    captionEn:
      "The idea is simple: choose who you want to become, and keep looking for the purpose that drives you. You do not have to discover it today, and you do not have to get it right the first time. Just keep asking yourself the question, and be REALLY honest with yourself about the answer.\n\nThe website is simply a tool to help with that. Every now and then, it will ask you to check in and reflect. Just as you will change, your leaf will change as well. And by the way, none of this is public. Again, none of this is shared publicly, and by the way, by listening to my speech, you agree to my terms and conditions.\n\nAnd if you ever see ads pop up on the website, you may want to check up on me.",
    captionFr:
      "L'idée est simple : choisissez qui vous voulez devenir, et continuez à chercher le but qui vous guide. Vous n'avez pas besoin de le découvrir aujourd'hui, et vous n'avez pas besoin de réussir du premier coup. Continuez simplement à vous poser la question et soyez VRAIMENT honnêtes avec vous-mêmes.\n\nLe site est simplement un outil pour aider avec cela. De temps en temps, il vous demandera de faire une pause et de réfléchir. Comme vous changerez, votre feuille changera aussi. Et au passage, rien de tout cela n'est public. Encore une fois, rien n'est partagé publiquement, et en écoutant mon discours, vous acceptez mes conditions générales.\n\nEt si jamais vous voyez des publicités apparaître sur le site, vous devriez peut-être venir me voir.",
    captionAr:
      "L idea hiya: khayar chkon bghiti twlli, w bqa tqlb 3la purpose dyalk. Ma khassch tchouf fih lyoum, w ma khassch tsib f lawwal marra. Ghir bqa t9ol rassk had su2al w kun SADA9 m3a rassk.\n\nW website ghir tool. Kaykhllik traaj3 rassek mn wa9t l wa9t. W ila shfto ads f site, rj3o 3ndi.",
  }),
  block({
    id: "reunion",
    title: "33. Reunion",
    speakerText:
      "So, Class of '26, we are about to embark on the next chapters of our lives, becoming doctors, business majors, football players, and other incredible people.\n\nYears from now, the leaves on that tree may look completely different.\n\nYour dreams may change.\nYour friends may change.\nYour sleep schedule will hopefully change.\n\nAnd whether we are ready or not, that journey is about to begin.\n\nSo all I can ask is that maybe in 10 or 15 years, we reunite, look back at those leaves, and be proud of ourselves.\n\nBe proud of ourselves for actively picking who we want to become.",
    projectorState: "life_stages",
    season: "spring",
    audienceState: "captions_visible",
    ceremonyState: "closing",
    estimatedDurationSec: 28,
    captionEn:
      "So, Class of '26, we are about to embark on the next chapters of our lives, becoming doctors, business majors, football players, and other incredible people.\n\nYears from now, the leaves on that tree may look completely different.\n\nYour dreams may change.\nYour friends may change.\nYour sleep schedule will hopefully change.\n\nAnd whether we are ready or not, that journey is about to begin.\n\nSo all I can ask is that maybe in 10 or 15 years, we reunite, look back at those leaves, and be proud of ourselves.\n\nBe proud of ourselves for actively picking who we want to become.",
    captionFr:
      "Donc, promotion 2026, nous sommes sur le point d'entrer dans les prochains chapitres de nos vies, en devenant médecins, étudiants en commerce, joueurs de football, et d'autres personnes incroyables.\n\nDans quelques années, les feuilles sur cet arbre pourront être complètement différentes.\n\nVos rêves peuvent changer.\nVos amis peuvent changer.\nVotre rythme de sommeil changera probablement.\n\nEt que nous soyons prêts ou non, ce voyage est sur le point de commencer.\n\nDonc tout ce que je peux vous demander, c'est que dans 10 ou 15 ans, nous nous réunissions, que nous regardions ces feuilles, et que nous soyons fiers de nous-mêmes.\n\nFiers d'avoir choisi activement qui nous voulons devenir.",
    captionAr:
      "Class of 26, ghadi ndkhlou l chapters jdad: doctors, business, football players…\n\nL3omor ghadi tbdl, friends ghadi ytbddlo, sleep schedule ghadi ytbddl.\n\nW f 10 ola 15 3am, n3awdo nltqaw, nchofo lwr9at, w nkono fkhourin b rassna.\n\nFkhourin blli khtarno b7al nin bghina nkono.",
  }),
  block({
    id: "end",
    title: "34. Congratulations",
    speakerText:
      "And if there is one thing I hope we take with us from tonight, it is this:\n\nJust as Mr. Mouad never stopped telling us to look for the main argument in a text, never stop looking for the main argument in your own life.\n\nWe are not perfect. None of us are.\nBut we can choose who we become.\n\nCongratulations, Class of 2026, and thank you, and I will miss you all.",
    projectorState: "end_card",
    season: "winter",
    audienceState: "closing",
    ceremonyState: "ended",
    estimatedDurationSec: 18,
    captionEn:
      "And if there is one thing I hope we take with us from tonight, it is this:\n\nJust as Mr. Mouad never stopped telling us to look for the main argument in a text, never stop looking for the main argument in your own life.\n\nWe are not perfect. None of us are.\nBut we can choose who we become.\n\nCongratulations, Class of 2026, and thank you, and I will miss you all.",
    captionFr:
      "Et s'il y a une chose que j'espère que nous retenons de ce soir, c'est ceci :\n\nTout comme M. Mouad ne cessait de nous dire de chercher l'argument principal dans un texte, ne cessez jamais de chercher l'argument principal dans votre propre vie.\n\nNous ne sommes pas parfaits. Aucun de nous ne l'est.\nMais nous pouvons choisir qui nous devenons.\n\nFélicitations, promotion 2026, merci, et vous allez tous me manquer.",
    captionAr:
      "W khlass: matqolch ghir main argument f texts, 9lb 3lih f 7yatak.\n\nHna ma kamlin makamalinch perfect.\nWalakin n9dro nkhtaro chkon bghina nkono.\n\nMabrouk class 2026, shukran w ghadi n7anakom bzzaf.",
    projectorCue: "Never stop looking for the main argument in your life.",
  }),
];
