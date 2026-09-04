import { cn } from "cn";
import { motion } from "motion/react";
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

  const transition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: REVEAL_DURATION, ease: REVEAL_EASE };

  return (
    <motion.span
      className="relative inline-block max-w-full align-baseline leading-none"
      variants={wordVariants}
      initial={prefersReducedMotion ? "active" : "rest"}
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
      <motion.span
        aria-hidden
        className={cn(
          "border-accent pointer-events-none absolute inset-x-0 -bottom-[0.08em] origin-left border-t",
          TONE_UNDERLINE[tone],
        )}
        variants={underlineVariants}
        transition={transition}
      />
    </motion.span>
  );
}
