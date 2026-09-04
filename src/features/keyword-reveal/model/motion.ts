import type { Variants } from "motion/react";

export const REVEAL_EASE = [0.25, 1, 0.5, 1] as const;
export const REVEAL_DURATION = 0.18;
export const STAGGER_GAP = 0.12;

// One vocabulary so hover and stagger converge on the same visual state.
export const underlineVariants: Variants = {
  rest: { scaleX: 0 },
  active: { scaleX: 1 },
};

export const wordVariants: Variants = {
  rest: { opacity: 0.88 },
  active: { opacity: 1 },
};
