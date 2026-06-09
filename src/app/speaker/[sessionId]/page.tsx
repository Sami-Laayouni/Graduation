import { notFound } from "next/navigation";
import { getSessionById } from "@/lib/seed-session";
import { SpeakerDashboard } from "@/components/SpeakerDashboard";

interface Props {
  params: Promise<{ sessionId: string }>;
}

export default async function SpeakerPage({ params }: Props) {
  const { sessionId } = await params;
  const session = getSessionById(sessionId);
  if (!session) notFound();

  return <SpeakerDashboard session={session} />;
}
