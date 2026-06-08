"use client";

import { useEffect, useRef } from "react";
import type { LanguageCode } from "@/lib/types";

const STORAGE_KEY = "graduation_user_session";

export function getStoredUserSessionId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEY);
}

export function setStoredUserSessionId(id: string): void {
  localStorage.setItem(STORAGE_KEY, id);
}

async function safeFetch(url: string, init?: RequestInit) {
  try {
    return await fetch(url, { ...init, cache: "no-store" });
  } catch {
    return null;
  }
}

export function usePresence(
  sessionId: string,
  deviceType: "audience" | "speaker" | "projector",
  languageCode?: LanguageCode
) {
  const userIdRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function register() {
      const existing = getStoredUserSessionId();
      const res = await safeFetch(`/api/session/${sessionId}/presence`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userSessionId: existing,
          deviceType,
          languageCode,
        }),
      });
      if (!res?.ok || cancelled) return;
      const data = await res.json();
      userIdRef.current = data.userSessionId;
      setStoredUserSessionId(data.userSessionId);
    }

    register();

    const interval = setInterval(async () => {
      const uid = userIdRef.current ?? getStoredUserSessionId();
      if (!uid) return;
      await safeFetch(`/api/session/${sessionId}/presence`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userSessionId: uid }),
      });
    }, 25000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [sessionId, deviceType, languageCode]);

  return {
    getUserSessionId: () =>
      userIdRef.current ?? getStoredUserSessionId(),
  };
}
