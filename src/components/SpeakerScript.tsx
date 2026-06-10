import { formatSpeakerScript } from "@/lib/format-speaker-script";

interface Props {
  text: string;
}

export function SpeakerScript({ text }: Props) {
  const groups = formatSpeakerScript(text);

  if (groups.length === 0) {
    return <p className="text-ceremony-dim">No section selected</p>;
  }

  return (
    <div className="space-y-7">
      {groups.map((group, groupIdx) => (
        <div key={groupIdx} className="space-y-4">
          {group.lines.map((line, lineIdx) => (
            <p
              key={lineIdx}
              className="leading-[1.7] select-text m-0"
              style={{
                fontSize: "clamp(1.15rem, 2.2vw, 1.55rem)",
                color: "#f0f4ff",
                fontFamily: "Georgia, 'Times New Roman', serif",
                letterSpacing: "0.01em",
              }}
            >
              {line}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}
