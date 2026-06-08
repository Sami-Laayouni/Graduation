import { notFound } from "next/navigation";
import { getSessionById } from "@/lib/seed-session";
import { SpeakerPageClient } from "./SpeakerPageClient";

interface Props {
  params: Promise<{ sessionId: string }>;
}

export default async function SpeakerPage({ params }: Props) {
  const { sessionId } = await params;
  const session = getSessionById(sessionId);
  if (!session) notFound();

  const requiresSecret = Boolean(process.env.SPEAKER_SECRET);

  return (
    <SpeakerPageClient session={session} requiresSecret={requiresSecret} />
  );
}
