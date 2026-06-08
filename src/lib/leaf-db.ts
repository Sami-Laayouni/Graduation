/**
 * Leaf persistence layer.
 * Production: Upstash Redis / Vercel KV.
 * Local dev (no Redis creds): plain JSON file under data/leaves.json.
 */
import type { LeafRecord } from "./types";
import { redis, USE_REDIS, SESSION_TTL } from "./kv";

// ── Redis helpers ─────────────────────────────────────────────────────────────

const leavesKey = (sessionId: string) => `session:${sessionId}:leaves`;

async function redisGetLeaves(sessionId: string): Promise<LeafRecord[]> {
  const data = await redis!.get<LeafRecord[]>(leavesKey(sessionId));
  return data ?? [];
}

async function redisPutLeaves(sessionId: string, leaves: LeafRecord[]): Promise<void> {
  await redis!.set(leavesKey(sessionId), leaves, { ex: SESSION_TTL });
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
  const tmp = LEAF_FILE + ".tmp";
  try {
    writeFileSync(tmp, JSON.stringify(leaves, null, 2), "utf8");
    writeFileSync(LEAF_FILE, JSON.stringify(leaves, null, 2), "utf8");
  } catch { /* ignore */ }
}

function fsFlushQueue() {
  if (_writing || _queue.length === 0) return;
  _writing = true;
  const batch = _queue.splice(0, _queue.length);
  const all = fsLoadAll();
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
    const leaves = await redisGetLeaves(leaf.sessionId);
    if (!leaves.find(l => l.id === leaf.id)) {
      leaves.push(leaf);
      await redisPutLeaves(leaf.sessionId, leaves);
    }
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
  sessionId?: string,
): Promise<LeafRecord | null> {
  if (USE_REDIS && redis) {
    // We need to search across all leaves; if sessionId provided, scope it
    const sid = sessionId ?? "demo";
    const leaves = await redisGetLeaves(sid);
    const idx = leaves.findLastIndex(l => l.userSessionId === userSessionId);
    if (idx < 0) return null;
    leaves[idx] = { ...leaves[idx], ...fields, updatedAt: fields.updatedAt ?? new Date().toISOString() };
    await redisPutLeaves(sid, leaves);
    return leaves[idx];
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
  sessionId?: string,
): Promise<LeafRecord | null> {
  if (USE_REDIS && redis) {
    const sid = sessionId ?? "demo";
    const leaves = await redisGetLeaves(sid);
    for (let i = leaves.length - 1; i >= 0; i--) {
      if (leaves[i].userSessionId === userSessionId) return leaves[i];
    }
    return null;
  }

  const all = fsLoadAll();
  for (let i = all.length - 1; i >= 0; i--) {
    if (all[i].userSessionId === userSessionId) return all[i];
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
  return (await getLeaves(sessionId)).length;
}

export async function clearLeaves(sessionId: string): Promise<void> {
  if (USE_REDIS && redis) {
    await redis.del(leavesKey(sessionId));
    return;
  }

  const all = fsLoadAll();
  _cache = all.filter(l => l.sessionId !== sessionId);
  fsPersist(_cache);
}
