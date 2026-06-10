"use client";

import { useCallback, useEffect, useState } from "react";
import clsx from "clsx";
import type { LiveSessionState, SessionContent, SyncEventType } from "@/lib/types";
import { SyncIndicator } from "./SyncIndicator";
import { useLiveSession } from "@/hooks/useLiveSession";
import { usePresence } from "@/hooks/usePresence";
import { SpeakerScript } from "./SpeakerScript";

interface Props {
  session: SessionContent;
}

export function SpeakerDashboard({ session }: Props) {
  const { liveState, connected, error, refresh, applyState } = useLiveSession(session.id);
  const [counts, setCounts] = useState({ audience: 0, total: 0, samePage: 0 });
  const [storedLeafCount, setStoredLeafCount] = useState(0);
  const [busy, setBusy] = useState(false);
  usePresence(session.id, "speaker");

  const fetchStoredLeafCount = useCallback(async () => {
    try {
      const res = await fetch(`/api/session/${session.id}/leaves`, { cache: "no-store" });
      if (res.ok) {
        const data = (await res.json()) as { total?: number };
        setStoredLeafCount(data.total ?? 0);
      }
    } catch { /* ignore */ }
  }, [session.id]);

  useEffect(() => {
    void fetchStoredLeafCount();
  }, [fetchStoredLeafCount, liveState?.leafPulseAt]);

  const leafTotal = Math.max(liveState?.leafCount ?? 0, storedLeafCount);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/session/${session.id}/presence`, { cache: "no-store" });
        if (res.ok) setCounts(await res.json());
      } catch { /* ignore */ }
    }, 1500);
    return () => clearInterval(interval);
  }, [session.id]);

  const emit = useCallback(
    async (type: SyncEventType, payload?: Record<string, unknown>) => {
      setBusy(true);
      try {
        const res = await fetch(`/api/session/${session.id}/event`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, payload }),
        });
        if (res.ok) {
          const state = (await res.json()) as LiveSessionState;
          applyState(state);
        } else {
          void refresh();
        }
      } finally {
        setBusy(false);
      }
    },
    [session.id, refresh, applyState]
  );

  const currentIdx = session.sections.findIndex(s => s.id === liveState?.currentSectionId);
  const current    = session.sections[currentIdx];
  const total      = session.sections.length;

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

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="flex flex-wrap items-center justify-between gap-4 mb-5">
        <div>
          <h1 className="font-serif text-2xl text-ceremony-accent">{session.title}</h1>
          <p className="text-sm text-ceremony-dim">Arrow keys → prev / next</p>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <SyncIndicator connected={connected} error={error} />
          <span>{counts.audience} audience</span>
          {counts.audience > 0 && (
            <span
              className={clsx(
                "rounded-full px-3 py-1 border tabular-nums",
                counts.samePage >= counts.audience * 0.7
                  ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200"
                  : counts.samePage >= counts.audience * 0.4
                    ? "border-amber-400/40 bg-amber-400/10 text-amber-200"
                    : "border-red-400/40 bg-red-400/10 text-red-200",
              )}
            >
              {counts.samePage} on same page
            </span>
          )}
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
          disabled={busy}
          onClick={async () => {
            if (!confirm("Add 100 demo leaves to the tree? Each gets unique colors and shapes like a real submission.")) return;
            setBusy(true);
            try {
              const res = await fetch(`/api/session/${session.id}/leaves`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ count: 100 }),
              });
              if (res.ok) {
                void refresh();
                void fetchStoredLeafCount();
              }
            } finally {
              setBusy(false);
            }
          }}
          className="btn-ceremony text-sm"
        >
          Add 100 demo leaves
        </button>
        <button
          type="button"
          disabled={busy || leafTotal === 0}
          onClick={async () => {
            if (!confirm(`Remove all ${leafTotal} leaves from the tree? This cannot be undone.`)) return;
            setBusy(true);
            try {
              const res = await fetch(`/api/session/${session.id}/leaves`, { method: "DELETE" });
              if (res.ok) {
                setStoredLeafCount(0);
                void refresh();
              }
            } finally {
              setBusy(false);
            }
          }}
          className="btn-ceremony text-sm border-red-400/30 text-red-300/80 hover:border-red-400/60 hover:text-red-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Clear all leaves ({leafTotal})
        </button>
      </div>

      <p className="text-xs text-ceremony-muted mb-4">
        Section {currentIdx + 1} of {total}{current ? ` — ${current.title}` : ""}
        {counts.audience > 0 && counts.samePage < counts.audience && (
          <span className="ml-2 text-amber-300/80">
            · {counts.audience - counts.samePage} still catching up — consider waiting a moment
          </span>
        )}
      </p>

      {/* ── Main grid ──────────────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-[220px_1fr_180px] gap-5">

        {/* Section list */}
        <aside className="space-y-1 max-h-[72vh] overflow-y-auto pr-1">
          {session.sections.map((section, i) => (
            <button key={section.id} type="button" disabled={busy}
              onClick={() => emit("SECTION_JUMP", { sectionId: section.id })}
              className={clsx(
                "w-full text-left rounded-lg px-3 py-2.5 text-sm border transition-colors",
                liveState?.currentSectionId === section.id
                  ? "border-ceremony-glow/60 bg-ceremony-glow/10 text-white"
                  : "border-white/5 text-ceremony-dim hover:border-white/20 hover:text-white"
              )}>
              <span className="text-ceremony-muted mr-2 tabular-nums text-xs">{i + 1}.</span>
              {section.title.replace(/^\d+\.\s*/, "")}
            </button>
          ))}
        </aside>

        {/* ── Current section — SPEAKER SCRIPT ── */}
        <main className="rounded-2xl border border-white/10 bg-white/[0.04] flex flex-col overflow-hidden">

          {/* Section header bar */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-white/[0.07]">
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-[0.2em]"
                style={{ color: "rgba(200,216,240,0.38)" }}>
                {currentIdx + 1} / {total}
              </span>
              <span className="text-white/80 font-medium">{current?.title ?? "—"}</span>
            </div>
            <div className="flex items-center gap-3 text-xs" style={{ color: "rgba(200,216,240,0.38)" }}>
              <span>{liveState?.projectorState ?? "—"}</span>
              <span>·</span>
              <span>{leafTotal} leaves</span>
            </div>
          </div>

          {/* ★ THE SCRIPT — one beat per line, grouped by idea */}
          <div className="flex-1 overflow-y-auto px-7 py-6">
            <SpeakerScript text={current?.speakerText ?? ""} />
          </div>

          {/* Peek: next section */}
          {session.sections[currentIdx + 1] && (
            <div className="px-6 py-3 border-t border-white/[0.07]">
              <p className="text-xs uppercase tracking-[0.15em] mb-1"
                style={{ color: "rgba(200,216,240,0.30)" }}>
                Up next
              </p>
              <p className="text-sm leading-relaxed"
                style={{ color: "rgba(200,216,240,0.48)" }}>
                {session.sections[currentIdx + 1].speakerText?.split("\n")[0]?.slice(0, 110)}
                {(session.sections[currentIdx + 1].speakerText?.length ?? 0) > 110 ? "…" : ""}
              </p>
            </div>
          )}
        </main>

        {/* Nav controls */}
        <aside className="flex flex-col gap-2.5">
          <button type="button" disabled={busy || currentIdx <= 0}
            onClick={() => emit("SECTION_PREVIOUS")}
            className="btn-ceremony w-full text-base py-4">
            ← Prev
          </button>
          <button type="button" disabled={busy || currentIdx >= total - 1}
            onClick={() => emit("SECTION_NEXT")}
            className="btn-ceremony-primary w-full text-base py-4">
            Next →
          </button>

          <div className="h-px my-1" style={{ background: "rgba(255,255,255,0.06)" }} />

          <button type="button" disabled={busy}
            onClick={() => emit("SHOW_REFLECTION")}
            className="btn-ceremony w-full text-sm">
            Reflection
          </button>
          <button type="button" disabled={busy}
            onClick={() => emit("HIDE_REFLECTION")}
            className="btn-ceremony w-full text-sm">
            Release audience
          </button>
          <button type="button" disabled={busy}
            onClick={() => emit("END_SESSION")}
            className="btn-ceremony w-full text-sm">
            End session
          </button>
          <button type="button" disabled={busy}
            onClick={() => { if (confirm("Reset entire session to start?")) emit("RESET_SESSION"); }}
            className="btn-ceremony w-full text-sm border-red-400/30 text-red-300/70">
            Emergency reset
          </button>
        </aside>
      </div>
    </div>
  );
}
