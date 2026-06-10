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
    <div className="space-y-8 md:space-y-10 lg:space-y-12">
      {groups.map((group, groupIdx) => (
        <div key={groupIdx} className="space-y-5 md:space-y-6">
          {group.lines.map((line, lineIdx) => (
            <p
              key={lineIdx}
              className="leading-[1.75] md:leading-[1.85] select-text m-0 speaker-script-line"
            >
              {line}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}
