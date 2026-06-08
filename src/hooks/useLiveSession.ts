"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { LiveSessionState } from "@/lib/types";
import { normalizeLiveState } from "@/lib/normalize-state";

function parseState(sessionId: string, data: LiveSessionState): LiveSessionState {
  return normalizeLiveState({ ...data, sessionId });
}

export function useLiveSession(sessionId: string) {
  const [liveState, setLiveState] = useState<LiveSessionState | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const esRef = useRef<EventSource | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(`/api/session/${sessionId}/state`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch state");
      const data = (await res.json()) as LiveSessionState;
      setLiveState(parseState(sessionId, data));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sync error");
    }
  }, [sessionId]);

  useEffect(() => {
    refresh();

    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

    function connect() {
      esRef.current?.close();
      const es = new EventSource(`/api/session/${sessionId}/stream`);
      esRef.current = es;

      es.onopen = () => {
        setConnected(true);
        setError(null);
      };

      es.onmessage = (ev) => {
        try {
          const data = JSON.parse(ev.data) as LiveSessionState;
          setLiveState(parseState(sessionId, data));
          setConnected(true);
        } catch {
          /* ignore */
        }
      };

      es.onerror = () => {
        setConnected(false);
        es.close();
        esRef.current = null;
        refresh();
        reconnectTimer = setTimeout(connect, 3000);
      };
    }

    connect();

    const poll = setInterval(refresh, 5000);

    return () => {
      if (reconnectTimer) clearTimeout(reconnectTimer);
      clearInterval(poll);
      esRef.current?.close();
    };
  }, [sessionId, refresh]);

  return { liveState, connected, error, refresh };
}
