import { NextResponse } from "next/server";
import { getLeaves, clearLeaves, seedDemoLeaves, getLeafCount } from "@/lib/leaf-db";
import { dnaFromRecords } from "@/lib/leaf-dna";
import { getSessionById } from "@/lib/seed-session";
import { getLiveState, resetLeafCount, setLiveState } from "@/lib/session-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const records = await getLeaves(id);
  const dnas    = dnaFromRecords(records);
  return NextResponse.json({ leaves: dnas, total: dnas.length });
}

/** POST — append demo leaves for speaker preview (each with unique DNA) */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!getSessionById(id)) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  let count = 100;
  try {
    const body = await request.json();
    if (typeof body?.count === "number" && body.count > 0) {
      count = Math.min(200, Math.floor(body.count));
    }
  } catch {
    /* default 100 */
  }

  const added = await seedDemoLeaves(id, count);
  const total = await getLeafCount(id);
  const state = await getLiveState(id);
  await setLiveState(id, {
    ...state,
    leafCount: total,
    leafPulseAt: Date.now(),
  });

  return NextResponse.json({ ok: true, added, total });
}

/** DELETE — wipes all leaves for this session. */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!getSessionById(id)) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  await clearLeaves(id);
  await resetLeafCount(id);
  return NextResponse.json({ ok: true, cleared: true });
}
