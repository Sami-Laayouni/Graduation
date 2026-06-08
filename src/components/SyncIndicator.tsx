"use client";

interface Props {
  connected: boolean;
  error?: string | null;
}

export function SyncIndicator({ connected, error }: Props) {
  return (
    <div
      className="flex items-center gap-2 text-xs text-ceremony-muted"
      title={error ?? undefined}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          connected ? "bg-ceremony-glow animate-pulse-slow" : "bg-red-400/80"
        }`}
        aria-hidden
      />
      <span>{connected ? "Live" : error ? "Reconnecting…" : "Connecting…"}</span>
    </div>
  );
}
