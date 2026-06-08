export type LanguageCode = "en" | "fr" | "ar";

export type SessionStatus = "draft" | "live" | "ended";

export type ExperienceMode =
  | "speech"
  | "reflection"
  | "ended";

export type CeremonyState =
  | "boot"
  | "intro"
  | "storytelling"
  | "pivot_to_main_argument"
  | "reflection_prompt"
  | "response_collection"
  | "return_to_speech"
  | "closing"
  | "ended";

export type Season = "winter" | "spring" | "summer" | "autumn";

export type ProjectorVisualState =
  | "qr_intro"
  | "qr_reflection"
  | "cosmos"
  | "classmates_roll"
  | "leaf_fragment"
  | "leaf_reveal"
  | "single_leaf"
  | "tree_growing"
  | "reflection_bloom"
  | "leaf_placing"
  | "seasons_cycle"
  | "forest_zoom"
  | "life_stages"
  | "end_card";

export type AudienceVisualState =
  | "captions_visible"
  | "look_up_nudge"
  | "reflection_input"
  | "response_collection"
  | "reflection_done"
  | "closing";

export interface TranslationBlock {
  captionText: string;
  projectorCue?: string;
  reflectionPrompt?: string;
  ctaText?: string;
}

export interface SpeechSection {
  id: string;
  title: string;
  speakerText: string;
  projectorState: ProjectorVisualState;
  season: Season;
  audienceState: AudienceVisualState;
  ceremonyState: CeremonyState;
  estimatedDurationSec: number;
  translations: Record<LanguageCode, TranslationBlock>;
}

export interface ReflectionPrompt {
  id: string;
  promptKey: string;
  inputType: "short_text" | "single_choice";
  texts: Record<LanguageCode, string>;
}

export interface SessionContent {
  id: string;
  slug: string;
  title: string;
  eventDate: string;
  status: SessionStatus;
  sections: SpeechSection[];
  reflectionPrompts: ReflectionPrompt[];
  projectorCues: Record<LanguageCode, Record<string, string>>;
}

export type ProjectorMode = "stage" | "personal";

export interface LiveSessionState {
  sessionId: string;
  currentSectionId: string;
  mode: ExperienceMode;
  projectorState: ProjectorVisualState;
  season: Season;
  audienceState: AudienceVisualState;
  ceremonyState: CeremonyState;
  reflectionActive: boolean;
  lookUpNudge: boolean;
  leafCount: number;
  /** Timestamp of last leaf added — triggers projector pop animation + sound */
  leafPulseAt: number;
  /** 0–100 how full the tree canopy should appear */
  growthLevel: number;
  /** stage = projector is the shared screen; personal = each phone is the experience */
  projectorMode: ProjectorMode;
  timestamp: number;
}

export type SyncEventType =
  | "SESSION_START"
  | "SECTION_NEXT"
  | "SECTION_PREVIOUS"
  | "SECTION_JUMP"
  | "SHOW_REFLECTION"
  | "HIDE_REFLECTION"
  | "END_SESSION"
  | "RESET_SESSION"
  | "LEAF_ADDED"
  | "SET_PROJECTOR_MODE";

export interface SyncEvent {
  type: SyncEventType;
  sessionId: string;
  payload?: {
    sectionId?: string;
    leafCount?: number;
    projectorMode?: ProjectorMode;
  };
  timestamp: number;
}

export interface ReflectionResponse {
  id: string;
  sessionId: string;
  userSessionId: string;
  promptId: string;
  responseText: string;
  languageCode: LanguageCode;
  createdAt: string;
  saveForLater: boolean;
}

/**
 * A leaf permanently written to disk.
 * leafSeed is a uint32 derived deterministically from the leaf's UUID —
 * so the visual always renders identically no matter what year it is.
 */
export interface LeafRecord {
  id: string;
  sessionId: string;
  userSessionId: string;
  argumentText: string;
  languageCode: LanguageCode;
  createdAt: string;
  leafSeed: number;
  /** Whether this leaf appears publicly on the shared tree view */
  isPublic?: boolean;
  /** Display name chosen by the audience member (only stored if isPublic) */
  username?: string;
  /** ISO timestamp of last goal update */
  updatedAt?: string;
}

/**
 * Rendering properties derived from leafSeed — pure computation, no DB needed.
 * Store the seed; recompute this on every render.
 */
export interface LeafDNA {
  id: string;
  createdAt: string;
  seed: number;
  canopyAngle:  number;
  radiusMul:    number;
  rxMul:        number;
  ryMul:        number;
  scale:        number;
  brightOffset: number;
  veinLines:    number;
  /** Hue in degrees (0–360) for a subtle color tint — low saturation keeps it near B&W */
  hue:          number;
  /** Saturation 0–1 (kept very low, ~0.10–0.28, so leaves read as near-monochrome) */
  hueSat:       number;
  /** Whether the leaf appears on the public tree */
  isPublic?:    boolean;
  /** Public display name */
  username?:    string;
}

export interface UserSession {
  id: string;
  sessionId: string;
  deviceType: "audience" | "speaker" | "projector";
  languageCode?: LanguageCode;
  connectedAt: string;
  lastSeenAt: string;
}
