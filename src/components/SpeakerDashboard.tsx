"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import clsx from "clsx";
import type { LiveSessionState, SessionContent, SyncEventType } from "@/lib/types";
import { SyncIndicator } from "./SyncIndicator";
import { useLiveSession } from "@/hooks/useLiveSession";
import { usePresence } from "@/hooks/usePresence";
import { SpeakerScript } from "./SpeakerScript";

interface Props {
  session: SessionContent;
}

function SectionNavButton({
  disabled,
  onClick,
  primary,
  children,
  className,
}: {
  disabled?: boolean;
  onClick: () => void;
  primary?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        "speaker-touch-btn-lg rounded-xl font-medium tracking-wide transition-all active:scale-[0.98]",
        primary ? "btn-ceremony-primary" : "btn-ceremony",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function SpeakerDashboard({ session }: Props) {
  const { liveState, connected, error, refresh, applyState } = useLiveSession(session.id);
  const [counts, setCounts] = useState({ audience: 0, total: 0, samePage: 0 });
  const [storedLeafCount, setStoredLeafCount] = useState(0);
  const [busy, setBusy] = useState(false);
  const [showTools, setShowTools] = useState(false);
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
  const canPrev    = currentIdx > 0;
  const canNext    = currentIdx < total - 1;

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (busy) return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        if (canNext) void emit("SECTION_NEXT");
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        if (canPrev) void emit("SECTION_PREVIOUS");
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [busy, canPrev, canNext, emit]);

  const secondaryControls = (
    <>
      <button type="button" disabled={busy}
        onClick={() => emit("SHOW_REFLECTION")}
        className="speaker-touch-btn btn-ceremony w-full text-sm md:text-base">
        Reflection
      </button>
      <button type="button" disabled={busy}
        onClick={() => emit("HIDE_REFLECTION")}
        className="speaker-touch-btn btn-ceremony w-full text-sm md:text-base">
        Release audience
      </button>
      <button type="button" disabled={busy}
        onClick={() => emit("END_SESSION")}
        className="speaker-touch-btn btn-ceremony w-full text-sm md:text-base">
        End session
      </button>
      <button type="button" disabled={busy}
        onClick={() => { if (confirm("Reset entire session to start?")) emit("RESET_SESSION"); }}
        className="speaker-touch-btn btn-ceremony w-full text-sm md:text-base border-red-400/30 text-red-300/70">
        Emergency reset
      </button>
    </>
  );

  return (
    <div className="speaker-page min-h-dvh bg-ceremony-bg text-ceremony-text touch-scroll-y overflow-x-hidden">

      <div className="mx-auto w-full max-w-[90rem] px-4 md:px-6 lg:px-8 pt-4 md:pt-6 pb-4">

        {/* ── Header ───────────────────────────────────────────────────── */}
        <header className="mb-4 md:mb-5 space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-3 md:gap-4">
            <div className="min-w-0">
              <h1 className="font-serif text-xl md:text-2xl lg:text-3xl text-ceremony-accent leading-tight">
                {session.title}
              </h1>
              <p className="text-xs md:text-sm text-ceremony-dim mt-1">
                Tap Previous / Next below · or use arrow keys with a keyboard
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm shrink-0">
              <SyncIndicator connected={connected} error={error} />
              <span className="rounded-full px-3 py-1.5 border border-white/10 bg-white/[0.04] tabular-nums">
                {counts.audience} audience
              </span>
              {counts.audience > 0 && (
                <span
                  className={clsx(
                    "rounded-full px-3 py-1.5 border tabular-nums",
                    counts.samePage >= counts.audience * 0.7
                      ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200"
                      : counts.samePage >= counts.audience * 0.4
                        ? "border-amber-400/40 bg-amber-400/10 text-amber-200"
                        : "border-red-400/40 bg-red-400/10 text-red-200",
                  )}
                >
                  {counts.samePage} synced
                </span>
              )}
              <span className="rounded-full px-3 py-1.5 border border-white/10 bg-white/[0.04] tabular-nums">
                {leafTotal} leaves
              </span>
            </div>
          </div>

          {/* Quick actions — horizontal scroll on tablet */}
          <div className="flex gap-2 md:gap-3 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-thin">
            <button type="button" disabled={busy}
              onClick={() => emit("SECTION_JUMP", { sectionId: "qr_intro" })}
              className="speaker-touch-btn btn-ceremony-primary text-sm md:text-base whitespace-nowrap shrink-0 px-4">
              Start — Section 1
            </button>
            <button type="button" disabled={busy}
              onClick={() => emit("SHOW_REFLECTION")}
              className="speaker-touch-btn btn-ceremony text-sm md:text-base whitespace-nowrap shrink-0 px-4">
              Jump to reflection
            </button>
            <a href={`/projector/${session.id}`} target="_blank" rel="noreferrer"
              className="speaker-touch-btn btn-ceremony text-sm md:text-base whitespace-nowrap shrink-0 px-4 inline-flex items-center">
              Open projector ↗
            </a>
            <button
              type="button"
              disabled={busy}
              className="speaker-touch-btn btn-ceremony text-sm md:text-base whitespace-nowrap shrink-0 px-4 lg:hidden"
              onClick={() => setShowTools(v => !v)}
            >
              {showTools ? "Hide tools" : "More tools"}
            </button>
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
              className="speaker-touch-btn btn-ceremony text-sm md:text-base whitespace-nowrap shrink-0 px-4 hidden lg:inline-flex"
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
              className="speaker-touch-btn btn-ceremony text-sm md:text-base whitespace-nowrap shrink-0 px-4 border-red-400/30 text-red-300/80 hidden lg:inline-flex"
            >
              Clear leaves ({leafTotal})
            </button>
          </div>

          {showTools && (
            <div className="lg:hidden flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                disabled={busy}
                onClick={async () => {
                  if (!confirm("Add 100 demo leaves to the tree?")) return;
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
                className="speaker-touch-btn btn-ceremony text-sm px-4"
              >
                Add 100 demo leaves
              </button>
              <button
                type="button"
                disabled={busy || leafTotal === 0}
                onClick={async () => {
                  if (!confirm(`Remove all ${leafTotal} leaves?`)) return;
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
                className="speaker-touch-btn btn-ceremony text-sm px-4 border-red-400/30 text-red-300/80"
              >
                Clear leaves ({leafTotal})
              </button>
            </div>
          )}
        </header>

        {/* Section progress */}
        <div className="mb-4 md:mb-5 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 md:px-5 md:py-4">
          <p className="text-sm md:text-base text-white/90 font-medium leading-snug">
            Section {currentIdx + 1} of {total}
            {current ? ` — ${current.title}` : ""}
          </p>
          {counts.audience > 0 && counts.samePage < counts.audience && (
            <p className="text-xs md:text-sm text-amber-300/80 mt-1.5">
              {counts.audience - counts.samePage} still catching up — consider waiting a moment
            </p>
          )}
          <div className="mt-3 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-ceremony-accent/70 transition-all duration-500"
              style={{ width: `${((currentIdx + 1) / total) * 100}%` }}
            />
          </div>
        </div>

        {/* ── Main grid — 2 cols on iPad portrait+, 3 on large landscape ── */}
        <div className="grid gap-4 md:gap-5 md:grid-cols-[minmax(10.5rem,13rem)_1fr] lg:grid-cols-[minmax(11rem,14rem)_1fr_minmax(10rem,12rem)]">

          {/* Section list */}
          <aside className="speaker-script-scroll space-y-1.5 max-h-[38vh] md:max-h-[calc(100dvh-11rem)] overflow-y-auto md:sticky md:top-4 md:self-start pr-1">
            <p className="text-[10px] md:text-xs uppercase tracking-[0.18em] text-ceremony-muted px-1 mb-2 hidden md:block">
              Sections
            </p>
            {session.sections.map((section, i) => (
              <button key={section.id} type="button" disabled={busy}
                onClick={() => emit("SECTION_JUMP", { sectionId: section.id })}
                className={clsx(
                  "speaker-touch-btn w-full text-left rounded-xl px-3 py-3 md:py-3.5 text-sm md:text-[0.9375rem] border transition-colors",
                  liveState?.currentSectionId === section.id
                    ? "border-ceremony-glow/60 bg-ceremony-glow/10 text-white"
                    : "border-white/5 text-ceremony-dim hover:border-white/20 hover:text-white"
                )}>
                <span className="text-ceremony-muted mr-2 tabular-nums text-xs">{i + 1}.</span>
                {section.title.replace(/^\d+\.\s*/, "")}
              </button>
            ))}
          </aside>

          {/* Script — scrolls with the page */}
          <main className="rounded-2xl border border-white/10 bg-white/[0.04] flex flex-col min-w-0">

            <div className="flex flex-wrap items-center justify-between gap-2 px-4 md:px-6 py-3 md:py-4 border-b border-white/[0.07]">
              <div className="flex flex-wrap items-center gap-2 md:gap-3 min-w-0">
                <span className="text-xs md:text-sm uppercase tracking-[0.18em] text-ceremony-muted tabular-nums shrink-0">
                  {currentIdx + 1} / {total}
                </span>
                <span className="text-white/90 font-medium text-sm md:text-base truncate">
                  {current?.title ?? "—"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs md:text-sm text-ceremony-muted shrink-0">
                <span>{liveState?.projectorState ?? "—"}</span>
              </div>
            </div>

            <div className="px-5 md:px-8 lg:px-10 py-6 md:py-8 lg:py-10">
              <SpeakerScript text={current?.speakerText ?? ""} />
            </div>

            {session.sections[currentIdx + 1] && (
              <div className="px-4 md:px-6 py-4 md:py-5 border-t border-white/[0.07] bg-black/20">
                <p className="text-[10px] md:text-xs uppercase tracking-[0.15em] mb-1.5 text-ceremony-muted">
                  Up next
                </p>
                <p className="text-sm md:text-base leading-relaxed text-ceremony-dim">
                  {session.sections[currentIdx + 1].speakerText?.split("\n")[0]?.slice(0, 140)}
                  {(session.sections[currentIdx + 1].speakerText?.length ?? 0) > 140 ? "…" : ""}
                </p>
              </div>
            )}
          </main>

          {/* Side controls — large landscape / desktop only */}
          <aside className="hidden lg:flex flex-col gap-2.5 sticky top-4 self-start">
            <SectionNavButton
              disabled={busy || !canPrev}
              onClick={() => emit("SECTION_PREVIOUS")}
              className="w-full text-base"
            >
              ← Previous
            </SectionNavButton>
            <SectionNavButton
              disabled={busy || !canNext}
              onClick={() => emit("SECTION_NEXT")}
              primary
              className="w-full text-base"
            >
              Next →
            </SectionNavButton>

            <div className="h-px my-1 bg-white/[0.06]" />

            {secondaryControls}
          </aside>
        </div>

        {/* Secondary controls row on iPad (no right sidebar) */}
        <div className="lg:hidden mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3">
          {secondaryControls}
        </div>
      </div>

      {/* ── Sticky bottom nav — always reachable on iPad ───────────────── */}
      <nav
        className="speaker-nav-bar fixed bottom-0 inset-x-0 z-50 border-t border-white/10 bg-[#06080d]/95 backdrop-blur-xl px-4 md:px-6 pt-3"
        aria-label="Section navigation"
      >
        <div className="mx-auto max-w-[90rem] grid grid-cols-[1fr_auto_1fr] items-center gap-3 md:gap-4">
          <SectionNavButton
            disabled={busy || !canPrev}
            onClick={() => emit("SECTION_PREVIOUS")}
            className="w-full text-sm md:text-base px-3 md:px-5"
          >
            ← Previous
          </SectionNavButton>

          <div className="text-center min-w-0 px-1">
            <p className="text-[10px] md:text-xs uppercase tracking-[0.14em] text-ceremony-muted tabular-nums">
              {currentIdx + 1} / {total}
            </p>
            <p className="text-xs md:text-sm text-white/85 font-medium truncate max-w-[12rem] sm:max-w-[18rem] md:max-w-[24rem] mx-auto">
              {current?.title?.replace(/^\d+\.\s*/, "") ?? "—"}
            </p>
          </div>

          <SectionNavButton
            disabled={busy || !canNext}
            onClick={() => emit("SECTION_NEXT")}
            primary
            className="w-full text-sm md:text-base px-3 md:px-5"
          >
            Next →
          </SectionNavButton>
        </div>
      </nav>
    </div>
  );
}
