"use client";

import { useEffect, useMemo, useRef } from "react";
import type { LanguageCode, SessionContent } from "@/lib/types";
import { useLiveSession } from "@/hooks/useLiveSession";
import { usePresence } from "@/hooks/usePresence";
import { TreeVisual } from "./TreeVisual";
import { playLeafChime } from "@/lib/sounds";

interface Props {
  session: SessionContent;
  displayLanguage?: LanguageCode;
}

export function ProjectorView({
  session,
  displayLanguage = "en",
}: Props) {
  const { liveState } = useLiveSession(session.id);
  usePresence(session.id, "projector");
  const lastPulse = useRef(0);

  const section = session.sections.find(
    (s) => s.id === liveState?.currentSectionId
  );

  const cueText = useMemo(() => {
    if (
      liveState?.projectorState === "qr_intro" ||
      liveState?.projectorState === "qr_reflection"
    ) {
      return undefined;
    }

    const trans = section?.translations[displayLanguage];
    const state = liveState?.projectorState;
    const sectionId = section?.id;

    // Section 30 only — seasons / life-mission message on projector
    if (state === "seasons_cycle" && sectionId === "look_up_2") {
      return trans?.projectorCue ?? session.projectorCues[displayLanguage].seasons;
    }

    if (trans?.projectorCue && sectionId !== "look_up_1") {
      return trans.projectorCue;
    }

    if (state === "end_card") {
      return session.projectorCues[displayLanguage].final;
    }
    if (state === "single_leaf" || state === "leaf_reveal") {
      return session.projectorCues[displayLanguage].main_argument;
    }
    if (state === "forest_zoom") {
      return session.projectorCues[displayLanguage].still_written;
    }

    return undefined;
  }, [section, liveState, session, displayLanguage]);

  useEffect(() => {
    const pulse = liveState?.leafPulseAt ?? 0;
    if (pulse > 0 && pulse !== lastPulse.current) {
      lastPulse.current = pulse;
      playLeafChime();
    }
  }, [liveState?.leafPulseAt]);

  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      <TreeVisual
        state={liveState?.projectorState ?? "qr_intro"}
        season={liveState?.season ?? "winter"}
        sessionId={session.id}
        sectionId={liveState?.currentSectionId ?? "qr_intro"}
        leafCount={liveState?.leafCount ?? 0}
        leafPulseAt={liveState?.leafPulseAt ?? 0}
        cueText={cueText}
        stage={liveState?.projectorMode !== "personal"}
      />
    </div>
  );
}
