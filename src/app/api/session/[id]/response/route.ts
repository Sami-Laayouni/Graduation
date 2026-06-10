import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import type { LanguageCode } from "@/lib/types";
import { addResponse, incrementLeafCount } from "@/lib/session-store";
import { getSessionById } from "@/lib/seed-session";
import { saveLeaf, updateLeaf, getLeafByUserSession } from "@/lib/leaf-db";
import { seedFromId, dnaFromRecord } from "@/lib/leaf-dna";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ── POST: create a new leaf response ────────────────────────────────────────

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!getSessionById(id)) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  let body: {
    userSessionId: string;
    promptId:      string;
    responseText:  string;
    languageCode:  LanguageCode;
    isPublic?:     boolean;
    username?:     string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { userSessionId, promptId, responseText, languageCode, isPublic, username } = body;

  if (!userSessionId || !promptId || !responseText?.trim()) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const leafId   = uuidv4();
  const now      = new Date().toISOString();
  const leafSeed = seedFromId(leafId);

  const record = {
    id:           leafId,
    sessionId:    id,
    userSessionId,
    argumentText: responseText.trim(),
    languageCode: languageCode ?? "en",
    createdAt:    now,
    leafSeed,
    isPublic:     isPublic ?? false,
    username:     isPublic && username?.trim() ? username.trim() : undefined,
  };

  await saveLeaf(record);

  await addResponse({
    id:           leafId,
    sessionId:    id,
    userSessionId,
    promptId,
    responseText: responseText.trim(),
    languageCode: languageCode ?? "en",
    createdAt:    now,
    saveForLater: true,
  });

  const leafCount = await incrementLeafCount(id);
  const dna       = dnaFromRecord(record);

  return NextResponse.json({ ok: true, leafCount, leafId, leafSeed, dna });
}

// ── PATCH: update goal text, public status, or username ─────────────────────

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!getSessionById(id)) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  let body: {
    userSessionId: string;
    responseText?: string;
    isPublic?:     boolean;
    username?:     string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { userSessionId, responseText, isPublic, username } = body;
  if (!userSessionId) {
    return NextResponse.json({ error: "Missing userSessionId" }, { status: 400 });
  }

  const fields: Parameters<typeof updateLeaf>[1] = {};
  if (responseText?.trim()) {
    fields.argumentText = responseText.trim();
    const existing = await getLeafByUserSession(userSessionId, id);
    if (existing) {
      fields.leafSeed = seedFromId(`${existing.id}:${responseText.trim()}`);
    }
  }
  if (isPublic !== undefined) fields.isPublic     = isPublic;
  if (username !== undefined) fields.username     = username?.trim() || undefined;

  const updated = await updateLeaf(userSessionId, fields, id);
  if (!updated) {
    return NextResponse.json({ error: "Leaf not found" }, { status: 404 });
  }

  const dna = dnaFromRecord(updated);
  return NextResponse.json({ ok: true, dna });
}

// ── GET: retrieve this user's existing leaf (for returning visitors) ─────────

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!getSessionById(id)) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const uid  = new URL(request.url).searchParams.get("userSessionId");
  if (!uid)  return NextResponse.json({ leaf: null });

  const leaf = await getLeafByUserSession(uid, id);
  if (!leaf || leaf.sessionId !== id) return NextResponse.json({ leaf: null });

  return NextResponse.json({ leaf: dnaFromRecord(leaf), argumentText: leaf.argumentText });
}
