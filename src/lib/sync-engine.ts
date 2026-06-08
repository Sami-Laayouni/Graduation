import type { LiveSessionState, ProjectorVisualState, SpeechSection, SyncEvent, SyncEventType } from "./types";
import { getSessionById } from "./seed-session";

const TREE_VISUALS: ProjectorVisualState[] = [
  "tree_growing",
  "reflection_bloom",
  "seasons_cycle",
  "forest_zoom",
  "life_stages",
  "end_card",
];

function growthLevelForSection(
  sections: SpeechSection[],
  section: SpeechSection
): number {
  if (!TREE_VISUALS.includes(section.projectorState)) return 0;
  const treeStart = sections.findIndex((s) =>
    TREE_VISUALS.includes(s.projectorState)
  );
  if (treeStart < 0) return 0;
  const idx = sections.findIndex((s) => s.id === section.id);
  const treeSpan = sections.length - treeStart - 1;
  if (treeSpan <= 0) return 100;
  const progress = (idx - treeStart) / treeSpan;
  return Math.round(Math.min(1, Math.max(0, progress)) * 100);
}

import {
  getLiveState,
  incrementLeafCount,
  pushEvent,
  setLiveState,
} from "./session-store";

function sectionIndex(sessionId: string, sectionId: string): number {
  const session = getSessionById(sessionId);
  if (!session) return -1;
  return session.sections.findIndex((s) => s.id === sectionId);
}

async function applySection(sessionId: string, sectionId: string): Promise<LiveSessionState> {
  const session = getSessionById(sessionId);
  if (!session) throw new Error("Session not found");
  const section = session.sections.find((s) => s.id === sectionId);
  if (!section) throw new Error("Section not found");

  const growthLevel = growthLevelForSection(session.sections, section);

  const current = await getLiveState(sessionId);
  return setLiveState(sessionId, {
    ...current,
    currentSectionId: section.id,
    projectorState: section.projectorState,
    season: section.season,
    audienceState: section.audienceState,
    ceremonyState: section.ceremonyState,
    growthLevel,
    reflectionActive:
      section.audienceState === "reflection_input" ||
      section.audienceState === "response_collection",
    lookUpNudge: section.audienceState === "look_up_nudge",
    mode:
      section.audienceState === "reflection_input"
        ? "reflection"
        : section.ceremonyState === "ended"
          ? "ended"
          : "speech",
  });
}

export async function processSyncEvent(
  sessionId: string,
  type: SyncEventType,
  payload?: SyncEvent["payload"]
): Promise<LiveSessionState> {
  const event: SyncEvent = {
    type,
    sessionId,
    payload,
    timestamp: Date.now(),
  };
  await pushEvent(sessionId, event);

  const session = getSessionById(sessionId);
  if (!session) throw new Error("Session not found");

  const current = await getLiveState(sessionId);
  const idx = sectionIndex(sessionId, current.currentSectionId);

  switch (type) {
    case "SESSION_START":
      return setLiveState(sessionId, { ...current, mode: "speech" });

    case "SECTION_NEXT": {
      const next = session.sections[Math.min(idx + 1, session.sections.length - 1)];
      return applySection(sessionId, next.id);
    }

    case "SECTION_PREVIOUS": {
      const prev = session.sections[Math.max(idx - 1, 0)];
      return applySection(sessionId, prev.id);
    }

    case "SECTION_JUMP": {
      if (!payload?.sectionId) throw new Error("sectionId required");
      return applySection(sessionId, payload.sectionId);
    }

    case "SHOW_REFLECTION": {
      const qr = session.sections.find((s) => s.id === "qr_reflection");
      if (qr) return applySection(sessionId, qr.id);
      const reflection = session.sections.find((s) => s.id === "reflection_1");
      if (reflection) return applySection(sessionId, reflection.id);
      return setLiveState(sessionId, {
        ...current,
        reflectionActive: true,
        mode: "reflection",
        audienceState: "reflection_input",
        projectorState: "reflection_bloom",
        season: "spring",
      });
    }

    case "HIDE_REFLECTION": {
      const returnSection = session.sections.find((s) => s.id === "look_up_1");
      if (returnSection) return applySection(sessionId, returnSection.id);
      return setLiveState(sessionId, {
        ...current,
        reflectionActive: false,
        mode: "speech",
        audienceState: "captions_visible",
      });
    }

    case "LEAF_ADDED": {
      await incrementLeafCount(sessionId);
      return getLiveState(sessionId);
    }

    case "END_SESSION": {
      const end = session.sections.find((s) => s.id === "end") ?? session.sections.at(-1)!;
      return applySection(sessionId, end.id);
    }

    case "RESET_SESSION": {
      const first = session.sections[0];
      return setLiveState(sessionId, {
        ...await applySection(sessionId, first.id),
        leafCount: 0,
        leafPulseAt: 0,
        growthLevel: 0,
        mode: "speech",
      });
    }

    case "SET_PROJECTOR_MODE": {
      const pm = payload?.projectorMode;
      if (!pm) return current;
      return setLiveState(sessionId, { ...current, projectorMode: pm });
    }

    default:
      return current;
  }
}
