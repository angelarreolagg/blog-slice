import { useId } from "react";
import { Check, Link2 } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import { useCopy } from "@/shared/lib/use-copy";
import { useReducedMotion } from "@/shared/lib/use-reduced-motion";
import { SpriteIcon } from "@/shared/ui/sprite-icon";

const ICON_HIDDEN = { opacity: 0, scale: 0.25, filter: "blur(4px)" };
const ICON_SHOWN = { opacity: 1, scale: 1, filter: "blur(0px)" };

const TRIGGER_CLASS =
  "t-tt-trigger text-ink-faint hover:text-ink focus-visible:outline-accent relative inline-flex size-8 cursor-pointer items-center justify-center rounded-sm transition-[color] duration-(--duration-quick) ease-out after:absolute after:-inset-1.5 after:content-[''] focus-visible:outline-2 focus-visible:outline-offset-2";

const TOOLTIP_CLASS = "t-tt text-caption z-10";

type SharePostProps = {
  title: string;
  url: string;
};

export function SharePost({ title, url }: SharePostProps) {
  const { isCopied, copy } = useCopy();
  const prefersReducedMotion = useReducedMotion();
  const copyTipId = useId();
  const xTipId = useId();
  const blueskyTipId = useId();
  const Icon = isCopied ? Check : Link2;
  const intent = `${title} ${url}`;

  return (
    <div className="flex items-center gap-1">
      <span className="t-tt-wrap">
        <button
          type="button"
          onClick={() => void copy(url)}
          aria-label={isCopied ? "Enlace copiado" : "Copiar enlace"}
          aria-describedby={copyTipId}
          className={TRIGGER_CLASS}
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
        </button>
        <span role="tooltip" id={copyTipId} className={TOOLTIP_CLASS}>
          {isCopied ? "Copiado" : "Copiar enlace"}
        </span>
      </span>

      <span className="t-tt-wrap">
        <a
          href={`https://x.com/intent/post?text=${encodeURIComponent(intent)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Compartir en X"
          aria-describedby={xTipId}
          className={TRIGGER_CLASS}
        >
          <SpriteIcon id="x-icon" className="size-4" />
        </a>
        <span role="tooltip" id={xTipId} className={TOOLTIP_CLASS}>
          Compartir en X
        </span>
      </span>

      <span className="t-tt-wrap">
        <a
          href={`https://bsky.app/intent/compose?text=${encodeURIComponent(intent)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Compartir en Bluesky"
          aria-describedby={blueskyTipId}
          className={TRIGGER_CLASS}
        >
          <SpriteIcon id="bluesky-icon" className="size-4" />
        </a>
        <span role="tooltip" id={blueskyTipId} className={TOOLTIP_CLASS}>
          Compartir en Bluesky
        </span>
      </span>
    </div>
  );
}
