/**
 * Generates realistic demo leaf records for speaker preview (full tree test).
 */
import { v4 as uuidv4 } from "uuid";
import type { LanguageCode, LeafRecord } from "./types";
import { seedFromId } from "./leaf-dna";

const DEMO_PURPOSES: string[] = [
  "Help people feel less alone",
  "Become a doctor and serve my community",
  "Build something that outlasts me",
  "Keep learning for the rest of my life",
  "Make my family proud",
  "Travel and understand the world",
  "Create art that moves people",
  "Fight for justice and fairness",
  "Raise children who feel loved",
  "Start a business that solves real problems",
  "Heal the planet, one step at a time",
  "Be the friend who always shows up",
  "Master a craft and teach it to others",
  "Find peace inside myself first",
  "Lead with honesty, even when it's hard",
  "Explore medicine and research",
  "Play football at the highest level I can",
  "Study business and build something meaningful",
  "Write stories worth remembering",
  "Make people laugh when they need it",
  "Serve my country with integrity",
  "Design technology that helps, not harms",
  "Stay curious no matter how old I get",
  "Support mental health in my community",
  "Be kinder than I was yesterday",
  "Chase excellence, not perfection",
  "Protect the people I love",
  "Leave every place better than I found it",
  "Listen more than I speak",
  "Turn pain into purpose",
  "Build bridges between different worlds",
  "Stand up for those who can't",
  "Live simply and give generously",
  "Never stop asking the hard questions",
  "Make science accessible to everyone",
  "Coach the next generation",
  "Find beauty in ordinary days",
  "Keep my word",
  "Grow through discomfort",
  "Choose courage over comfort",
];

const LANGS: LanguageCode[] = ["en", "fr", "ar"];

export function buildDemoLeafRecords(sessionId: string, count: number): LeafRecord[] {
  const baseMs = Date.now();
  const records: LeafRecord[] = [];

  for (let i = 0; i < count; i++) {
    const id = uuidv4();
    records.push({
      id,
      sessionId,
      userSessionId: uuidv4(),
      argumentText: DEMO_PURPOSES[i % DEMO_PURPOSES.length],
      languageCode: LANGS[i % LANGS.length],
      createdAt: new Date(baseMs + i * 137).toISOString(),
      leafSeed: seedFromId(id),
      isPublic: false,
    });
  }

  return records;
}
