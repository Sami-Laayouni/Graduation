"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center gap-6 p-8 bg-[#020308] text-white">
      <h1 className="font-serif text-2xl text-emerald-200">Something went wrong</h1>
      <p className="text-sm text-white/50 max-w-md text-center">{error.message}</p>
      <button
        type="button"
        onClick={reset}
        className="rounded-xl border border-emerald-400/40 px-6 py-3 text-emerald-200"
      >
        Try again
      </button>
      <p className="text-xs text-white/30">
        If this keeps happening, run{" "}
        <code className="text-emerald-300/80">npm run dev:clean</code> in the project
        folder (stop all other dev servers first).
      </p>
    </main>
  );
}
