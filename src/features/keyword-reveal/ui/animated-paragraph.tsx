import { useRef } from "react";
import { m, useInView, type Variants } from "motion/react";
import { usePointerCapability } from "@/shared/lib/use-pointer-capability";
import { useReducedMotion } from "@/shared/lib/use-reduced-motion";
import { STAGGER_GAP } from "../model/motion";

const paragraphVariants: Variants = {
  rest: {},
  active: { transition: { staggerChildren: STAGGER_GAP } },
};

type AnimatedParagraphProps = {
  children: React.ReactNode;
};

export function AnimatedParagraph({ children }: AnimatedParagraphProps) {
  const canHover = usePointerCapability();
  const prefersReducedMotion = useReducedMotion();
  const staggers = !canHover && !prefersReducedMotion;

  const ref = useRef<HTMLParagraphElement>(null);
  // whileInView does not propagate its variant to children, so drive it here.
  const isInView = useInView(ref, { once: true, amount: 0.35 });

  return (
    <m.p
      ref={ref}
      data-reveal={staggers ? "stagger" : "hover"}
      variants={paragraphVariants}
      initial="rest"
      animate={staggers && isInView ? "active" : "rest"}
    >
      {children}
    </m.p>
  );
}
