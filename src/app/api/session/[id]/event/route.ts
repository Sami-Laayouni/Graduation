import { NextResponse } from "next/server";
import type { SyncEventType } from "@/lib/types";
import { processSyncEvent } from "@/lib/sync-engine";
import { getSessionById } from "@/lib/seed-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!getSessionById(id)) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const secret = process.env.SPEAKER_SECRET;
  if (secret) {
    const auth = request.headers.get("x-speaker-secret");
    if (auth !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  let body: { type: SyncEventType; payload?: { sectionId?: string } };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  try {
    const state = await processSyncEvent(id, body.type, body.payload);
    return NextResponse.json(state);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
