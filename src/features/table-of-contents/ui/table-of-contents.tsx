import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { PostHeading } from "@/entities/post";
import { useActiveHeading } from "../lib/use-active-heading";
import { TocList } from "./toc-list";

type TableOfContentsProps = {
  headings: Array<PostHeading>;
  label: string;
};

export function TableOfContents({ headings, label }: TableOfContentsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();
  const activeId = useActiveHeading(headings.map((heading) => heading.id));

  if (headings.length === 0) return null;

  return (
    <nav
      aria-label={label}
      data-open={isOpen}
      className="t-acc t-acc-rail lg:absolute lg:inset-y-0 lg:right-full lg:mb-0 lg:w-40 xl:w-56"
    >
      <div className="lg:sticky lg:top-24 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto lg:overscroll-contain lg:pr-6 xl:pr-10">
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => setIsOpen((open) => !open)}
          className="text-meta text-ink-muted hover:text-ink focus-visible:outline-accent border-line flex w-full cursor-pointer items-center justify-between gap-2 rounded-md border px-3 py-2 transition-[color,border-color] duration-(--duration-quick) ease-out focus-visible:outline-2 focus-visible:outline-offset-2 lg:hidden"
        >
          {label}
          <span className="t-acc-chevron">
            <ChevronDown className="size-4" strokeWidth={1.5} aria-hidden />
          </span>
        </button>

        <p className="text-caption text-ink-faint mb-3 hidden px-4 font-medium lg:block">
          {label}
        </p>

        <div id={panelId} className="t-acc-panel">
          <div className="t-acc-panel-inner">
            <div className={cn("pt-3 lg:pt-0")}>
              <TocList headings={headings} activeId={activeId} />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
