import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center gap-4 p-8 bg-[#020308] text-white">
      <h1 className="font-serif text-3xl text-emerald-200">Not found</h1>
      <Link href="/" className="text-emerald-400/80 underline">
        Back to ceremony home
      </Link>
    </main>
  );
}
