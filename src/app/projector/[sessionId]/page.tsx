import { notFound } from "next/navigation";
import { getSessionById } from "@/lib/seed-session";
import { ProjectorView } from "@/components/ProjectorView";

interface Props {
  params: Promise<{ sessionId: string }>;
}

export default async function ProjectorPage({ params }: Props) {
  const { sessionId } = await params;
  const session = getSessionById(sessionId);
  if (!session) notFound();

  return <ProjectorView session={session} />;
}
