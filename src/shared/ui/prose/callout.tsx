import { cva } from "class-variance-authority";
import { Info, TriangleAlert } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export type CalloutTone = "note" | "warning";

const TONE: Record<CalloutTone, { label: string; Icon: typeof Info }> = {
  note: { label: "Nota", Icon: Info },
  warning: { label: "Aviso", Icon: TriangleAlert },
};

const calloutVariants = cva(
  "shadow-border bg-surface text-ink flex gap-3 rounded-lg p-4 text-[0.9375em] [&_p]:my-0 [&_p+p]:mt-[0.75em]",
);

type CalloutProps = {
  tone?: CalloutTone;
  children: React.ReactNode;
};

export function Callout({ tone = "note", children }: CalloutProps) {
  const { label, Icon } = TONE[tone];

  return (
    <aside role="note" aria-label={label} className={cn(calloutVariants())}>
      <Icon
        className="text-ink-muted mt-[0.2em] size-4 shrink-0"
        strokeWidth={1.5}
        aria-hidden
      />
      <div className="min-w-0 flex-1">{children}</div>
    </aside>
  );
}
