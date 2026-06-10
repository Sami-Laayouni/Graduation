/** Pause on the final beat before congratulations / thank you appear */
export const FINALE_CONGRATULATIONS_DELAY_MS = 15_000;

/** Split end-section caption: lesson first, congratulations after delay */
export function endCaptionPrelude(text: string): string {
  const markers = [
    "\n\nCongratulations",
    "\nCongratulations",
    "\n\nFélicitations",
    "\nFélicitations",
    "\n\nMabrouk",
    "\nMabrouk",
  ];
  for (const marker of markers) {
    const idx = text.indexOf(marker);
    if (idx >= 0) return text.slice(0, idx).trim();
  }
  return text;
}

export function endCaptionHasFinale(text: string): boolean {
  return endCaptionPrelude(text).length < text.trim().length;
}
