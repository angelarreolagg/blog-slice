import { ArrowRight } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { FlowStep } from "./types";

type FlowProps = {
  label: string;
  steps: Array<FlowStep>;
  activeId?: string;
};

export function Flow({ label, steps, activeId }: FlowProps) {
  return (
    <ol
      aria-label={label}
      className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center"
    >
      {steps.map((step, index) => {
        const isActive = step.id === activeId;

        return (
          <li
            key={step.id}
            aria-current={isActive ? "step" : undefined}
            // The prose rhythm targets list items; this list is a diagram.
            className="mt-0 flex min-w-0 flex-1 flex-col items-center gap-2 sm:flex-row"
          >
            {index > 0 && (
              <ArrowRight
                aria-hidden
                strokeWidth={1.5}
                className="text-ink-faint size-4 shrink-0 rotate-90 sm:rotate-0"
              />
            )}
            <span
              className={cn(
                "shadow-border text-meta bg-bg mt-0 w-full rounded-md px-3 py-2 text-center transition-[box-shadow,background-color,color] duration-(--duration-quick) ease-out",
                isActive
                  ? "ring-accent text-ink bg-surface font-medium ring-1"
                  : "text-ink-muted",
              )}
            >
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
