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
    captionAr: "راك معانا. تبع خطاب التخرج مباشرة من téléphone ديالك.",
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
  }),
  block({
    id: "three_minutes",
    title: "4. 3 minutes",
    speakerText:
      "Now, since I am only allowed to speak for 3 minutes, if your friend has just left to use the restroom, they just missed the entire speech.",
    projectorState: "cosmos",
    season: "winter",
    audienceState: "captions_visible",
    ceremonyState: "intro",
    estimatedDurationSec: 12,
    captionEn:
      "Now, since I am only allowed to speak for 3 minutes, if your friend has just left to use the restroom, they just missed the entire speech.",
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
  }),
  block({
    id: "bilal",
    title: "7. Bilal",
    speakerText:
      "However, I would like to make an exception to shout out my friend Bilal. You owe me 50 DH now.",
    projectorState: "cosmos",
    season: "spring",
    audienceState: "captions_visible",
    ceremonyState: "storytelling",
    estimatedDurationSec: 10,
    captionEn:
      "However, I would like to make an exception to shout out my friend Bilal. You owe me 50 DH now.",
  }),
  block({
    id: "classmates",
    title: "7b. Classmates",
    speakerText:
      "And to all these amazing people — thank you for being part of this journey.",
    projectorState: "classmates_roll",
    season: "spring",
    audienceState: "captions_visible",
    ceremonyState: "storytelling",
    estimatedDurationSec: 40,
    captionEn:
      "And to all these amazing people — thank you for being part of this journey.",
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
  }),
  block({
    id: "wizards_2",
    title: "9. Wizard robes",
    speakerText:
      "At one point, we probably all wished to dress up like wizards outside of Halloween. Also in true wizarding fashion, our robes were rumored to turn invisible and disappear before we could put them on.",
    projectorState: "cosmos",
    season: "spring",
    audienceState: "captions_visible",
    ceremonyState: "storytelling",
    estimatedDurationSec: 16,
    captionEn:
      "At one point, we probably all wished to dress up like wizards outside of Halloween. Also in true wizarding fashion, our robes were rumored to turn invisible and disappear before we could put them on.",
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
  }),
  block({
    id: "ameur_2",
    title: "12. Math & physics",
    speakerText:
      "And that everything except math and physics in life is useless, from  Dr. Ameur. He is probably disgusted right now as he sees us move towards disciplines like biology and medicine.",
    projectorState: "leaf_fragment",
    season: "spring",
    audienceState: "captions_visible",
    ceremonyState: "storytelling",
    estimatedDurationSec: 16,
    captionEn:
      "And that everything except math and physics in life is useless, from  Dr. Ameur. He is probably disgusted right now as he sees us move towards disciplines like biology and medicine.",
  }),
  block({
    id: "ameur_3",
    title: "13. Always harder",
    speakerText:
      "Another lesson we learned from Dr. Ameur. Is that when life gets really hard, it can always get harder. If you just finished an AP Calc Exam, life might give you an exam that is 3 times harder than the AP Exam on the last day of school.",
    projectorState: "leaf_fragment",
    season: "summer",
    audienceState: "captions_visible",
    ceremonyState: "storytelling",
    estimatedDurationSec: 18,
    captionEn:
      "Another lesson we learned from Dr. Ameur. Is that when life gets really hard, it can always get harder. If you just finished an AP Calc Exam, life might give you an exam that is 3 times harder than the AP Exam on the last day of school.",
  }),
  block({
    id: "zineb",
    title: "14. Dr. Zineb",
    speakerText:
      "From Dr Zineb, we were equipped with the ability to survive and stay focused in some of the most difficult environments.\n\nThe science experiments in her class seemed to produce a different smell every day for 3 years straight. Therefore, I am very certain that no matter where we end up, we can definitely stay concentrated, even if someone decides to make elephant toothpaste in the corner.",
    projectorState: "leaf_fragment",
    season: "summer",
    audienceState: "captions_visible",
    ceremonyState: "storytelling",
    estimatedDurationSec: 22,
    captionEn:
      "From Dr Zineb, we were equipped with the ability to survive and stay focused in some of the most difficult environments.\n\nThe science experiments in her class seemed to produce a different smell every day for 3 years straight. Therefore, I am very certain that no matter where we end up, we can definitely stay concentrated, even if someone decides to make elephant toothpaste in the corner.",
  }),
  block({
    id: "digital",
    title: "15. Platforms",
    speakerText:
      "It is also only through our journey at ASI that we managed to learn how to use Alma, Microsoft Teams, Google Classroom, Wayground, MAP, Rediker, Ingrade, Apex, Edunation, and ofc NoteSwap (shameless shoutout). So that whatever we end up using in the future, we have the proper experience to do so.",
    projectorState: "leaf_fragment",
    season: "summer",
    audienceState: "captions_visible",
    ceremonyState: "storytelling",
    estimatedDurationSec: 18,
    captionEn:
      "It is also only through our journey at ASI that we managed to learn how to use Alma, Microsoft Teams, Google Classroom, Wayground, MAP, Rediker, Ingrade, Apex, Edunation, and ofc NoteSwap (shameless shoutout). So that whatever we end up using in the future, we have the proper experience to do so.",
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
  }),
  block({
    id: "memories_1",
    title: "17. Memories",
    speakerText:
      "And its sad to think that all those memories made within the confines of ASI, the Speech and Debate tournaments, the MUN,  MASAC tournaments, and even the small times you hung out with your friends at the Mahata…\n\nAll the good, all the bad are now memories.\n\nWhile it is sad to think that these are all memories, there will always be something that is left over that will remind you of them.",
    projectorState: "leaf_fragment",
    season: "summer",
    audienceState: "captions_visible",
    ceremonyState: "storytelling",
    estimatedDurationSec: 22,
    captionEn:
      "And its sad to think that all those memories made within the confines of ASI, the Speech and Debate tournaments, the MUN,  MASAC tournaments, and even the small times you hung out with your friends at the Mahata…\n\nAll the good, all the bad are now memories.\n\nWhile it is sad to think that these are all memories, there will always be something that is left over that will remind you of them.",
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
    projectorCue: "You appear",
  }),
  block({
    id: "search_1",
    title: "19. No perfect lesson",
    speakerText:
      "Now I figured this is probably the time when I give you all a very inspirational story, one last important life lesson from ASI, that will change the course of your lives. No pressure right?\nHowever, when looking for a lesson or story good enough to surpass the test of time, I couldn't.\n\nAnd trust me, I looked.",
    projectorState: "leaf_reveal",
    season: "autumn",
    audienceState: "captions_visible",
    ceremonyState: "storytelling",
    estimatedDurationSec: 18,
    captionEn:
      "Now I figured this is probably the time when I give you all a very inspirational story, one last important life lesson from ASI, that will change the course of your lives. No pressure right?\nHowever, when looking for a lesson or story good enough to surpass the test of time, I couldn't.\n\nAnd trust me, I looked.",
  }),
  block({
    id: "search_2",
    title: "20. Steve Jobs… LEGO",
    speakerText:
      "I watched many motivational speeches, from Steve Jobs' famous commencement address to SpongeBob SquarePants telling Squidward to live a little, and the Lego Movie's catchy song encouraging people that \"everything is awesome\".\n\nAnd to be honest, after 2 days, I think I forgot 50% of what each speech was about. So I realized I had only one choice: either come up with a very catchy song with a lesson you guys will actually remember",
    projectorState: "leaf_reveal",
    season: "autumn",
    audienceState: "captions_visible",
    ceremonyState: "storytelling",
    estimatedDurationSec: 22,
    captionEn:
      "I watched many motivational speeches, from Steve Jobs' famous commencement address to SpongeBob SquarePants telling Squidward to live a little, and the Lego Movie's catchy song encouraging people that \"everything is awesome\".\n\nAnd to be honest, after 2 days, I think I forgot 50% of what each speech was about. So I realized I had only one choice: either come up with a very catchy song with a lesson you guys will actually remember",
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
  }),
  block({
    id: "main_1",
    title: "22. Main argument",
    speakerText:
      "I think by this point, we have all been traumatized into being able to identify the main argument in texts and documents, thanks to Mr. Mouad and Miss Shillingsburg.\nAnd to quote one of these teachers: \"Everything has a main argument. Now go back and find the main argument in Neo-Islamism vs. Post-Islamism.\"",
    projectorState: "leaf_reveal",
    season: "autumn",
    audienceState: "captions_visible",
    ceremonyState: "pivot_to_main_argument",
    estimatedDurationSec: 18,
    captionEn:
      "I think by this point, we have all been traumatized into being able to identify the main argument in texts and documents, thanks to Mr. Mouad and Miss Shillingsburg.\nAnd to quote one of these teachers: \"Everything has a main argument. Now go back and find the main argument in Neo-Islamism vs. Post-Islamism.\"",
    projectorCue: "Everything has a main argument.",
  }),
  block({
    id: "main_2",
    title: "23. Your life's thesis",
    speakerText:
      "So now, applying what we learned in class, I would like to challenge everybody, including Mr. Mouad, to look for the main argument, or arguments, in their lives. What is the purpose that is driving your life?\nBecause when was the last time you truly thought about this? That one time your phone was off in the bathroom? I mean, that was when I wrote this speech, so no judging. But the point is that yes, you will probably reflect on this question, during these important transitional period, but when do you do see beyond those times.",
    projectorState: "leaf_reveal",
    season: "autumn",
    audienceState: "captions_visible",
    ceremonyState: "pivot_to_main_argument",
    estimatedDurationSec: 24,
    captionEn:
      "So now, applying what we learned in class, I would like to challenge everybody, including Mr. Mouad, to look for the main argument, or arguments, in their lives. What is the purpose that is driving your life?\nBecause when was the last time you truly thought about this? That one time your phone was off in the bathroom? I mean, that was when I wrote this speech, so no judging. But the point is that yes, you will probably reflect on this question, during these important transitional period, but when do you do see beyond those times.",
    projectorCue: "What is the main argument of a life?",
  }),
  block({
    id: "science_1",
    title: "24. Purpose",
    speakerText:
      "The reason I want to stress this point is because it's the most fundamental question we can ask ourselves, and above all, we humans are really driven by our purpose.",
    projectorState: "leaf_reveal",
    season: "autumn",
    audienceState: "captions_visible",
    ceremonyState: "pivot_to_main_argument",
    estimatedDurationSec: 14,
    captionEn:
      "The reason I want to stress this point is because it's the most fundamental question we can ask ourselves, and above all, we humans are really driven by our purpose.",
  }),
  block({
    id: "science_2",
    title: "25. Citation",
    speakerText:
      'For example, a research paper compared two groups of 7,000 adults: one group consisted of individuals who had a deep sense of motivation and a very clear purpose in life, while the other group did not "open parentheses" "Alimujiang et al., 2019 " "close parentheses".\nIf people dind\'t get it: Stupid in-text citation.\nThe research suggests that simply having a clear sense of purpose can result in significantly better health outcomes and lower mortality risk.',
    projectorState: "single_leaf",
    season: "autumn",
    audienceState: "captions_visible",
    ceremonyState: "pivot_to_main_argument",
    estimatedDurationSec: 22,
    captionEn:
      'For example, a research paper compared two groups of 7,000 adults: one group consisted of individuals who had a deep sense of motivation and a very clear purpose in life, while the other group did not "open parentheses" "Alimujiang et al., 2019 " "close parentheses".\nIf people dind\'t get it: Stupid in-text citation.\nThe research suggests that simply having a clear sense of purpose can result in significantly better health outcomes and lower mortality risk.',
  }),
  block({
    id: "qr_reflection",
    title: "26. Scan QR now",
    speakerText:
      "Now, to continue my lesson, I will give you 45 seconds to scan the QR code, above if you haven't already, read through what it says carefully and try to answer honestly. When you submit your answer look up at the screen and you should see a leaf be added to this tree.",
    projectorState: "qr_reflection",
    season: "spring",
    audienceState: "captions_visible",
    ceremonyState: "reflection_prompt",
    estimatedDurationSec: 25,
    captionEn:
      "Now, to continue my lesson, I will give you 45 seconds to scan the QR code, above if you haven't already, read through what it says carefully and try to answer honestly. When you submit your answer look up at the screen and you should see a leaf be added to this tree.",
  }),
  block({
    id: "reflection_1",
    title: "27. Privacy joke",
    speakerText:
      "None of your answers can be viewed by anyone besides you.\n\nExpect if things get really bad for me later on, and I need to sell your data for some money.",
    projectorState: "leaf_placing",
    season: "spring",
    audienceState: "reflection_input",
    ceremonyState: "reflection_prompt",
    estimatedDurationSec: 14,
    captionEn:
      "None of your answers can be viewed by anyone besides you.\n\nExpect if things get really bad for me later on, and I need to sell your data for some money.",
    projectorCue: "What is the main argument of your life?",
  }),
  block({
    id: "music_joke",
    title: "28. Music",
    speakerText:
      "I am obviously way too awkward to just stand still for a few seconds, so here is some beautiful music to listen to:\n\n*Plays wrong song*\n\nOops my bad\n\n45 seconds later… (Website changes to tell them to look up)",
    projectorState: "tree_growing",
    season: "spring",
    audienceState: "response_collection",
    ceremonyState: "response_collection",
    estimatedDurationSec: 20,
    captionEn:
      "I am obviously way too awkward to just stand still for a few seconds, so here is some beautiful music to listen to:\n\n*Plays wrong song*\n\nOops my bad\n\n45 seconds later… (Website changes to tell them to look up)",
  }),
  block({
    id: "look_up_1",
    title: "29. Look up",
    speakerText:
      "Now all of you probably had a different experience in these last few seconds. Obviously I don't expect anybody here to be able to come up with the main argument/purpose of your life in that short amount of time.\n\nIf you were, I am concerned.\nSome of you might feel certain about your direction.\nSome of you might feel unsure.\nAnd honestly, both are completely normal.\nRight now, if you look up, you will see a leaf representing your answer.",
    projectorState: "tree_growing",
    season: "spring",
    audienceState: "look_up_nudge",
    ceremonyState: "return_to_speech",
    estimatedDurationSec: 22,
    captionEn:
      "Now all of you probably had a different experience in these last few seconds. Obviously I don't expect anybody here to be able to come up with the main argument/purpose of your life in that short amount of time.\n\nIf you were, I am concerned.\nSome of you might feel certain about your direction.\nSome of you might feel unsure.\nAnd honestly, both are completely normal.\nRight now, if you look up, you will see a leaf representing your answer.",
  }),
  block({
    id: "look_up_2",
    title: "30. Seasons",
    speakerText:
      "And just like the seasons, those leaves change. As time goes on, you will change, and your main argument, the purpose that drives you, may change as well.\nSo my point isn't that you need to find one purpose and hold onto it forever. My point is to live through those changes consciously, so that you are the one choosing your direction, rather than simply drifting wherever life happens to take you.",
    projectorState: "seasons_cycle",
    season: "summer",
    audienceState: "look_up_nudge",
    ceremonyState: "return_to_speech",
    estimatedDurationSec: 22,
    captionEn:
      "And just like the seasons, those leaves change. As time goes on, you will change, and your main argument, the purpose that drives you, may change as well.\nSo my point isn't that you need to find one purpose and hold onto it forever. My point is to live through those changes consciously, so that you are the one choosing your direction, rather than simply drifting wherever life happens to take you.",
    projectorCue: "Like the seasons, your leaves will change.",
  }),
  block({
    id: "closing_1",
    title: "31. Forget the words",
    speakerText:
      "After this speech, I am sure most of you will forget the words I am going to speak, just as we all forget about our Apex classes until the end of the semester.  It is very hard to considerably impact the way you think in the course of 3 minutes.\n\nI mean some people have attended classes for years, without it happening.\n\nSo I wanted to keep something that will stay with you guys after the speech.\nSo tonight, when you leave here, I want to leave you with one idea and one tool.",
    projectorState: "forest_zoom",
    season: "autumn",
    audienceState: "captions_visible",
    ceremonyState: "closing",
    estimatedDurationSec: 22,
    captionEn:
      "After this speech, I am sure most of you will forget the words I am going to speak, just as we all forget about our Apex classes until the end of the semester.  It is very hard to considerably impact the way you think in the course of 3 minutes.\n\nI mean some people have attended classes for years, without it happening.\n\nSo I wanted to keep something that will stay with you guys after the speech.\nSo tonight, when you leave here, I want to leave you with one idea and one tool.",
  }),
  block({
    id: "closing_2",
    title: "32. The tool",
    speakerText:
      "Choose who you want to become, and find the purpose that drives you. You don't have to discover it today, but keep looking for it, and be honest with yourself about what it truly is.\n\nThink of the website as a tool that can guide you and check in on you along the way, helping you stay aligned with the person you want to become and the purpose you choose to pursue. It is very simple, it will ask you to check-in from time. Every time you check-in, your leaf will change. Again, none of this is shared publicly, and by the way by listening to my speech, you agree to my terms and conditions.\n\n And obviously you can do it without the website but it just helps things stick.\nAnd if you ever see ads popup on the website, you may want to check up on me.",
    projectorState: "forest_zoom",
    season: "autumn",
    audienceState: "captions_visible",
    ceremonyState: "closing",
    estimatedDurationSec: 28,
    captionEn:
      "Choose who you want to become, and find the purpose that drives you. You don't have to discover it today, but keep looking for it, and be honest with yourself about what it truly is.\n\nThink of the website as a tool that can guide you and check in on you along the way, helping you stay aligned with the person you want to become and the purpose you choose to pursue. It is very simple, it will ask you to check-in from time. Every time you check-in, your leaf will change. Again, none of this is shared publicly, and by the way by listening to my speech, you agree to my terms and conditions.\n\n And obviously you can do it without the website but it just helps things stick.\nAnd if you ever see ads popup on the website, you may want to check up on me.",
  }),
  block({
    id: "reunion",
    title: "33. Reunion",
    speakerText:
      "Whether it's us, the class of '26, who are about to embark on our new adventures, becoming doctors, business majors, football players, and other incredible people.\nYears from now, the leaves on that tree may look completely different.\nAnd today was just one of the first of many transitional periods.\nYour goals may change.\nYour careers may change.\nEven the people you become may change.\nMaybe in years, we could reunite and see how the leaves have changed, and be proud of ourselves for actively picking who we want to become, and seeing how having a purpose means that our leaves can grow in the most beautiful way possible.",
    projectorState: "life_stages",
    season: "spring",
    audienceState: "captions_visible",
    ceremonyState: "closing",
    estimatedDurationSec: 28,
    captionEn:
      "Whether it's us, the class of '26, who are about to embark on our new adventures, becoming doctors, business majors, football players, and other incredible people.\nYears from now, the leaves on that tree may look completely different.\nAnd today was just one of the first of many transitional periods.\nYour goals may change.\nYour careers may change.\nEven the people you become may change.\nMaybe in years, we could reunite and see how the leaves have changed, and be proud of ourselves for actively picking who we want to become, and seeing how having a purpose means that our leaves can grow in the most beautiful way possible.",
  }),
  block({
    id: "end",
    title: "34. Congratulations",
    speakerText:
      "And if there is one thing I hope we take with us from tonight, it is that we never stop looking for a main argument in our lives.\nCongratulations, Class of 2026, and thank you.",
    projectorState: "end_card",
    season: "winter",
    audienceState: "closing",
    ceremonyState: "ended",
    estimatedDurationSec: 15,
    captionEn:
      "And if there is one thing I hope we take with us from tonight, it is that we never stop looking for a main argument in our lives.\nCongratulations, Class of 2026, and thank you.",
    projectorCue: "Never stop looking for the main argument in your life.",
  }),
];
