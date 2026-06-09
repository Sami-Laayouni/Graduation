/**
 * Leaf persistence layer.
 *
 * Production (Redis):
 *   Uses a Redis List per session so RPUSH appends are atomic — no race
 *   conditions when hundreds of people submit at the same moment.
 *   LSET for point-updates is also atomic.
 *
 * Local dev (no Redis creds):
 *   Falls back to a plain JSON file under data/leaves.json.
 */
import type { LeafRecord } from "./types";
import { redis, USE_REDIS, SESSION_TTL } from "./kv";
import { buildDemoLeafRecords } from "./seed-demo-leaves";
import { resolveLeafSeed } from "./leaf-dna";

// ── Redis List helpers ────────────────────────────────────────────────────────

/** Each element in the list is a LeafRecord (Upstash auto-serializes/deserializes JSON) */
const leafListKey = (sessionId: string) => `session:${sessionId}:leafList`;

/**
 * Upstash @upstash/redis automatically deserializes JSON values stored in Redis
 * lists. This means items returned by lrange are already parsed objects, NOT
 * raw JSON strings. Calling JSON.parse on an already-parsed object would give
 * JSON.parse("[object Object]") → SyntaxError. This helper handles both old
 * data (stored as a raw JSON string before this fix) and new data (stored as
 * an object via Upstash auto-serialization).
 */
function normalizeLeafRecord(raw: Partial<LeafRecord> & Pick<LeafRecord, "id">): LeafRecord {
  const leafSeed = resolveLeafSeed(raw.id, raw.leafSeed);
  return { ...raw, leafSeed } as LeafRecord;
}

function parseLeafItem(item: unknown): LeafRecord {
  if (typeof item === "string") {
    try { return normalizeLeafRecord(JSON.parse(item) as LeafRecord); } catch { /* fall through */ }
  }
  return normalizeLeafRecord(item as LeafRecord);
}

async function redisSaveLeaf(leaf: LeafRecord): Promise<void> {
  // Pass the object directly — let @upstash/redis handle JSON serialization.
  // RPUSH is atomic — safe under concurrent load.
  await redis!.rpush(leafListKey(leaf.sessionId), leaf as unknown as string);
  // Refresh TTL on every write
  await redis!.expire(leafListKey(leaf.sessionId), SESSION_TTL);
}

async function redisGetLeaves(sessionId: string): Promise<LeafRecord[]> {
  const items = await redis!.lrange(leafListKey(sessionId), 0, -1);
  return items.map(parseLeafItem);
}

async function redisGetLeafCount(sessionId: string): Promise<number> {
  return redis!.llen(leafListKey(sessionId));
}

async function redisUpdateLeaf(
  sessionId: string,
  userSessionId: string,
  fields: Partial<Pick<LeafRecord, "argumentText" | "isPublic" | "username" | "updatedAt">>,
): Promise<LeafRecord | null> {
  const key   = leafListKey(sessionId);
  const items = await redis!.lrange(key, 0, -1);
  // Find the last submission by this user
  let targetIdx = -1;
  for (let i = items.length - 1; i >= 0; i--) {
    const leaf = parseLeafItem(items[i]);
    if (leaf.userSessionId === userSessionId) { targetIdx = i; break; }
  }
  if (targetIdx < 0) return null;
  const leaf    = parseLeafItem(items[targetIdx]);
  const updated = { ...leaf, ...fields, updatedAt: fields.updatedAt ?? new Date().toISOString() };
  // LSET is an atomic point-update — no full-list rewrite needed.
  // Pass the object directly so @upstash/redis serializes it consistently.
  await redis!.lset(key, targetIdx, updated as unknown as string);
  return updated;
}

// ── File-system fallback (local dev) ─────────────────────────────────────────

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

const DATA_DIR  = join(process.cwd(), "data");
const LEAF_FILE = join(DATA_DIR, "leaves.json");

let _cache: LeafRecord[] | null = null;
let _writing = false;
const _queue: LeafRecord[] = [];

function ensureDataDir() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
}

