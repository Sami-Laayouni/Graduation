/** Break speaker script into readable beats for the teleprompter (speaker page only). */

const ABBREV = /\b(?:Dr|Mr|Mrs|Ms|Miss|vs|AP|ASI|AI|DH|No|St|Prof)\./gi;

function protectAbbreviations(text: string): string {
  return text.replace(ABBREV, (m) => m.replace(".", "\uE000"));
}

function restoreAbbreviations(text: string): string {
  return text.replace(/\uE000/g, ".");
}

function splitSentences(text: string): string[] {
  const protectedText = protectAbbreviations(text.trim());
  const parts = protectedText.split(/(?<=[.!?…;])\s+/);
  return parts.map((p) => restoreAbbreviations(p.trim())).filter(Boolean);
}

function expandChunk(chunk: string): string[] {
  const trimmed = chunk.trim();
  if (!trimmed) return [];

  const sentences = splitSentences(trimmed);
  if (sentences.length > 1) return sentences;
  return [trimmed];
}

export type SpeakerScriptGroup = {
  lines: string[];
};

/** Groups = idea blocks (double newline). Lines = one short beat each. */
export function formatSpeakerScript(text: string): SpeakerScriptGroup[] {
  if (!text.trim()) return [];

  return text
    .split(/\n\n+/)
    .map((paragraph) => {
      const lines: string[] = [];
      for (const chunk of paragraph.split(/\n+/)) {
        lines.push(...expandChunk(chunk));
      }
      return { lines: lines.filter(Boolean) };
    })
    .filter((group) => group.lines.length > 0);
}
