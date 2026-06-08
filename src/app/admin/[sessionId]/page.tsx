"use client";

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getSessionById } from "@/lib/seed-session";
import type { LiveSessionState } from "@/lib/types";

interface Props {
  params: Promise<{ sessionId: string }>;
}

export default function AdminPage({ params }: Props) {
  const { sessionId } = use(params);
  const session = getSessionById(sessionId);
  const [liveState, setLiveState] = useState<LiveSessionState | null>(null);
  const [counts, setCounts] = useState({
    audience: 0,
    speaker: 0,
    projector: 0,
    total: 0,
  });

  if (!session) notFound();

  useEffect(() => {
    async function load() {
      const [stateRes, presenceRes] = await Promise.all([
        fetch(`/api/session/${sessionId}/state`),
        fetch(`/api/session/${sessionId}/presence`),
      ]);
      if (stateRes.ok) setLiveState(await stateRes.json());
      if (presenceRes.ok) setCounts(await presenceRes.json());
    }
    load();
    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, [sessionId]);

  return (
    <main className="min-h-dvh p-6 md:p-10 max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="font-serif text-3xl text-ceremony-accent">Admin</h1>
        <p className="text-ceremony-dim">{session.title}</p>
      </header>

      <section className="rounded-2xl border border-white/10 p-6 space-y-4">
        <h2 className="text-sm uppercase tracking-widest text-ceremony-muted">
          Live state
        </h2>
        <pre className="text-xs overflow-auto bg-black/40 p-4 rounded-xl">
          {JSON.stringify(liveState, null, 2)}
        </pre>
      </section>

      <section className="rounded-2xl border border-white/10 p-6">
        <h2 className="text-sm uppercase tracking-widest text-ceremony-muted mb-4">
          Connected devices
        </h2>
        <ul className="space-y-2 text-sm">
          <li>Audience: {counts.audience}</li>
          <li>Speaker: {counts.speaker}</li>
          <li>Projector: {counts.projector}</li>
          <li>Total active: {counts.total}</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-white/10 p-6 space-y-3">
        <h2 className="text-sm uppercase tracking-widest text-ceremony-muted">
          Quick links
        </h2>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link href={`/s/${sessionId}`} className="text-ceremony-glow underline">
            Audience
          </Link>
          <Link
            href={`/speaker/${sessionId}`}
            className="text-ceremony-glow underline"
          >
            Speaker
          </Link>
          <Link
            href={`/projector/${sessionId}`}
            className="text-ceremony-glow underline"
          >
            Projector
          </Link>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 p-6">
        <h2 className="text-sm uppercase tracking-widest text-ceremony-muted mb-4">
          Sections ({session.sections.length})
        </h2>
        <ol className="list-decimal list-inside space-y-2 text-sm text-ceremony-dim">
          {session.sections.map((s) => (
            <li key={s.id}>
              {s.title}{" "}
              <span className="text-ceremony-muted">
                ({s.projectorState} / {s.audienceState})
              </span>
            </li>
          ))}
        </ol>
        <p className="text-xs text-ceremony-muted mt-6">
          Edit content in{" "}
          <code className="text-ceremony-glow/80">src/lib/seed-session.ts</code>{" "}
          for the demo session, or connect Supabase for production persistence.
        </p>
      </section>
    </main>
  );
}
