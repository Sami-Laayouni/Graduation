/** Audience join URL from current origin — works in dev and production */
export function getAudienceUrl(sessionId: string): string {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/s/${sessionId}`;
  }
  const base =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ??
    "http://localhost:3000";
  return `${base}/s/${sessionId}`;
}
