import type {
  LiveSessionState,
  ReflectionResponse,
  SyncEvent,
  UserSession,
} from "./types";
import { demoSession, getSessionById } from "./seed-session";
import { normalizeLiveState } from "./normalize-state";
import { redis, USE_REDIS, SESSION_TTL } from "./kv";

// ── Key helpers ──────────────────────────────────────────────────────────────

const stateKey    = (id: string) => `session:${id}:state`;
const presenceKey = (id: string) => `session:${id}:presence`;

// ── In-memory fallback (local dev without Redis) ─────────────────────────────

type GlobalStore = {
  liveStates:     Map<string, LiveSessionState>;
  responses:      Map<string, ReflectionResponse[]>;
  userSessions:   Map<string, UserSession[]>;
  eventLog:       Map<string, SyncEvent[]>;
};

const globalForStore = globalThis as unknown as {
  __graduationStore?: GlobalStore;
};

function getMemStore(): GlobalStore {
  if (!globalForStore.__graduationStore) {
    globalForStore.__graduationStore = {
      liveStates:   new Map(),
      responses:    new Map(),
      userSessions: new Map(),
      eventLog:     new Map(),
    };
  }
  return globalForStore.__graduationStore;
}

// ── Initial state builder ────────────────────────────────────────────────────

function initialLiveState(sessionId: string): LiveSessionState {
  const session = getSessionById(sessionId) ?? demoSession;
  const first = session.sections[0];
  return {
    sessionId,
    currentSectionId: first.id,
    mode: "speech",
    projectorState: first.projectorState,
    season: first.season,
    audienceState: first.audienceState,
    ceremonyState: first.ceremonyState,
    reflectionActive: false,
    lookUpNudge: false,
    leafCount: 0,
    leafPulseAt: 0,
    growthLevel: 0,
    projectorMode: "stage",
    timestamp: Date.now(),
  };
}

// ── Live state ───────────────────────────────────────────────────────────────

export async function getLiveState(sessionId: string): Promise<LiveSessionState> {
  if (USE_REDIS && redis) {
    const data = await redis.get<LiveSessionState>(stateKey(sessionId));
    if (data) return normalizeLiveState(data);
    const initial = initialLiveState(sessionId);
    await redis.set(stateKey(sessionId), initial, { ex: SESSION_TTL });
    return initial;
  }

  // In-memory fallback
  const store = getMemStore();
  if (!store.liveStates.has(sessionId)) {
    store.liveStates.set(sessionId, initialLiveState(sessionId));
  }
  return normalizeLiveState(store.liveStates.get(sessionId)!);
}

export async function setLiveState(
  sessionId: string,
  state: LiveSessionState
): Promise<LiveSessionState> {
  const next = normalizeLiveState({ ...state, timestamp: Date.now() });

  if (USE_REDIS && redis) {
    await redis.set(stateKey(sessionId), next, { ex: SESSION_TTL });
    return next;
  }

  // In-memory fallback
  getMemStore().liveStates.set(sessionId, next);
  broadcastMemState(sessionId, next);
  return next;
}

// ── Presence ─────────────────────────────────────────────────────────────────

export async function registerUserSession(userSession: UserSession): Promise<void> {
  if (USE_REDIS && redis) {
    const raw = await redis.get<UserSession[]>(presenceKey(userSession.sessionId));
    const list: UserSession[] = raw ?? [];
    const idx = list.findIndex((u) => u.id === userSession.id);
    if (idx >= 0) list[idx] = userSession;
    else list.push(userSession);
    await redis.set(presenceKey(userSession.sessionId), list, { ex: SESSION_TTL });
    return;
  }

  const store = getMemStore();
  const list = store.userSessions.get(userSession.sessionId) ?? [];
  const idx = list.findIndex((u) => u.id === userSession.id);
  if (idx >= 0) list[idx] = userSession;
  else list.push(userSession);
  store.userSessions.set(userSession.sessionId, list);
}

