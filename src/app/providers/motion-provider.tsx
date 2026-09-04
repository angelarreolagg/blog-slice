import { LazyMotion } from "motion/react";

// The reveal is an enhancement, so its feature bundle loads after the prose.
const loadFeatures = () =>
  import("motion/react").then((motion) => motion.domAnimation);

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <LazyMotion features={loadFeatures}>{children}</LazyMotion>;
}
