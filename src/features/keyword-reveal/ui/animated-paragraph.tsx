import { motion, type Variants } from "motion/react";
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

  return (
    <motion.p
      data-reveal={staggers ? "stagger" : "hover"}
      variants={paragraphVariants}
      initial="rest"
      animate={staggers ? undefined : "rest"}
      whileInView={staggers ? "active" : undefined}
      viewport={staggers ? { once: true, amount: 0.35 } : undefined}
    >
      {children}
    </motion.p>
  );
}
