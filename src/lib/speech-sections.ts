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
      "Hello everybody!\n\nI would like to welcome all of you here today: parents, friends, family, teachers, that random cat that decided to walk in, and, of course, the Class of 2026 (claps).",
    projectorState: "cosmos",
    season: "winter",
    audienceState: "captions_visible",
    ceremonyState: "intro",
    estimatedDurationSec: 20,
    captionEn:
      "Hello everybody!\nI would like to welcome all of you here today: parents, friends, family, teachers, that random cat that decided to walk in, and, of course, the Class of 2026 (claps).",
    captionFr:
      "Bonjour à tous !\n\nJe voudrais vous souhaiter la bienvenue aujourd'hui : aux parents, aux amis, à la famille, aux enseignants, à ce chat aléatoire qui a décidé d'entrer, et bien sûr à la promotion 2026 (applaudissements).",
    captionAr:
      "Salam 3la kolchi!\n\nBghit nرحab bikom kamlin hna lyom: lwalidin, s7ab, l3a2ila, lmo3allimin, dak lqatta li dkhlet b7al ila 3andha decision tdir tour sghir f l7fla, w tb3an, Class dyal 2026 (taplifiq).",
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
      "Ana فرحان bzaf nkon hna m3akom lyom bach nhtaflo b had lmarhala lmohema f 7yatina.",
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
      "Maintenant, comme je n'ai le droit de parler que pendant 5 minutes, si votre ami vient juste de partir aux toilettes, il a déjà raté tout le discours.",
    captionAr:
      "Daba 7it ghir mssmou7 lia nkhddem 5 dqa2iq, ila s7abk ghir tla3 yst3ml ttoilettes, rah fatou lspeech kaml",
  }),
  block({
    id: "thanks_1",
    title: "5. Thank yous",
    speakerText:
      "Before I begin, as is common tradition, I would like to thank everyone who made this journey possible.\n\nNow, of course, I won't bore you by reading out the names of all these people.",
    projectorState: "cosmos",
    season: "winter",
    audienceState: "captions_visible",
    ceremonyState: "intro",
    estimatedDurationSec: 16,
    captionEn:
      "Before I begin, as is common tradition, I would like to thank everyone who made this journey possible. Now, of course, I won't bore you by reading out the names of all these people.",
    captionFr:
      "Avant de commencer, comme le veut la tradition, je voudrais remercier toutes les personnes qui ont rendu ce parcours possible. Évidemment, je ne vais pas vous ennuyer en lisant tous leurs noms.",
    captionAr:
      "Qbel ma nbda, b7al kol 3ada, bghit nshkor kol wa7d s3dna f had tariq. Tb3an ghadi n3iyykom ila bghit nqra smiyat kolchi.",
  }),
  block({
    id: "thanks_2",
    title: "6. Real thanks",
    speakerText:
      "And I also don't think that simply mentioning their names in a speech is enough to show the level of appreciation that these people deserve.\n\nSo I encourage us all to really take the time to show our appreciation for those who matter to us by spending quality time with them.",
    projectorState: "cosmos",
    season: "winter",
    audienceState: "captions_visible",
    ceremonyState: "intro",
    estimatedDurationSec: 20,
    captionEn:
      "And I also don't think that simply mentioning their names in a speech is enough to show the level of appreciation that these people deserve.\nSo I encourage us all to really take the time to show our appreciation for those who matter to us by spending quality time with them.",
    captionFr:
      "Et je ne pense pas non plus que le simple fait de mentionner leurs noms dans un discours soit suffisant pour montrer le niveau de gratitude qu'ils méritent.\n\nJe nous encourage donc tous à vraiment prendre le temps de montrer notre reconnaissance à ceux qui comptent pour nous en passant du temps de qualité avec eux.",
    captionAr:
      "W sra7a, ghi n9ol smiyat nass f speech ma kafich bash nbayno l gratitude li khasna nhssou biha.\n\nDonc n9tah likom tkhddou wa9t bash tbayno lappreciation dyalkom l nass li kayhmoukom b tqdiya wa9t zwine m3ahom.",
  }),
  block({
    id: "bilal",
    title: "7. Bilal & Simo",
    speakerText:
      "However, I would like to make an exception to shout out my friends Bilal and Simo.\n\nYou guys each paid me 50 DH for this shoutout, by the way.",
    projectorState: "cosmos",
    season: "spring",
    audienceState: "captions_visible",
    ceremonyState: "storytelling",
    estimatedDurationSec: 10,
    captionEn:
      "However, I would like to make an exception to shout out my friends Bilal and Simo. You guys each paid me 50 DH for this shoutout, by the way.",
    captionFr:
      "Cependant, je voudrais faire une exception pour saluer mes amis Bilal et Simo. Au fait, vous m'avez chacun payé 50 dirhams pour cette dédicace.",
    captionAr:
      "B7it bghit ndir exception w nshoutout l s7abi Bilal w Simo. Kol wa7d fikom 3tani 50 DH 3la had shoutout btw",
  }),
  block({
    id: "classmates",
    title: "7b. Classmates",
    speakerText:
      "I would also like to take a bit of time to thank everyone here for making this experience what it was.",
    projectorState: "classmates_roll",
    season: "spring",
    audienceState: "captions_visible",
    ceremonyState: "storytelling",
    estimatedDurationSec: 40,
    captionEn:
      "I would also like to take a bit of time to thank everyone here for making this experience what it was.",
    captionFr:
      "Je voudrais également prendre un moment pour remercier tout le monde ici d'avoir rendu cette expérience aussi spéciale.",
    captionAr:
      "Bghit z3ma nshkor zada kolchi hna 3la had l experience.",
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
      "Ce moment représente pour nous une période de transition très particulière.",
    captionAr:
      "Had lmoment katmatal mar7la transition khasna.",
  }),
  block({
    id: "wizards_2",
    title: "9. Wizard robes",
    speakerText:
      "I mean, at one point, we probably all wished to dress up like wizards outside of Halloween, right?\n\nAlso, in true wizarding fashion, our robes were rumored to turn invisible and disappear before we could put them on.",
    projectorState: "cosmos",
    season: "spring",
    audienceState: "captions_visible",
    ceremonyState: "storytelling",
    estimatedDurationSec: 16,
    captionEn:
      "I mean, at one point, we probably all wished to dress up like wizards outside of Halloween, right?\nAlso, in true wizarding fashion, our robes were rumored to turn invisible and disappear before we could put them on.",
    captionFr:
      "Je veux dire, à un moment donné, nous avons probablement tous rêvé de nous habiller comme des sorciers en dehors d'Halloween, non ?\n\nEt, dans la plus pure tradition des sorciers, nos toges étaient réputées devenir invisibles et disparaître avant même que nous ayons pu les enfiler.",
    captionAr:
      "Sra7a, f wa7d lwa9t, kolna kankhtalmo nla9aw rrasna labsin b7al wizards barra men Halloween, la?\n\nW b style dyal wizard, takhrij dyalna kan ghir ichara blli lrobes ghadi ywalliw invisible qbel ma nlbsohom.",
  }),
  block({
    id: "asi_intro",
    title: "10. ASI lessons",
    speakerText:
      "We have learned many valuable lessons during our time here at ASI, some of which are really unique to an ASI education.\n\nThese will prepare us as we move on to our next adventures and try to find meaning and purpose in our lives, before ChatGPT takes it all away from us.",
    projectorState: "leaf_fragment",
    season: "spring",
    audienceState: "captions_visible",
    ceremonyState: "storytelling",
    estimatedDurationSec: 18,
    captionEn:
      "We have learned many valuable lessons during our time here at ASI, some of which are really unique to an ASI education. These will prepare us as we move on to our next adventures and try to find meaning and purpose in our lives, before ChatGPT takes it all away from us.",
    captionFr:
      "Nous avons appris de nombreuses leçons précieuses pendant notre temps à l'ASI, dont certaines sont vraiment propres à une éducation ASI. Elles nous prépareront pour nos prochaines aventures et pour notre quête de sens et de but dans la vie… avant que ChatGPT ne nous enlève tout ça.",
    captionAr:
      "T3llmna bzaf dyal lessons f ASI, w kol wa7d fih 7aja unique. Hado ghadi y3awnouna f lmostaqbal dyalna w f journey dyalna f 7it kan9lbou 3la meaning w purpose f 7yatina, qbel ma ChatGPT yakhod kolchi mnna",
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
    captionFr: "Nous avons appris à ne « jamais, jamais » abandonner dans la vie.",
    captionAr: 'T3llmna "never ever" t9tal3.',
  }),
  block({
    id: "ameur_2",
    title: "12. Math & physics",
    speakerText:
      "We also learned from Dr. Ameur that everything except math and physics in life is useless.\n\nI see him in the crowd; he is probably disgusted right now seeing us move toward disciplines like \"biology\" or, as he calls it, \"blah blah blah.\"",
    projectorState: "leaf_fragment",
    season: "spring",
    audienceState: "captions_visible",
    ceremonyState: "storytelling",
    estimatedDurationSec: 16,
    captionEn:
      "We also learned from Dr. Ameur that everything except math and physics in life is useless. I see him in the crowd; he is probably disgusted right now seeing us move toward disciplines like \"biology\" or, as he calls it, \"blah blah blah.\"",
    captionFr:
      "Nous avons également appris du Dr Ameur que tout dans la vie, à l'exception des mathématiques et de la physique, est inutile. Je le vois dans le public ; il est probablement horrifié à l'idée de nous voir nous diriger vers des disciplines comme la « biologie » ou, comme il l'appelle, le « blabla blabla ».",
    captionAr:
      'W t3llmna m3a Dr. Ameur blli kolchi f 7yatek ma3da math w physics rah "bla bla bla". Kanchofoh f crowd daba, ghaliban m9t3r mnna hna daba kanmchiw l biology',
  }),
  block({
    id: "ameur_3",
    title: "13. Always harder",
    speakerText:
      "Another lesson we learned from Dr. Ameur is that when life gets really hard, it can always get harder.\n\nIf you just finished an AP Calc exam, who knows?\n\nLife might give you an exam that is three times harder than that AP exam on the last day of school.",
    projectorState: "leaf_fragment",
    season: "summer",
    audienceState: "captions_visible",
    ceremonyState: "storytelling",
    estimatedDurationSec: 18,
    captionEn:
      "Another lesson we learned from Dr. Ameur is that when life gets really hard, it can always get harder. If you just finished an AP Calc exam, who knows? Life might give you an exam that is three times harder than that AP exam on the last day of school.",
    captionFr:
      "Une autre leçon du Dr Ameur est que lorsque la vie devient vraiment difficile, elle peut toujours devenir encore plus difficile. Si vous venez juste de terminer un examen d'AP Calculus, qui sait ? La vie pourrait vous donner un examen trois fois plus difficile le dernier jour d'école.",
    captionAr:
      "Zada t3llmna m3ah blli ila 7yat s3ba, ghadi twali as3ab. Ila tsali AP Calc exam, possible l7ayat t3tik wa7d akhtar s3b b 3 marrat f lyoum lakhir",
  }),
  block({
    id: "zineb",
    title: "14. Dr. Zineb",
    speakerText:
      "From Dr. Zineb, we were equipped with the ability to survive and stay focused in some of the most difficult environments.\n\nThe science experiments in her class seemed to produce a different smell every day for three years straight. Therefore, I am very certain that no matter where we end up, we can definitely stay concentrated, even if someone decides to make elephant toothpaste in the corner or the most disgusting-smelling eco-columns.",
    projectorState: "leaf_fragment",
    season: "summer",
    audienceState: "captions_visible",
    ceremonyState: "storytelling",
    estimatedDurationSec: 22,
    captionEn:
      "From Dr. Zineb, we were equipped with the ability to survive and stay focused in some of the most difficult environments.\n\nThe science experiments in her class seemed to produce a different smell every day for three years straight. Therefore, I am very certain that no matter where we end up, we can definitely stay concentrated, even if someone decides to make elephant toothpaste in the corner or the most disgusting-smelling eco-columns.",
    captionFr:
      "Grâce au Dr Zineb, nous avons acquis la capacité de survivre et de rester concentrés dans certains des environnements les plus difficiles.\n\nLes expériences scientifiques de sa classe semblaient produire une odeur différente chaque jour pendant trois années consécutives. Je suis donc convaincu que, peu importe où nous finirons, nous pourrons rester concentrés, même si quelqu'un décide de fabriquer du dentifrice pour éléphant dans un coin ou les éco-colonnes les plus malodorantes du monde.",
    captionAr:
      "M3a Dr. Zineb t3llmna kifach nb9aw n9drou nsowbo rrasna w nstay9dou f environments s3ba.\n\nExperiments f class dyalha kano kaykhalou ri7a jdida kol nhar l 3 snin. Donc ana mti2en blli f ay blasa nmshiw liha ghadi n9dro nrkkzo hatta ila chi wa7d dar elephant toothpaste f corner ola chi eco-columns li kay7ss b7al chi 7aja ma kaytklach",
  }),
  block({
    id: "digital",
    title: "15. Platforms",
    speakerText:
      "It is also only through our journey at ASI that we managed to learn how to use every single software tool we could possibly need: Alma, Microsoft Teams, Google Classroom, Wayground, MAP, Rediker, Ingrade, Apex, Edunation, and, of course, NoteSwap (shameless shoutout).\n\nSo that whatever we end up using in the future, we have the proper experience to do so, and we can add that to our LinkedIn bio.",
    projectorState: "leaf_fragment",
    season: "summer",
    audienceState: "captions_visible",
    ceremonyState: "storytelling",
    estimatedDurationSec: 18,
    captionEn:
      "It is also only through our journey at ASI that we managed to learn how to use every single software tool we could possibly need: Alma, Microsoft Teams, Google Classroom, Wayground, MAP, Rediker, Ingrade, Apex, Edunation, and, of course, NoteSwap (shameless shoutout). So that whatever we end up using in the future, we have the proper experience to do so, and we can add that to our LinkedIn bio.",
    captionFr:
      "C'est également grâce à notre parcours à l'ASI que nous avons appris à utiliser tous les logiciels imaginables : Alma, Microsoft Teams, Google Classroom, Wayground, MAP, Rediker, Ingrade, Apex, Edunation et, bien sûr, NoteSwap (petite publicité sans honte).\n\nAinsi, quel que soit l'outil que nous utiliserons à l'avenir, nous aurons déjà l'expérience nécessaire et nous pourrons l'ajouter à notre profil LinkedIn.",
    captionAr:
      "W zada f ASI t3llmna nst3mlo kol software mumkin: Alma, Teams, Google Classroom, Wayground, MAP, Rediker, Ingrade, Apex, Edunation, w tb3an NoteSwap (shoutout bla 7shma).\n\nDonc ay system f lmostaqbal ghadi n9dro nta2almo m3ah, w nzidouha f LinkedIn bio dyalna",
  }),
  block({
    id: "friendships",
    title: "16. Friendships",
    speakerText:
      "On a more serious note, ASI's small number of students also made it possible to develop close and meaningful connections with your friends.\n\nAnd I hope that as we begin to face the mythical \"real world,\" that supposedly only our parents live in, we keep these friendships, especially in the difficult times when we need them the most.",
    projectorState: "leaf_fragment",
    season: "summer",
    audienceState: "captions_visible",
    ceremonyState: "storytelling",
    estimatedDurationSec: 20,
    captionEn:
      "On a more serious note, ASI's small number of students also made it possible to develop close and meaningful connections with your friends. And I hope that as we begin to face the mythical \"real world,\" that supposedly only our parents live in, we keep these friendships, especially in the difficult times when we need them the most.",
    captionFr:
      "Plus sérieusement, le faible nombre d'élèves à l'ASI nous a permis de développer des relations proches et significatives avec nos amis. Et j'espère qu'au moment où nous commencerons à affronter le mythique « monde réel », dans lequel apparemment seuls nos parents vivent, nous conserverons ces amitiés, surtout dans les moments difficiles où nous en aurons le plus besoin.",
    captionAr:
      '3la niveau jdi, sughr school dyal ASI khllana ndirou connections qribin w ma3na.\n\nW ntemna mn ba3d ma nbdaw ndkhlo f "real world" li kay9olo 3lih ghir walidina kay3ichou fih, n7afdou 3la had l7bab, khassatan f wa9t s3ib li n7tajoh fih.',
  }),
  block({
    id: "memories_1",
    title: "17. Memories",
    speakerText:
      "And it is sad to think that all those memories made within the confines of ASI, the Speech and Debate tournaments, the MUN, MASAC tournaments, and even the small moments you spent with your friends at the Mahata…\n\nAll the good, all the bad are now memories.\n\nWhile it is sad to think that these are all memories, there will always be something that is left over that will remind you of them.",
    projectorState: "leaf_fragment",
    season: "summer",
    audienceState: "captions_visible",
    ceremonyState: "storytelling",
    estimatedDurationSec: 22,
    captionEn:
      "And it is sad to think that all those memories made within the confines of ASI, the Speech and Debate tournaments, the MUN, MASAC tournaments, and even the small moments you spent with your friends at the Mahata…\n\nAll the good, all the bad are now memories.\n\nWhile it is sad to think that these are all memories, there will always be something that is left over that will remind you of them.",
    captionFr:
      "Et il est triste de penser que tous ces souvenirs créés dans les murs de l'ASI — les tournois de Speech and Debate, le MUN, les compétitions MASAC, et même les petits moments passés avec vos amis à la Mahata...\n\nTout le bon, tout le mauvais, n'est désormais plus que souvenir.\n\nMême s'il est triste de penser que tout cela appartient au passé, il restera toujours quelque chose pour nous les rappeler.",
    captionAr:
      "W s3ib tftkr blli kol had lmemories dyal ASI: Speech & Debate, MUN, MASAC, w hatta l moments sgharin f Mahata…\n\nkolchi wlla daba ghir memories.\n\nWla howa s3ib, walakin ghadi yb9a dayman chi 7aja katfakkrek fih:",
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
      "Et c'est la personne que vous êtes devenu grâce à tout ce qui s'est passé.",
    captionAr:
      "howa ch-shakhs li wlit bih b sabab had kolchi.",
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
      "Je suppose que c'est probablement le moment où je suis censé vous raconter une histoire très inspirante, une dernière grande leçon de vie tirée de l'ASI qui changera le cours de votre existence. Aucune pression, n'est-ce pas ?\n\nCependant, lorsque j'ai cherché une leçon ou une histoire capable de traverser l'épreuve du temps, je n'en ai pas trouvé.\n\nEt croyez-moi, j'ai cherché.",
    captionAr:
      "Daba ghadi n7awl n3tikom chi story inspirational wla lesson akhira… no pressure",
  }),
  block({
    id: "search_2",
    title: "20. Steve Jobs… LEGO",
    speakerText:
      "I watched many motivational speeches, from Steve Jobs' famous commencement address to SpongeBob SquarePants telling Squidward to live a little, and The Lego Movie's catchy song encouraging people that \"everything is awesome\".\n\nAnd to be honest, after two days, I think I forgot 50% of what each speech was about.\n\nSo I realized I had two choices: either come up with a very catchy song with a lesson you guys will actually remember, or figure something else out.",
    projectorState: "leaf_reveal",
    season: "autumn",
    audienceState: "captions_visible",
    ceremonyState: "storytelling",
    estimatedDurationSec: 22,
    captionEn:
      "I watched many motivational speeches, from Steve Jobs' famous commencement address to SpongeBob SquarePants telling Squidward to live a little, and The Lego Movie's catchy song encouraging people that \"everything is awesome\".\n\nAnd to be honest, after two days, I think I forgot 50% of what each speech was about. So I realized I had two choices: either come up with a very catchy song with a lesson you guys will actually remember, or figure something else out.",
    captionFr:
      "J'ai regardé de nombreux discours de motivation, du célèbre discours de remise des diplômes de Steve Jobs jusqu'à Bob l'Éponge disant à Carlo de profiter un peu de la vie, en passant par la chanson entraînante de La Grande Aventure Lego qui nous rappelle que « tout est génial ».\n\nEt pour être honnête, après deux jours, je pense avoir oublié 50 % du contenu de chacun de ces discours. J'ai donc compris que j'avais deux choix : soit composer une chanson très accrocheuse avec une leçon que vous retiendriez vraiment, soit trouver autre chose.",
    captionAr:
      'Sra7a, l9it rassi kanqlb f speeches b7al Steve Jobs, SpongeBob kay9ol "live a little", w The Lego Movie kaygoul "everything is awesome".\n\nW b sra7a, mn ba3d juj nhar nsit 50% mn kolchi\n\nDonc 3ndi juj choices: ndir chi song catchy wla n9lb 3la plan akhor.',
  }),
  block({
    id: "search_3",
    title: "21. No catchy song",
    speakerText:
      "Fortunately enough for you guys... I didn't end up singing.\n\nSo I decided to explore something different for this speech.\n\nAnd to do so, I would like to build off another lesson we learned at ASI for my motivational message.",
    projectorState: "leaf_reveal",
    season: "autumn",
    audienceState: "captions_visible",
    ceremonyState: "storytelling",
    estimatedDurationSec: 16,
    captionEn:
      "Fortunately enough for you guys... I didn't end up singing.\n\nSo I decided to explore something different for this speech. And to do so, I would like to build off another lesson we learned at ASI for my motivational message.",
    captionFr:
      "Heureusement pour vous... je n'ai pas fini par chanter.\n\nJ'ai donc décidé d'explorer quelque chose de différent pour ce discours. Et pour cela, j'aimerais m'appuyer sur une autre leçon que nous avons apprise à l'ASI.",
    captionAr:
      "L7sn l7a9, makantsh ghadi nghanni likom",
  }),
  block({
    id: "main_1",
    title: "22. Main argument",
    speakerText:
      "I think by this point, we have all been traumatized into being able to identify the main argument in texts and documents, thanks to Dr. Mouad oops not yet Mr. Mouad and Miss Shillingsburg.\n\nAnd to quote one of these teachers: \"Everything has a main argument. Now go back and find the main argument in Neo-Islamism vs. Post-Islamism by Ahmed Kabbel.\"",
    projectorState: "leaf_reveal",
    season: "autumn",
    audienceState: "captions_visible",
    ceremonyState: "pivot_to_main_argument",
    estimatedDurationSec: 18,
    captionEn:
      "I think by this point, we have all been traumatized into being able to identify the main argument in texts and documents, thanks to Dr. Mouad oops not yet Mr. Mouad and Miss Shillingsburg.\nAnd to quote one of these teachers: \"Everything has a main argument. Now go back and find the main argument in Neo-Islamism vs. Post-Islamism by Ahmed Kabbel.\"",
    captionFr:
      "Je pense qu'à ce stade, nous avons tous été suffisamment traumatisés pour être capables d'identifier l'idée principale d'un texte ou d'un document, grâce à M. Mouad, oups, pas encore Dr Mouad, et à Mme Shillingsburg.\n\nEt pour citer l'un de ces enseignants : « Tout a une idée principale. Maintenant retournez trouver l'idée principale dans Neo-Islamism vs. Post-Islamism d'Ahmed Kabbel. »",
    captionAr:
      'F ASI t3llmna blli kol texte 3ando main argument, shukran Dr Mouad… oops Mr Mouad w Miss Shillingsburg\n\n"Kolchi 3ando main argument. daba rj3 w 7awel tl9a main argument f Neo-Islamism vs Post-Islamism…"',
    projectorCue: "Everything has a main argument.",
  }),
  block({
    id: "main_2",
    title: "23. Your life's thesis",
    speakerText:
      "So now, applying what we learned in class, I would like to challenge everybody, including Mr. Mouad, to look for the main argument, or arguments, in their lives.\n\nWhat is the purpose that is driving your life?\n\nBecause when was the last time you truly thought about this?\n\nThat one time your phone was off in the bathroom?\n\nI mean, that was when I wrote this speech, so no judging.\n\nBut the point is that yes, you will probably reflect on this question during important transitional periods like now, but when do you really think about this outside of these times?",
    projectorState: "leaf_reveal",
    season: "autumn",
    audienceState: "captions_visible",
    ceremonyState: "pivot_to_main_argument",
    estimatedDurationSec: 24,
    captionEn:
      "So now, applying what we learned in class, I would like to challenge everybody, including Mr. Mouad, to look for the main argument, or arguments, in their lives. What is the purpose that is driving your life?\n\nBecause when was the last time you truly thought about this? That one time your phone was off in the bathroom? I mean, that was when I wrote this speech, so no judging. But the point is that yes, you will probably reflect on this question during important transitional periods like now, but when do you really think about this outside of these times?",
    captionFr:
      "Alors maintenant, en appliquant ce que nous avons appris en classe, j'aimerais mettre tout le monde au défi, y compris M. Mouad, de chercher l'idée principale, ou les idées principales, de sa propre vie. Quel est le but qui guide votre existence ?\n\nCar quand est-ce que vous avez vraiment réfléchi à cela pour la dernière fois ? La fois où votre téléphone était éteint dans les toilettes ? Personnellement, c'est là que j'ai écrit ce discours, donc pas de jugement. Mais l'idée est que oui, vous réfléchirez probablement à cette question pendant des périodes de transition importantes comme celle-ci. Mais quand y pensez-vous réellement en dehors de ces moments ?",
    captionAr:
      "Donc daba, bghit nkhlli kol wa7d — w hatta Mr Mouad — y9lb 3la main argument f 7yatou. chnu howa purpose li kaydfe3k?\n\n7it mta f lmarra l5ra fakkart f had lso2al b jdd? maybe f wc w telephone matfi",
    projectorCue: "What is the main argument of a life?",
  }),
  block({
    id: "science_1",
    title: "24. Purpose",
    speakerText:
      "The reason I want to stress this point is because it is the most fundamental question we can ask ourselves,\n\nand above all, we humans are really driven by our purpose.",
    projectorState: "leaf_reveal",
    season: "autumn",
    audienceState: "captions_visible",
    ceremonyState: "pivot_to_main_argument",
    estimatedDurationSec: 14,
    captionEn:
      "The reason I want to stress this point is because it is the most fundamental question we can ask ourselves, and above all, we humans are really driven by our purpose.",
    captionFr:
      "La raison pour laquelle j'insiste sur ce point est qu'il s'agit de la question la plus fondamentale que nous puissions nous poser. Et surtout, nous, les êtres humains, sommes profondément guidés par notre raison d'être.",
    captionAr:
      "Lreason li 3la shanha kan9ol hadchi howa blli human kayt7arko b purpose.",
  }),
  block({
    id: "science_2",
    title: "25. Citation",
    speakerText:
      'A research paper compared two groups of 7,000 adults: one group consisted of individuals who had a deep sense of motivation and a very clear purpose in life, while the other group did not ("Alimujiang et al., 2019").\n\nIf people didn\'t get it: stupid in-text citation.\n\nThe research suggests that SIMPLY having a clear sense of purpose can result in significantly better health outcomes and lower mortality risk.\n\nTake that, doctors!',
    projectorState: "single_leaf",
    season: "autumn",
    audienceState: "captions_visible",
    ceremonyState: "pivot_to_main_argument",
    estimatedDurationSec: 22,
    captionEn:
      'A research paper compared two groups of 7,000 adults: one group consisted of individuals who had a deep sense of motivation and a very clear purpose in life, while the other group did not ("Alimujiang et al., 2019").\n\nIf people didn\'t get it: stupid in-text citation.\n\nThe research suggests that SIMPLY having a clear sense of purpose can result in significantly better health outcomes and lower mortality risk.\n\nTake that, doctors!',
    captionFr:
      "Une étude a comparé deux groupes de 7 000 adultes : un groupe composé de personnes ayant un fort sentiment de motivation et un but très clair dans la vie, et un autre groupe qui n'en avait pas.\n\nSi certains ne l'ont pas compris : c'était une citation académique un peu ridicule.\n\nCette étude suggère que le simple fait d'avoir un objectif clair peut conduire à de meilleurs résultats en matière de santé et à un risque de mortalité plus faible.\n\nPrenez ça, les médecins !",
    captionAr:
      "Research kay9oul blli nass li 3andhom sense dyal purpose kay3ichou a7ssan w 3andhom risk aqal dyal mortality.\n\nDonc… khoudha mn 3indi: having purpose kayfer9 bzaf.",
  }),
  block({
    id: "qr_reflection",
    title: "26. Scan QR now",
    speakerText:
      "Now, to continue my lesson, I will give you 20 seconds to scan the QR code above if you haven't already, read through what it says carefully, and try to answer honestly.\n\nWhen you submit your answer, look up at the screen and you should see a leaf be added to this tree.",
    projectorState: "qr_reflection",
    season: "spring",
    audienceState: "captions_visible",
    ceremonyState: "reflection_prompt",
    estimatedDurationSec: 25,
    captionEn:
      "Now, to continue my lesson, I will give you 20 seconds to scan the QR code above if you haven't already, read through what it says carefully, and try to answer honestly. When you submit your answer, look up at the screen and you should see a leaf be added to this tree.",
    captionFr:
      "Pour poursuivre cette réflexion, je vais vous laisser 20 secondes pour scanner le QR code affiché au-dessus de vous si ce n'est pas déjà fait, lire attentivement ce qu'il indique et essayer de répondre honnêtement. Une fois votre réponse envoyée, regardez l'écran et vous devriez voir une feuille s'ajouter à cet arbre.",
    captionAr:
      "Daba ghadi n3tikom 20 seconds tchoufou QR code ila ma zeltou, w tjawbou b sra7a.\n\nMlli tsiftou answer, ghadi tchoufou wra9a f tree.",
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
      "Personne ne pourra voir vos réponses à part vous.\n\nSauf si les choses tournent vraiment mal pour moi plus tard et que je dois vendre vos données pour gagner un peu d'argent.",
    captionAr:
      "Ma kaychof even wa7d jawbak ghir nta.\n\n…ila ma b3tch data dyalkom f lmostaqbal (jk)",
    projectorCue: "What is the main argument of your life?",
  }),
  block({
    id: "music_joke",
    title: "28. Inner thoughts",
    speakerText:
      "I am obviously way too awkward to just stand still for a few seconds, so here is some beautiful music to listen to:\n\nYou know what, never mind.\n\nJust listen to your inner thoughts.\n\n20 seconds later… (Website changes to tell them to look up)",
    projectorState: "tree_growing",
    season: "spring",
    audienceState: "response_collection",
    ceremonyState: "response_collection",
    estimatedDurationSec: 20,
    captionEn:
      "I am obviously way too awkward to just stand still for a few seconds, so here is some beautiful music to listen to:\n\nYou know what, never mind.\n\nJust listen to your inner thoughts.\n\n20 seconds later… (Website changes to tell them to look up)",
    captionFr:
      "Je suis évidemment beaucoup trop maladroit pour rester immobile quelques secondes, alors voici une magnifique musique à écouter :\n\nVous savez quoi ? Finalement non.\n\nÉcoutez simplement vos pensées.\n\n20 secondes plus tard… (Le site leur demande de lever les yeux)",
    captionAr:
      "20 seconds…",
  }),
  block({
    id: "look_up_1",
    title: "29. Look up",
    speakerText:
      "Now all of you probably had a different experience in these last few seconds.\n\nObviously, I don't expect anybody here to be able to come up with the main argument or purpose of your life in that short amount of time.\n\nIf you were, I am concerned.\n\nSome of you might feel certain about your direction.\n\nSome of you might feel unsure.\n\nAnd honestly, both are completely normal.\n\nRight now, if you look up, you will see a leaf representing your answer.",
    projectorState: "tree_growing",
    season: "spring",
    audienceState: "look_up_nudge",
    ceremonyState: "return_to_speech",
    estimatedDurationSec: 22,
    captionEn:
      "Now all of you probably had a different experience in these last few seconds. Obviously, I don't expect anybody here to be able to come up with the main argument or purpose of your life in that short amount of time.\n\nIf you were, I am concerned.\n\nSome of you might feel certain about your direction.\nSome of you might feel unsure.\nAnd honestly, both are completely normal.\n\nRight now, if you look up, you will see a leaf representing your answer.",
    captionFr:
      "Vous avez probablement tous vécu une expérience différente pendant ces quelques secondes. Évidemment, je ne m'attends pas à ce que quelqu'un soit capable de trouver l'idée principale ou le but de sa vie en si peu de temps.\n\nSi c'est le cas, je suis inquiet.\n\nCertains d'entre vous se sentent peut-être certains de leur direction.\nD'autres se sentent peut-être perdus.\nEt honnêtement, les deux sont parfaitement normaux.\n\nSi vous regardez l'écran maintenant, vous verrez une feuille représentant votre réponse.",
    captionAr:
      "Daba, kol wa7d fkom ghaliban 3ach experience different.\n\nMa mnt9ch t9dro tl9aw main argument dyal 7yatkom f 20 seconds\n\nBa3dkom mta3yin, ba3dkom shakkin.\n\nW juj normal.\n\nDaba ila tfarkitou, ghadi tchoufou leaf katmatal jawbak.",
  }),
  block({
    id: "look_up_2",
    title: "30. Seasons",
    speakerText:
      "And just like the seasons, those leaves change.\n\nAs time goes on, you will change, and your main argument, the purpose that drives you, may change as well.\n\nAnd when it does, you can update that on the website and it will change here.\n\nSo my point is not that you need to find one purpose and hold onto it forever.\n\nMy point is to live through those changes consciously, so that you are the one choosing your direction, rather than simply drifting wherever life happens to take you.",
    projectorState: "seasons_cycle",
    season: "summer",
    audienceState: "look_up_nudge",
    ceremonyState: "return_to_speech",
    estimatedDurationSec: 22,
    captionEn:
      "And just like the seasons, those leaves change. As time goes on, you will change, and your main argument, the purpose that drives you, may change as well. And when it does, you can update that on the website and it will change here.\n\nSo my point is not that you need to find one purpose and hold onto it forever. My point is to live through those changes consciously, so that you are the one choosing your direction, rather than simply drifting wherever life happens to take you.",
    captionFr:
      "Et comme les saisons, ces feuilles changent. Avec le temps, vous changerez, et l'idée principale, le but qui vous guide, pourra lui aussi changer. Et lorsqu'il changera, vous pourrez le mettre à jour sur le site et cela changera ici aussi.\n\nMon propos n'est donc pas que vous devez trouver un seul but et vous y accrocher pour toujours. Mon propos est de vivre ces changements consciemment, afin que ce soit vous qui choisissiez votre direction, plutôt que de simplement vous laisser porter par le courant de la vie.",
    captionAr:
      "B7al seasons, leaves katbddl. w nta katbddl. w purpose dyalk mumkin ytbeddel hta howa.\n\nW ila tbddl, t9dro update f website w ghadi ytbddl hna.\n\nDonc mashi lazem tl9a purpose wa7d w tb9a m3ah l'life kamla.\n\nLa, lmohem hiya tb9a wa3i b had lchanges w nta li katkhtar direction dyalek.\n\nMashi ghir t7dth t3ich m3a ltiyar bla ma t7ss.",
    projectorCue: "Like the seasons, your leaves will change.",
  }),
  block({
    id: "closing_1",
    title: "31. Forget the words",
    speakerText:
      "After this speech, I am sure most of you will forget the words I am going to speak, just as we all forget about our Apex classes until the end of the semester.\n\nMr. Bernard, I promise I will finish it by tomorrow.\n\nIt is very hard to considerably impact the way you think in the course of 5 minutes.\n\nI mean, we have all attended some classes for years without it happening.\n\nSo I wanted to make sure you guys were left with something after graduation.\n\nSo tonight, when you leave here, I want to leave you with one idea and one tool.",
    projectorState: "forest_zoom",
    season: "autumn",
    audienceState: "captions_visible",
    ceremonyState: "closing",
    estimatedDurationSec: 22,
    captionEn:
      "After this speech, I am sure most of you will forget the words I am going to speak, just as we all forget about our Apex classes until the end of the semester. Mr. Bernard, I promise I will finish it by tomorrow. It is very hard to considerably impact the way you think in the course of 5 minutes.\n\nI mean, we have all attended some classes for years without it happening.\n\nSo I wanted to make sure you guys were left with something after graduation.\nSo tonight, when you leave here, I want to leave you with one idea and one tool.",
    captionFr:
      "Après ce discours, je suis sûr que la plupart d'entre vous oublieront les mots que je vais prononcer, tout comme nous oublions tous nos cours Apex jusqu'à la fin du semestre. M. Bernard, je vous promets que je le terminerai demain.\n\nIl est très difficile de modifier profondément la façon dont quelqu'un pense en seulement cinq minutes.\n\nJe veux dire, nous avons tous suivi certains cours pendant des années sans que cela n'arrive.\n\nJe voulais donc m'assurer que vous repartiez avec quelque chose après cette remise des diplômes.\n\nAlors ce soir, lorsque vous quitterez cet endroit, je voudrais vous laisser avec une idée et un outil.",
    captionAr:
      "Ba3d had speech, ghaliban ghadi tnsaw kolchi li ghalt\n\nb7al Apex classes hatta akhir semester… Mr Bernard kan3rf ghadi nkmlha ghda\n\nDonc bghit nkhlli likom chi 7aja.\n\nF lakhir: idea wa7da w tool wa7d.",
  }),
  block({
    id: "closing_2",
    title: "32. The idea and the tool",
    speakerText:
      "The idea is simple: choose who you want to become, and keep looking for the purpose that drives you.\n\nYou do not have to discover it today, and you do not have to get it right the first time.\n\nJust keep asking yourself the question, and be REALLY honest with yourself about the answer.\n\nThe website is simply a tool to help with that.\n\nEvery now and then, it will ask you to check in and reflect.\n\nUpdate your leaves.\n\nAgain, just to clarify, none of this is shared publicly, and by the way, I am not sure if you saw that tiny disclaimer at the beginning of my speech, but by listening to my speech, you agree to my terms and conditions.\n\nAnd if you ever see ads pop up on the website, you may want to check up on me.",
    projectorState: "forest_zoom",
    season: "autumn",
    audienceState: "captions_visible",
    ceremonyState: "closing",
    estimatedDurationSec: 28,
    captionEn:
      "The idea is simple: choose who you want to become, and keep looking for the purpose that drives you. You do not have to discover it today, and you do not have to get it right the first time. Just keep asking yourself the question, and be REALLY honest with yourself about the answer.\n\nThe website is simply a tool to help with that. Every now and then, it will ask you to check in and reflect. Update your leaves. Again, just to clarify, none of this is shared publicly, and by the way, I am not sure if you saw that tiny disclaimer at the beginning of my speech, but by listening to my speech, you agree to my terms and conditions.\n\nAnd if you ever see ads pop up on the website, you may want to check up on me.",
    captionFr:
      "L'idée est simple : choisissez la personne que vous voulez devenir et continuez à chercher le but qui vous anime. Vous n'avez pas besoin de le découvrir aujourd'hui, et vous n'avez pas besoin d'avoir raison du premier coup. Continuez simplement à vous poser la question, et soyez VRAIMENT honnêtes avec vous-mêmes dans votre réponse.\n\nLe site n'est qu'un outil pour vous aider dans cette démarche. De temps en temps, il vous demandera de faire le point et de réfléchir. Mettez à jour vos feuilles.\n\nEncore une fois, juste pour préciser, rien de tout cela n'est public. Et au fait, je ne sais pas si vous avez remarqué la petite clause de non-responsabilité au début de mon discours, mais en l'écoutant, vous acceptez mes conditions générales d'utilisation.\n\nEt si jamais vous voyez des publicités apparaître sur le site, vous devriez probablement prendre de mes nouvelles.",
    captionAr:
      "Idea: khtar shkun bghiti twlli w 9lb 3la purpose dyalk.\n\nTool: had website bach tkhdem reflection.\n\nW b7al disclaimer: ila sma3ti speech dyali, nta mwaf9 3la terms & conditions",
  }),
  block({
    id: "reunion",
    title: "33. Reunion",
    speakerText:
      "So, Class of '26, we are about to embark on the next chapters of our lives, becoming doctors, business majors, football players, potential tax evaders (credits to my little brother for suggesting that one), and other incredible people.\n\nYears from now, the leaves on that tree may look completely different.\n\nYour dreams may change.\nYour friends may change.\nYour sleep schedule and diet will hopefully change.\n\nAnd whether we are ready or not, that journey is about to begin.\n\nSo all I can ask is that maybe in 10 or 15 years, we reunite, look back at this tree, and be proud of ourselves.\n\nBe proud of ourselves for actively picking who we want to become.\n\nAnd if in 15 years your leaf still says \"I don't know,\" I mean, at least you tried.",
    projectorState: "forest_zoom",
    season: "spring",
    audienceState: "captions_visible",
    ceremonyState: "closing",
    estimatedDurationSec: 28,
    captionEn:
      "So, Class of '26, we are about to embark on the next chapters of our lives, becoming doctors, business majors, football players, potential tax evaders (credits to my little brother for suggesting that one), and other incredible people.\n\nYears from now, the leaves on that tree may look completely different.\n\nYour dreams may change.\nYour friends may change.\nYour sleep schedule and diet will hopefully change.\n\nAnd whether we are ready or not, that journey is about to begin.\n\nSo all I can ask is that maybe in 10 or 15 years, we reunite, look back at this tree, and be proud of ourselves.\n\nBe proud of ourselves for actively picking who we want to become.\n\nAnd if in 15 years your leaf still says \"I don't know,\" I mean, at least you tried.",
    captionFr:
      "Alors, promotion 2026, nous sommes sur le point d'entamer le prochain chapitre de nos vies, en devenant médecins, étudiants en commerce, footballeurs, potentiels fraudeurs fiscaux (merci à mon petit frère pour cette suggestion) et toutes sortes d'autres personnes extraordinaires.\n\nDans plusieurs années, les feuilles de cet arbre auront peut-être complètement changé.\n\nVos rêves pourront changer.\nVos amis pourront changer.\nVotre rythme de sommeil et votre alimentation changeront, espérons-le.\n\nEt que nous soyons prêts ou non, ce voyage est sur le point de commencer.\n\nAlors tout ce que je demande, c'est que dans 10 ou 15 ans, nous nous retrouvions, que nous regardions cet arbre et que nous soyons fiers de nous-mêmes.\n\nFiers d'avoir activement choisi la personne que nous voulions devenir.\n\nEt si dans 15 ans votre feuille indique toujours « Je ne sais pas », eh bien... au moins vous aurez essayé.",
    captionAr:
      'Class dyal 26, ghadi ndkhlou lchapters jdad: doctors, business majors, football players, potential tax evaders (shoutout lkhoya sghir), w nass khrin amazing.\n\nYears mn b3d, leaves ghadi ybddl kolchi.\n\nDreams ghadi ybddl.\n\nFriends ghadi ybddl.\n\nSleep w diet… inshallah ybddl\n\nW journey ghadi tbdaw daba.\n\nDonc ntmna f 10–15 ans nrj3o nchofo had tree w nkono proud b rrasna.\n\nProud blli konna we consciously chfna chkun bghina nkouno.\n\nW ila b9a leaf dyalek "I don\'t know"… a la limite, 3la l2a9al 7awelt.',
  }),
  block({
    id: "end",
    title: "34. Congratulations",
    speakerText:
      "And if there is one thing I hope we take with us from tonight, it is this:\n\nJust as Mr. Mouad never stopped telling us to look for the main argument in a text, never stop looking for the main argument in your own life.\n\nWe are not perfect.\n\nNone of us are.\n\nBut we can choose who we become.\n\n(15 second pause. Congratulations appear on screen.)\n\nCongratulations, Class of 2026.\n\nThank you, and I will miss you all!",
    projectorState: "end_card",
    season: "winter",
    audienceState: "closing",
    ceremonyState: "ended",
    estimatedDurationSec: 33,
    captionEn:
      "And if there is one thing I hope we take with us from tonight, it is this:\n\nJust as Mr. Mouad never stopped telling us to look for the main argument in a text, never stop looking for the main argument in your own life.\n\nWe are not perfect. None of us are.\nBut we can choose who we become.\n\nCongratulations, Class of 2026. Thank you, and I will miss you all!",
    captionFr:
      "Et s'il y a une chose que j'espère que nous retiendrons de ce soir, c'est celle-ci :\n\nTout comme M. Mouad n'a jamais cessé de nous demander de chercher l'idée principale d'un texte, ne cessez jamais de chercher l'idée principale de votre propre vie.\n\nNous ne sommes pas parfaits. Aucun de nous ne l'est.\n\nMais nous pouvons choisir qui nous devenons.\n\nFélicitations, promotion 2026. Merci, et vous allez tous me manquer !",
    captionAr:
      "W n3awd kolchi:\n\nJust b7al ma kan9ol Mr Mouad, matw9afch tl9a main argument f 7yatek.\n\nNta mashi perfect. 7ta wa7d mashi perfect.\n\nWalakin t9der tkhtar shkun bghiti twlli.\n\nMabrouk Class dyal 2026. Shukran, w ghadi n9lb 3likom kolkom!",
    projectorCue: "Never stop looking for the main argument in your life.",
  }),
];
