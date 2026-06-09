import { NextResponse } from "next/server";
import { getLiveState } from "@/lib/session-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const since = Number(new URL(request.url).searchParams.get("since") ?? 0);
  const state = await getLiveState(id);

  if (since > 0 && state.timestamp <= since) {
    return NextResponse.json({ unchanged: true, timestamp: state.timestamp });
  }

  return NextResponse.json(state);
}
