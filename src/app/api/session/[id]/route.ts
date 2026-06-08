import { NextResponse } from "next/server";
import { getSessionById } from "@/lib/seed-session";
import { getLiveState } from "@/lib/session-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = getSessionById(id);
  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }
  return NextResponse.json({
    session,
    liveState: await getLiveState(id),
  });
}
