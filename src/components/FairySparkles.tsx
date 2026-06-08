"use client";

const SPARKLES = Array.from({ length: 20 }).map((_, i) => ({
  id: i,
  left: (i * 19) % 100,
  top: (i * 31) % 100,
  delay: (i % 8) * 0.5,
  size: 2 + (i % 3),
}));

export function FairySparkles() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
      {SPARKLES.map((s) => (
        <span
          key={s.id}
          className="fairy-sparkle absolute rounded-full"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
