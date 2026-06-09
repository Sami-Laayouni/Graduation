"use client";

interface Props {
  connected: boolean;
  error?: string | null;
  compact?: boolean;
}

export function SyncIndicator({ connected, error, compact }: Props) {
  return (
    <div
      className="flex items-center gap-1.5 text-[10px] sm:text-xs text-ceremony-muted shrink-0"
      title={error ?? undefined}
    >
      <span
        className={`h-2 w-2 rounded-full shrink-0 ${
          connected ? "bg-ceremony-glow animate-pulse-slow" : "bg-red-400/80"
        }`}
        aria-hidden
      />
      <span className={compact ? "hidden min-[400px]:inline" : undefined}>
        {connected ? "Live" : error ? "Reconnecting…" : "Connecting…"}
      </span>
    </div>
  );
}
