let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    try {
      audioCtx = new AudioContext();
    } catch {
      return null;
    }
  }
  return audioCtx;
}

/** Soft fairy chime when a leaf joins the tree (projector) */
export function playLeafChime(): void {
  const ctx = getCtx();
  if (!ctx) return;

  const play = () => {
    const t = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      osc.connect(gain);
      gain.connect(ctx.destination);

      const start = t + i * 0.07;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.12, start + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 1.2);

      osc.start(start);
      osc.stop(start + 1.3);
    });

    // Shimmer overtone
    const shimmer = ctx.createOscillator();
    const sGain = ctx.createGain();
    shimmer.type = "triangle";
    shimmer.frequency.value = 2093;
    shimmer.connect(sGain);
    sGain.connect(ctx.destination);
    sGain.gain.setValueAtTime(0, t);
    sGain.gain.linearRampToValueAtTime(0.03, t + 0.1);
    sGain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
    shimmer.start(t);
    shimmer.stop(t + 0.9);
  };

  if (ctx.state === "suspended") {
    ctx.resume().then(play).catch(() => {});
  } else {
    play();
  }
}
