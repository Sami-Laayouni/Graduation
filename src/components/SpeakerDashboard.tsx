"use client";

import { useCallback, useEffect, useState } from "react";
import clsx from "clsx";
import type { ProjectorMode, SessionContent, SyncEventType } from "@/lib/types";
import { SyncIndicator } from "./SyncIndicator";
import { useLiveSession } from "@/hooks/useLiveSession";
import { usePresence } from "@/hooks/usePresence";
import {
  asiVeinCount,
  leafZoomT,
  TOTAL_ASI_VEINS,
} from "@/lib/visual-progress";

interface Props {
  session: SessionContent;
}

export function SpeakerDashboard({ session }: Props) {
  const { liveState, connected, error } = useLiveSession(session.id);
  const [counts, setCounts] = useState({ audience: 0, total: 0 });
  const [busy, setBusy] = useState(false);
  usePresence(session.id, "speaker");

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/session/${session.id}/presence`, { cache: "no-store" });
        if (res.ok) setCounts(await res.json());
      } catch { /* ignore */ }
    }, 5000);
    return () => clearInterval(interval);
  }, [session.id]);

  const emit = useCallback(
    async (type: SyncEventType, payload?: Record<string, unknown>) => {
      setBusy(true);
      try {
        await fetch(`/api/session/${session.id}/event`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, payload }),
        });
      } finally {
        setBusy(false);
      }
    },
    [session.id]
  );

  const setMode = (m: ProjectorMode) =>
    emit("SET_PROJECTOR_MODE", { projectorMode: m });

  const currentIdx = session.sections.findIndex(s => s.id === liveState?.currentSectionId);
  const current    = session.sections[currentIdx];
  const total      = session.sections.length;
  const projMode   = liveState?.projectorMode ?? "stage";

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (busy) return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        if (currentIdx < total - 1) void emit("SECTION_NEXT");
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        if (currentIdx > 0) void emit("SECTION_PREVIOUS");
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [busy, currentIdx, total, emit]);

  return (
    <div className="min-h-dvh bg-ceremony-bg text-ceremony-text p-4 md:p-8">

      {/* ── Mode selector ──────────────────────────────────────────────── */}
      <div className="mb-6 rounded-2xl border overflow-hidden"
        style={{ borderColor: "rgba(255,255,255,0.1)" }}>

        <div className="px-5 py-3 border-b text-xs uppercase tracking-[0.25em]"
          style={{ borderColor: "rgba(255,255,255,0.06)", color: "rgba(200,216,240,0.4)" }}>
          Venue setup
        </div>

        <div className="grid grid-cols-2"
          style={{ borderRight: "none" }}>

          {/* Stage mode */}
          <button
            type="button"
            onClick={() => setMode("stage")}
            style={{ borderRight: "1px solid rgba(255,255,255,0.06)" }}
            className={clsx(
              "relative flex flex-col items-start gap-2 px-5 py-5 text-left transition-colors",
              projMode === "stage"
                ? "bg-white/[0.06]"
                : "hover:bg-white/[0.02]"
            )}
          >
            {projMode === "stage" && (
              <span className="absolute top-4 right-4 text-[10px] tracking-[0.2em] uppercase px-2 py-0.5 rounded-full"
                style={{ background: "rgba(200,216,240,0.12)", color: "rgba(200,216,240,0.7)" }}>
                Active
              </span>
            )}
            <div className="flex items-center gap-3">
              {/* Projector icon */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                stroke={projMode === "stage" ? "rgba(220,230,250,0.9)" : "rgba(200,216,240,0.4)"}
                strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="6" width="20" height="12" rx="2"/>
                <circle cx="12" cy="12" r="3"/>
                <line x1="12" y1="18" x2="12" y2="22"/>
                <line x1="8"  y1="22" x2="16" y2="22"/>
              </svg>
              <span className="font-serif text-lg"
                style={{ color: projMode === "stage" ? "#e8ecf4" : "rgba(200,216,240,0.5)" }}>
                Stage Mode
              </span>
            </div>
            <p className="text-xs leading-relaxed pl-[34px]"
              style={{ color: "rgba(200,216,240,0.38)" }}>
              Projector present. Tree on the big screen.<br/>
              High-contrast, readable from far away.
            </p>
          </button>

          {/* Personal mode */}
          <button
            type="button"
            onClick={() => setMode("personal")}
            className={clsx(
              "relative flex flex-col items-start gap-2 px-5 py-5 text-left transition-colors",
              projMode === "personal"
                ? "bg-white/[0.06]"
                : "hover:bg-white/[0.02]"
            )}
          >
            {projMode === "personal" && (
              <span className="absolute top-4 right-4 text-[10px] tracking-[0.2em] uppercase px-2 py-0.5 rounded-full"
                style={{ background: "rgba(200,216,240,0.12)", color: "rgba(200,216,240,0.7)" }}>
                Active
              </span>
            )}
            <div className="flex items-center gap-3">
              {/* Phone icon */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                stroke={projMode === "personal" ? "rgba(220,230,250,0.9)" : "rgba(200,216,240,0.4)"}
                strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2"/>
                <circle cx="12" cy="17" r="1"/>
              </svg>
              <span className="font-serif text-lg"
                style={{ color: projMode === "personal" ? "#e8ecf4" : "rgba(200,216,240,0.5)" }}>
                Personal Mode
              </span>
            </div>
            <p className="text-xs leading-relaxed pl-[34px]"
              style={{ color: "rgba(200,216,240,0.38)" }}>
              No projector. Each phone is the experience.<br/>
              Leaf shown on their screen, not a shared screen.
            </p>
          </button>
        </div>
      </div>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="flex flex-wrap items-center justify-between gap-4 mb-5">
        <div>
          <h1 className="font-serif text-2xl text-ceremony-accent">{session.title}</h1>
          <p className="text-sm text-ceremony-dim">Arrow keys → prev / next</p>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <SyncIndicator connected={connected} error={error} />
          <span>{counts.audience} audience</span>
        </div>
      </header>

      {/* ── Quick actions ───────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3 mb-5">
        <button type="button" disabled={busy}
          onClick={() => emit("SECTION_JUMP", { sectionId: "qr_intro" })}
          className="btn-ceremony-primary text-sm">
          Start — Section 1
        </button>
        <button type="button" disabled={busy}
          onClick={() => emit("SHOW_REFLECTION")}
          className="btn-ceremony text-sm">
          Jump to reflection
        </button>
        <a href={`/projector/${session.id}`} target="_blank" rel="noreferrer"
          className="btn-ceremony text-sm inline-flex items-center">
          Open projector ↗
        </a>
        <button
          type="button"
          disabled={busy || (liveState?.leafCount ?? 0) === 0}
          onClick={async () => {
            if (!confirm(`Remove all ${liveState?.leafCount ?? 0} leaves from the tree? This cannot be undone.`)) return;
            setBusy(true);
            try {
              await fetch(`/api/session/${session.id}/leaves`, { method: "DELETE" });
            } finally {
              setBusy(false);
            }
          }}
          className="btn-ceremony text-sm border-red-400/30 text-red-300/80 hover:border-red-400/60 hover:text-red-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          🍃 Clear all leaves ({liveState?.leafCount ?? 0})
        </button>
      </div>

      <p className="text-xs text-ceremony-muted mb-4">
        Section {currentIdx + 1} of {total}{current ? ` — ${current.title}` : ""}
      </p>

      {/* ── Main grid ──────────────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-[1fr_2fr_1fr] gap-6">

        {/* Section list */}
        <aside className="space-y-1 max-h-[60vh] overflow-y-auto">
          {session.sections.map((section, i) => (
            <button key={section.id} type="button" disabled={busy}
              onClick={() => emit("SECTION_JUMP", { sectionId: section.id })}
              className={clsx(
                "w-full text-left rounded-lg px-3 py-2 text-sm border transition-colors",
                liveState?.currentSectionId === section.id
                  ? "border-ceremony-glow/50 bg-ceremony-glow/10"
                  : "border-white/5 hover:border-white/15"
              )}>
              <span className="text-ceremony-muted mr-2 tabular-nums">{i + 1}.</span>
              {section.title.replace(/^\d+\.\s*/, "")}
            </button>
          ))}
        </aside>

        {/* Current section */}
        <main className="rounded-2xl border border-white/10 bg-ceremony-surface/40 p-6">
          <p className="text-xs uppercase tracking-widest text-ceremony-muted mb-2">Current</p>
          <h2 className="font-serif text-3xl mb-4">{current?.title ?? "—"}</h2>
          <p className="text-ceremony-dim leading-relaxed text-sm max-h-[min(50vh,400px)] overflow-y-auto whitespace-pre-line">
            {current?.speakerText}
          </p>
          <div className="mt-6 flex flex-wrap gap-2 text-xs text-ceremony-muted items-center">
            <span>Visual: {liveState?.projectorState}</span>
            <span>|</span>
            <span>Leaves: {liveState?.leafCount ?? 0}</span>
            {asiVeinCount(current?.id ?? "") > 0 && (
              <>
                <span>|</span>
                <span className="text-ceremony-glow">
                  Line {asiVeinCount(current?.id ?? "")}/{TOTAL_ASI_VEINS}
                  {leafZoomT(current?.id ?? "") > 0 &&
                    ` · zoom ${Math.round(leafZoomT(current?.id ?? "") * 100)}%`}
                </span>
              </>
            )}
          </div>
        </main>

        {/* Nav controls */}
        <aside className="flex flex-col gap-3">
          <button type="button" disabled={busy || currentIdx <= 0}
            onClick={() => emit("SECTION_PREVIOUS")}
            className="btn-ceremony w-full text-lg py-4">
            ← Previous
          </button>
          <button type="button" disabled={busy || currentIdx >= total - 1}
            onClick={() => emit("SECTION_NEXT")}
            className="btn-ceremony-primary w-full text-lg py-4">
            Next →
          </button>
          <button type="button" disabled={busy}
            onClick={() => emit("SHOW_REFLECTION")}
            className="btn-ceremony w-full">
            Reflection moment
          </button>
          <button type="button" disabled={busy}
            onClick={() => emit("HIDE_REFLECTION")}
            className="btn-ceremony w-full">
            Release audience
          </button>
          <button type="button" disabled={busy}
            onClick={() => emit("END_SESSION")}
            className="btn-ceremony w-full">
            End session
          </button>
          <button type="button" disabled={busy}
            onClick={() => { if (confirm("Reset entire session to start?")) emit("RESET_SESSION"); }}
            className="btn-ceremony w-full border-red-400/30 text-red-300/80">
            Emergency reset
          </button>
        </aside>
      </div>
    </div>
  );
}
