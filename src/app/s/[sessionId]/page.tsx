import { notFound } from "next/navigation";
import { getSessionById } from "@/lib/seed-session";
import { AudienceExperience } from "@/components/AudienceExperience";

interface Props {
  params: Promise<{ sessionId: string }>;
}

export default async function AudiencePage({ params }: Props) {
  const { sessionId } = await params;
  const session = getSessionById(sessionId);
  if (!session) notFound();

  return <AudienceExperience session={session} />;
}
