import Link from "next/link";
import { demoSession } from "@/lib/seed-session";

const sessionId = process.env.NEXT_PUBLIC_DEFAULT_SESSION ?? demoSession.slug;

export default function HomePage() {
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center px-6 py-10 text-center relative overflow-x-hidden touch-scroll-y"
      style={{
        background: "linear-gradient(180deg, #04060d 0%, #070b14 55%, #04060d 100%)"
      }}
    >
      {/* Ambient orb */}
      <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full"
        style={{ background: "radial-gradient(ellipse, rgba(200,216,240,0.04) 0%, transparent 70%)", pointerEvents: "none" }}
      />

      <div className="relative z-10 max-w-sm w-full space-y-10">

        {/* Leaf emblem */}
        <div className="flex justify-center">
          <svg width="44" height="56" viewBox="0 0 44 56" fill="none" aria-hidden>
            <path d="M22 52 C32 44 38 30 36 16 C34 4 28 0 22 0 C16 0 10 4 8 16 C6 30 12 44 22 52Z"
              fill="rgba(200,216,240,0.15)" stroke="rgba(200,216,240,0.45)" strokeWidth="0.8"/>
            <line x1="22" y1="50" x2="22" y2="8"  stroke="rgba(200,216,240,0.5)" strokeWidth="0.8" strokeLinecap="round"/>
            <line x1="22" y1="38" x2="11" y2="28" stroke="rgba(200,216,240,0.35)" strokeWidth="0.7" strokeLinecap="round"/>
            <line x1="22" y1="38" x2="33" y2="28" stroke="rgba(200,216,240,0.35)" strokeWidth="0.7" strokeLinecap="round"/>
            <line x1="22" y1="28" x2="14" y2="20" stroke="rgba(200,216,240,0.25)" strokeWidth="0.6" strokeLinecap="round"/>
            <line x1="22" y1="28" x2="30" y2="20" stroke="rgba(200,216,240,0.25)" strokeWidth="0.6" strokeLinecap="round"/>
          </svg>
        </div>

        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.35em]" style={{ color: "rgba(200,216,240,0.4)" }}>
            Class of 2026
          </p>
          <h1 className="font-serif text-3xl leading-snug" style={{ color: "#e8ecf4" }}>
            The main argument<br/>of a life
          </h1>
        </div>

        <Link
          href={`/s/${sessionId}`}
          className="fairy-btn w-full text-sm tracking-wider"
        >
          Open on your phone
        </Link>

        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Speaker",   href: `/speaker/${sessionId}`   },
            { label: "Projector", href: `/projector/${sessionId}` },
            { label: "Admin",     href: `/admin/${sessionId}`     },
          ].map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="rounded-xl py-2.5 text-xs text-center transition-colors"
              style={{
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(200,216,240,0.55)",
              }}
            >
              {label}
            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}
