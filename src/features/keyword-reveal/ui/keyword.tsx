import { cn } from "cn";
import { m } from "motion/react";
import { usePointerCapability } from "@/shared/lib/use-pointer-capability";
import { useReducedMotion } from "@/shared/lib/use-reduced-motion";
import {
  REVEAL_DURATION,
  REVEAL_EASE,
  underlineVariants,
  wordVariants,
} from "../model/motion";
import type { KeywordTone } from "../model/types";

const TONE_UNDERLINE: Record<KeywordTone, string> = {
  note: "border-dotted",
  define: "border-solid",
  reference: "border-dashed",
};

type KeywordProps = {
  tone?: KeywordTone;
  children: React.ReactNode;
};

export function Keyword({ tone = "note", children }: KeywordProps) {
  const canHover = usePointerCapability();
  const prefersReducedMotion = useReducedMotion();

  // Declaring a variant label makes the word its own variant root, which is what
  // hover needs and exactly what would cut it out of the paragraph's stagger.
  const isSelfDriven = canHover || prefersReducedMotion;
  const transition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: REVEAL_DURATION, ease: REVEAL_EASE };

  return (
    <m.span
      // Motion decides at mount, and the pointer gate only resolves after it.
      key={isSelfDriven ? "self-driven" : "staggered"}
      className="relative inline-block max-w-full align-baseline leading-none"
      variants={wordVariants}
      initial={prefersReducedMotion ? "active" : canHover ? "rest" : undefined}
      animate={prefersReducedMotion ? "active" : undefined}
      whileHover={canHover && !prefersReducedMotion ? "active" : undefined}
      transition={transition}
    >
      {children}
      <span
        aria-hidden
        className={cn(
          "border-accent/45 pointer-events-none absolute inset-x-0 -bottom-[0.08em] border-t",
          TONE_UNDERLINE[tone],
        )}
      />
      <m.span
        aria-hidden
        className={cn(
          "border-accent pointer-events-none absolute inset-x-0 -bottom-[0.08em] origin-left border-t",
          TONE_UNDERLINE[tone],
        )}
        variants={underlineVariants}
        transition={transition}
      />
    </m.span>
  );
}
