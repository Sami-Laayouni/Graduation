import { NextResponse } from "next/server";
import { getLeaves, clearLeaves } from "@/lib/leaf-db";
import { dnaFromRecords } from "@/lib/leaf-dna";
import { getSessionById } from "@/lib/seed-session";
import { resetLeafCount } from "@/lib/session-store";

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

/** DELETE — requires speaker secret. Wipes all leaves for this session. */
export async function DELETE(
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

  await clearLeaves(id);
  await resetLeafCount(id);
  return NextResponse.json({ ok: true, cleared: true });
}
