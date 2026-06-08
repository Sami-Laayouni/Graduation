"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import QRCode from "react-qr-code";
import { getAudienceUrl } from "@/lib/audience-url";
import { qrIntroLines, qrReflectionLines } from "@/lib/projector-qr-text";

interface Props {
  sessionId: string;
  variant?: "intro" | "reflection";
  large?: boolean;
}

export function CeremonyQR({
  sessionId,
  variant = "intro",
  large,
}: Props) {
  const [url, setUrl] = useState("");
  const lines = variant === "reflection" ? qrReflectionLines : qrIntroLines;

  useEffect(() => {
    setUrl(getAudienceUrl(sessionId));
  }, [sessionId]);

  const size = large ? 240 : 200;

  if (!url) return null;

  return (
    <motion.div
      className="flex flex-col items-center gap-6 z-30 max-w-2xl mx-auto px-4"
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="space-y-4 text-center w-full">
        <p className="font-serif text-white text-2xl md:text-4xl leading-snug drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          {lines.en}
        </p>
        <p className="font-serif text-white/90 text-xl md:text-3xl leading-snug italic drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">
          {lines.fr}
        </p>
        <p
          className="font-serif text-white text-2xl md:text-4xl leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
          dir="rtl"
          lang="ary"
        >
          {lines.darija}
        </p>
      </div>

      <motion.div
        className="relative p-6 rounded-3xl bg-white shadow-[0_0_80px_rgba(110,231,160,0.35)]"
        animate={{
          boxShadow: [
            "0 0 50px rgba(110,231,160,0.25)",
            "0 0 100px rgba(110,231,160,0.45)",
            "0 0 50px rgba(110,231,160,0.25)",
          ],
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <QRCode value={url} size={size} level="M" bgColor="#ffffff" fgColor="#0a0c0f" />
      </motion.div>
    </motion.div>
  );
}
