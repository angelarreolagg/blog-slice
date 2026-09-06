import type { TitleTones } from "@/entities/post";

type ValoTitleProps = {
  title: string;
  tones?: TitleTones;
};

// Only the tones an entry names are set, so the rest keep the palette default.
function toneVars(tones: TitleTones | undefined): React.CSSProperties {
  const vars: Record<string, string> = {};
  if (tones?.primary) vars["--valo-primary"] = tones.primary;
  if (tones?.secondary) vars["--valo-secondary"] = tones.secondary;
  if (tones?.text) vars["--valo-text"] = tones.text;
  return vars as React.CSSProperties;
}

// The title stays one real text node under the card; the panels, strips and
// static are empty and decorative, so the heading's name is the title itself.
export function ValoTitle({ title, tones }: ValoTitleProps) {
  return (
    <span className="valo-frame" style={toneVars(tones)}>
      <span className="valo-text">{title}</span>
      <span aria-hidden className="valo-block" />
      <span aria-hidden className="valo-block valo-flip" />
      <span aria-hidden className="valo-strip" />
      <span aria-hidden className="valo-strip valo-flip" />
      <span aria-hidden className="valo-glitch" />
      <span aria-hidden className="valo-glitch" />
      <span aria-hidden className="valo-glitch" />
    </span>
  );
}