function fsLoadAll(): LeafRecord[] {
  if (_cache) return _cache;
  ensureDataDir();
  if (!existsSync(LEAF_FILE)) { _cache = []; return _cache; }
  try { _cache = JSON.parse(readFileSync(LEAF_FILE, "utf8")) as LeafRecord[]; }
  catch { _cache = []; }
  return _cache;
}

function fsPersist(leaves: LeafRecord[]) {
  ensureDataDir();
  try {
    writeFileSync(LEAF_FILE + ".tmp", JSON.stringify(leaves, null, 2), "utf8");
    writeFileSync(LEAF_FILE,          JSON.stringify(leaves, null, 2), "utf8");
  } catch { /* ignore */ }
}

function fsFlushQueue() {
  if (_writing || _queue.length === 0) return;
  _writing = true;
  const batch = _queue.splice(0, _queue.length);
  const all   = fsLoadAll();
  for (const leaf of batch) {
    if (!all.find(l => l.id === leaf.id)) all.push(leaf);
  }
  fsPersist(all);
  _writing = false;
  if (_queue.length > 0) fsFlushQueue();
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function saveLeaf(leaf: LeafRecord): Promise<void> {
  if (USE_REDIS && redis) {
    await redisSaveLeaf(leaf);
    return;
  }
  const all = fsLoadAll();
  if (!all.find(l => l.id === leaf.id)) all.push(leaf);
  _queue.push(leaf);
  setImmediate(fsFlushQueue);
}

export async function updateLeaf(
  userSessionId: string,
  fields: Partial<Pick<LeafRecord, "argumentText" | "isPublic" | "username" | "updatedAt">>,
  sessionId = "demo",
): Promise<LeafRecord | null> {
  if (USE_REDIS && redis) {
    return redisUpdateLeaf(sessionId, userSessionId, fields);
  }
  const all = fsLoadAll();
  const idx = all.findLastIndex(l => l.userSessionId === userSessionId);
  if (idx < 0) return null;
  all[idx] = { ...all[idx], ...fields, updatedAt: fields.updatedAt ?? new Date().toISOString() };
  fsPersist(all);
  return all[idx];
}

export async function getLeafByUserSession(
  userSessionId: string,
  sessionId = "demo",
): Promise<LeafRecord | null> {
  const leaves = await getLeaves(sessionId);
  for (let i = leaves.length - 1; i >= 0; i--) {
    if (leaves[i].userSessionId === userSessionId) return leaves[i];
  }
  return null;
}

export async function getLeaves(sessionId?: string): Promise<LeafRecord[]> {
  if (USE_REDIS && redis) {
    if (!sessionId) return [];
    return redisGetLeaves(sessionId);
  }
  const all = fsLoadAll();
  if (!sessionId) return all;
  return all.filter(l => l.sessionId === sessionId);
}

export async function getLeafCount(sessionId: string): Promise<number> {
  if (USE_REDIS && redis) {
    return redisGetLeafCount(sessionId);
  }
  return (await getLeaves(sessionId)).length;
}

export async function clearLeaves(sessionId: string): Promise<void> {
  if (USE_REDIS && redis) {
    await redis.del(leafListKey(sessionId));
    return;
  }
  const all = fsLoadAll();
  _cache = all.filter(l => l.sessionId !== sessionId);
  fsPersist(_cache);
}

/** Append demo leaves — each with unique DNA, as if submitted by real audience members */
export async function seedDemoLeaves(sessionId: string, count = 100): Promise<number> {
  const leaves = buildDemoLeafRecords(sessionId, count);
  if (leaves.length === 0) return 0;

  if (USE_REDIS && redis) {
    const key = leafListKey(sessionId);
    const pipe = redis.pipeline();
    for (const leaf of leaves) {
      // Explicit JSON so leafSeed is never dropped by batch pipeline serialization
      pipe.rpush(key, JSON.stringify(leaf));
    }
    pipe.expire(key, SESSION_TTL);
    await pipe.exec();
    return leaves.length;
  }

  const all = fsLoadAll();
  for (const leaf of leaves) {
    if (!all.find((l) => l.id === leaf.id)) all.push(leaf);
  }
  _cache = all;
  fsPersist(all);
  return leaves.length;
}
