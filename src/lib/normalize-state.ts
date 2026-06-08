import type { LiveSessionState, ProjectorMode, ProjectorVisualState, Season } from "./types";
import { demoSession, getSessionById } from "./seed-session";

const LEGACY_PROJECTOR: Record<string, ProjectorVisualState> = {
  dawn_still: "cosmos",
  idle: "cosmos",
  classmates_shoutout: "classmates_roll",
  veins_growing: "leaf_fragment",
  spring_bloom: "leaf_reveal",
  summer_glow: "single_leaf",
  memories_drift: "leaf_reveal",
  autumn_turn: "seasons_cycle",
  life_stage_cycle: "life_stages",
  leaf_zoom_out: "single_leaf",
  tree_forming: "tree_growing",
  final_zoom_out: "forest_zoom",
};

function normalizeProjectorState(
  raw: string | undefined,
  fallback: ProjectorVisualState
): ProjectorVisualState {
  if (!raw) return fallback;
  if (raw in LEGACY_PROJECTOR) return LEGACY_PROJECTOR[raw];
  return raw as ProjectorVisualState;
}

export function normalizeLiveState(
  raw: Partial<LiveSessionState> & { sessionId: string }
): LiveSessionState {
  const session = getSessionById(raw.sessionId) ?? demoSession;
  const section =
    session.sections.find((s) => s.id === raw.currentSectionId) ??
    session.sections[0];

  return {
    sessionId: raw.sessionId,
    currentSectionId: raw.currentSectionId ?? section.id,
    mode: raw.mode ?? "speech",
    projectorState: normalizeProjectorState(
      raw.projectorState,
      section.projectorState
    ),
    season: (raw.season as Season) ?? section.season,
    audienceState: raw.audienceState ?? section.audienceState,
    ceremonyState: raw.ceremonyState ?? section.ceremonyState,
    reflectionActive: raw.reflectionActive ?? false,
    lookUpNudge: raw.lookUpNudge ?? false,
    leafCount: raw.leafCount ?? 0,
    leafPulseAt: raw.leafPulseAt ?? 0,
    growthLevel: raw.growthLevel ?? 0,
    projectorMode: (raw.projectorMode as ProjectorMode) ?? "stage",
    timestamp: raw.timestamp ?? Date.now(),
  };
}
