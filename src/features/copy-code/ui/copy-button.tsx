import { Check, Copy } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import { cn } from "@/shared/lib/utils";
import { useReducedMotion } from "@/shared/lib/use-reduced-motion";
import { Button } from "@/shared/ui/button";
import { useCopy } from "../lib/use-copy";

const ICON_HIDDEN = { opacity: 0, scale: 0.25, filter: "blur(4px)" };
const ICON_SHOWN = { opacity: 1, scale: 1, filter: "blur(0px)" };

type CopyButtonProps = {
  value: string;
  className?: string;
};

export function CopyButton({ value, className }: CopyButtonProps) {
  const { isCopied, copy } = useCopy();
  const prefersReducedMotion = useReducedMotion();
  const Icon = isCopied ? Check : Copy;

  function handleClick() {
    void copy(value);
  }

  return (
    <Button
      size="sm"
      variant="ghost"
      onClick={handleClick}
      aria-label={isCopied ? "Copied" : "Copy code"}
      lang="en"
      className={cn(
        "bg-bg relative rounded-sm opacity-0 group-hover:opacity-100 after:absolute after:-inset-1.5 after:content-[''] focus-visible:opacity-100",
        className,
      )}
    >
      <AnimatePresence initial={false} mode="popLayout">
        <m.span
          key={isCopied ? "copied" : "copy"}
          className="inline-flex"
          initial={ICON_HIDDEN}
          animate={ICON_SHOWN}
          exit={ICON_HIDDEN}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { type: "spring", duration: 0.3, bounce: 0 }
          }
        >
          <Icon className="size-4" strokeWidth={1.5} aria-hidden />
        </m.span>
      </AnimatePresence>
    </Button>
  );
}
