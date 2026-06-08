import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import type { LanguageCode } from "@/lib/types";
import {
  getConnectedCounts,
  registerUserSession,
  touchUserSession,
} from "@/lib/session-store";
import { getSessionById } from "@/lib/seed-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return NextResponse.json(await getConnectedCounts(id));
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!getSessionById(id)) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  let body: {
    userSessionId?: string;
    deviceType: "audience" | "speaker" | "projector";
    languageCode?: LanguageCode;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const uid = body.userSessionId ?? uuidv4();
  const now = new Date().toISOString();

  await registerUserSession({
    id: uid,
    sessionId: id,
    deviceType: body.deviceType,
    languageCode: body.languageCode,
    connectedAt: now,
    lastSeenAt: now,
  });

  return NextResponse.json({
    userSessionId: uid,
    counts: await getConnectedCounts(id),
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  let userSessionId: string | undefined;
  try {
    const body = await request.json();
    userSessionId = body?.userSessionId;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (userSessionId) await touchUserSession(id, userSessionId);
  return NextResponse.json(await getConnectedCounts(id));
}
