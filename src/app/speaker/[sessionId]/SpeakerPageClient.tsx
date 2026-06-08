"use client";

import { useState } from "react";
import type { SessionContent } from "@/lib/types";
import { SpeakerDashboard } from "@/components/SpeakerDashboard";

interface Props {
  session: SessionContent;
  requiresSecret: boolean;
}

export function SpeakerPageClient({ session, requiresSecret }: Props) {
  const [secret, setSecret] = useState("");
  const [unlocked, setUnlocked] = useState(!requiresSecret);

  if (!unlocked) {
    return (
      <main className="min-h-dvh flex items-center justify-center p-6">
        <form
          className="max-w-sm w-full space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setUnlocked(true);
          }}
        >
          <h1 className="font-serif text-2xl text-ceremony-accent">
            Speaker access
          </h1>
          <p className="text-sm text-ceremony-dim">
            Enter the ceremony speaker secret from your environment file.
          </p>
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="Speaker secret"
            className="w-full rounded-xl border border-white/15 bg-ceremony-surface p-3 text-ceremony-text"
            autoComplete="current-password"
          />
          <button type="submit" className="btn-ceremony-primary w-full">
            Enter dashboard
          </button>
        </form>
      </main>
    );
  }

  return (
    <SpeakerDashboard
      session={session}
      speakerSecret={requiresSecret ? secret : undefined}
    />
  );
}
