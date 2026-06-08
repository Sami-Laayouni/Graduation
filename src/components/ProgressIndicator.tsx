"use client";

interface Props {
  currentIndex: number;
  total: number;
}

export function ProgressIndicator({ currentIndex, total }: Props) {
  const pct = total > 0 ? ((currentIndex + 1) / total) * 100 : 0;

  return (
    <div
      className="w-full max-w-xs mx-auto px-4"
      role="progressbar"
      aria-valuenow={currentIndex + 1}
      aria-valuemin={1}
      aria-valuemax={total}
    >
      <div className="h-px w-full bg-white/10 overflow-hidden rounded-full">
        <div
          className="h-full bg-ceremony-glow/50 transition-all duration-1000 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
