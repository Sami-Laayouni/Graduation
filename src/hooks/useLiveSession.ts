"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { LiveSessionState } from "@/lib/types";
import { normalizeLiveState } from "@/lib/normalize-state";

function parseState(sessionId: string, data: LiveSessionState): LiveSessionState {
  return normalizeLiveState({ ...data, sessionId });
}

/** How often clients poll /state while SSE is healthy (ms) */
const FAST_POLL_MS = 300;
/** Fallback poll when SSE is disconnected (ms) */
const FALLBACK_POLL_MS = 400;
/** SSE reconnect delay (ms) */
const RECONNECT_MS = 600;

export function useLiveSession(sessionId: string) {
  const [liveState, setLiveState] = useState<LiveSessionState | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const esRef       = useRef<EventSource | null>(null);
  const pollRef     = useRef<ReturnType<typeof setInterval> | null>(null);
  const fastPollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tsRef       = useRef(0);

  const applyState = useCallback((data: LiveSessionState) => {
    const parsed = parseState(sessionId, data);
    if (parsed.timestamp === tsRef.current) return;
    tsRef.current = parsed.timestamp;
    setLiveState(parsed);
    setError(null);
  }, [sessionId]);

  const refresh = useCallback(async () => {
    try {
      const since = tsRef.current;
      const url   = since
        ? `/api/session/${sessionId}/state?since=${since}`
        : `/api/session/${sessionId}/state`;
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch state");
      const data = (await res.json()) as LiveSessionState & { unchanged?: boolean };
      if (data.unchanged) return;
      applyState(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sync error");
    }
  }, [sessionId, applyState]);

  useEffect(() => {
    refresh();

    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

    function startFallbackPoll() {
      if (pollRef.current) return;
      pollRef.current = setInterval(refresh, FALLBACK_POLL_MS);
    }

    function stopFallbackPoll() {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    }

    function startFastPoll() {
      if (fastPollRef.current) return;
      fastPollRef.current = setInterval(refresh, FAST_POLL_MS);
    }

    function stopFastPoll() {
      if (fastPollRef.current) {
        clearInterval(fastPollRef.current);
        fastPollRef.current = null;
      }
    }

    function connect() {
      esRef.current?.close();
      const es = new EventSource(`/api/session/${sessionId}/stream`);
      esRef.current = es;

      es.onopen = () => {
        setConnected(true);
        setError(null);
        stopFallbackPoll();
        startFastPoll();
      };

      es.onmessage = (ev) => {
        try {
          const data = JSON.parse(ev.data) as LiveSessionState;
          applyState(data);
          setConnected(true);
        } catch {
          /* ignore malformed frame */
        }
      };

      es.onerror = () => {
        setConnected(false);
        es.close();
        esRef.current = null;
        stopFastPoll();
        refresh();
        startFallbackPoll();
        reconnectTimer = setTimeout(connect, RECONNECT_MS);
      };
    }

    connect();

    return () => {
      if (reconnectTimer) clearTimeout(reconnectTimer);
      stopFallbackPoll();
      stopFastPoll();
      esRef.current?.close();
    };
  }, [sessionId, refresh, applyState]);

  return { liveState, connected, error, refresh, applyState };
}