export async function touchUserSession(
  sessionId: string,
  userSessionId: string
): Promise<void> {
  if (USE_REDIS && redis) {
    const raw = await redis.get<UserSession[]>(presenceKey(sessionId));
    if (!raw) return;
    const item = raw.find((u) => u.id === userSessionId);
    if (item) {
      item.lastSeenAt = new Date().toISOString();
      await redis.set(presenceKey(sessionId), raw, { ex: SESSION_TTL });
    }
    return;
  }

  const list = getMemStore().userSessions.get(sessionId) ?? [];
  const item = list.find((u) => u.id === userSessionId);
  if (item) item.lastSeenAt = new Date().toISOString();
}

export async function getConnectedCounts(sessionId: string): Promise<{
  audience: number;
  speaker: number;
  projector: number;
  total: number;
}> {
  const cutoff = Date.now() - 60_000;

  let list: UserSession[] = [];
  if (USE_REDIS && redis) {
    list = (await redis.get<UserSession[]>(presenceKey(sessionId))) ?? [];
  } else {
    list = getMemStore().userSessions.get(sessionId) ?? [];
  }

  const active   = list.filter((u) => new Date(u.lastSeenAt).getTime() > cutoff);
  const audience  = active.filter((u) => u.deviceType === "audience").length;
  const speaker   = active.filter((u) => u.deviceType === "speaker").length;
  const projector = active.filter((u) => u.deviceType === "projector").length;
  return { audience, speaker, projector, total: active.length };
}

// ── Leaf count helpers (mutate liveState) ────────────────────────────────────

export async function incrementLeafCount(sessionId: string): Promise<number> {
  const state = await getLiveState(sessionId);
  const next = {
    ...state,
    leafCount:   state.leafCount + 1,
    leafPulseAt: Date.now(),
  };
  await setLiveState(sessionId, next);
  return next.leafCount;
}

export async function resetLeafCount(sessionId: string): Promise<void> {
  const state = await getLiveState(sessionId);
  await setLiveState(sessionId, { ...state, leafCount: 0, leafPulseAt: Date.now() });
}

// ── Event log (best-effort, in-memory only — not critical) ───────────────────

export async function pushEvent(sessionId: string, event: SyncEvent): Promise<void> {
  const store = getMemStore();
  const log = store.eventLog.get(sessionId) ?? [];
  log.push(event);
  if (log.length > 100) log.shift();
  store.eventLog.set(sessionId, log);
}

// ── Responses (in-memory; not exposed to frontend, purely for analytics) ─────

export async function addResponse(response: ReflectionResponse): Promise<void> {
  const store = getMemStore();
  const list = store.responses.get(response.sessionId) ?? [];
  list.push(response);
  store.responses.set(response.sessionId, list);
}

// ── In-memory SSE broadcast (local dev only) ─────────────────────────────────

type MemSseStore = {
  sseControllers: Map<string, Set<ReadableStreamDefaultController>>;
};

const globalForSse = globalThis as unknown as { __graduationSse?: MemSseStore };

function getSseStore(): MemSseStore {
  if (!globalForSse.__graduationSse) {
    globalForSse.__graduationSse = { sseControllers: new Map() };
  }
  return globalForSse.__graduationSse;
}

export function registerSse(
  sessionId: string,
  controller: ReadableStreamDefaultController
): void {
  const store = getSseStore();
  if (!store.sseControllers.has(sessionId)) {
    store.sseControllers.set(sessionId, new Set());
  }
  store.sseControllers.get(sessionId)!.add(controller);
}

export function unregisterSse(
  sessionId: string,
  controller: ReadableStreamDefaultController
): void {
  getSseStore().sseControllers.get(sessionId)?.delete(controller);
}

function broadcastMemState(sessionId: string, state: LiveSessionState): void {
  const controllers = getSseStore().sseControllers.get(sessionId);
  if (!controllers?.size) return;
  const payload = `data: ${JSON.stringify(state)}\n\n`;
  const encoded = new TextEncoder().encode(payload);
  for (const controller of controllers) {
    try {
      controller.enqueue(encoded);
    } catch {
      controllers.delete(controller);
    }
  }
}
