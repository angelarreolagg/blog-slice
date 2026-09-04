import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import { useReducedMotion } from "@/shared/lib/use-reduced-motion";
import { Button } from "@/shared/ui/button";
import { Flow } from "@/shared/ui/diagram/flow";
import type { WalkStep } from "../model/types";

type StepsProps = {
  label: string;
  steps: Array<WalkStep>;
};

export function Steps({ label, steps }: StepsProps) {
  const [index, setIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const swap = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.15, ease: "easeInOut" as const };
  const step = steps[index];
  const isFirst = index === 0;
  const isLast = index === steps.length - 1;

  if (!step) return null;

  return (
    <section aria-label={label} className="flex flex-col gap-4">
      <Flow label={label} steps={steps} activeId={step.id} />

      <div className="flex items-start gap-3">
        <div
          aria-live="polite"
          className="text-ink min-h-20 min-w-0 flex-1 text-[0.9375em]"
        >
          <AnimatePresence initial={false} mode="wait">
            <m.p
              key={step.id}
              initial={{ opacity: 0, y: 4, filter: "blur(2px)" }}
              animate={{
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: swap,
              }}
              exit={{
                opacity: 0,
                y: -4,
                filter: "blur(2px)",
                transition: swap,
              }}
            >
              <span className="text-ink font-medium">{step.label}. </span>
              {step.description}
            </m.p>
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-meta text-ink-faint tabular-nums">
          Paso {index + 1} de {steps.length}
        </p>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            aria-label="Paso anterior"
            disabled={isFirst}
            onClick={() => setIndex((current) => current - 1)}
          >
            <ChevronLeft className="size-4" strokeWidth={2} aria-hidden />
          </Button>
          <Button
            size="sm"
            aria-label="Paso siguiente"
            disabled={isLast}
            onClick={() => setIndex((current) => current + 1)}
          >
            <ChevronRight className="size-4" strokeWidth={2} aria-hidden />
          </Button>
        </div>
      </div>
    </section>
  );
}
