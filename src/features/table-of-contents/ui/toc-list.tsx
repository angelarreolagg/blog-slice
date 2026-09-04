import { useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/shared/lib/utils";
import type { PostHeading } from "@/entities/post";

type TocListProps = {
  headings: Array<PostHeading>;
  activeId: string | undefined;
};

export function TocList({ headings, activeId }: TocListProps) {
  const listRef = useRef<HTMLOListElement>(null);
  const [marker, setMarker] = useState<{ top: number; height: number } | null>(
    null,
  );

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list || !activeId) return setMarker(null);

    const item = list.querySelector<HTMLElement>(
      `[data-id="${CSS.escape(activeId)}"]`,
    );
    if (!item) return setMarker(null);

    setMarker({ top: item.offsetTop, height: item.offsetHeight });
  }, [activeId]);

  return (
    <div className="border-line relative border-l">
      <span
        aria-hidden
        className={cn(
          "bg-accent ease-smooth-out absolute -left-px w-px transition-[translate,height,opacity] duration-(--duration-fast)",
          marker ? "opacity-100" : "opacity-0",
        )}
        style={{
          height: `${marker?.height ?? 0}px`,
          translate: `0 ${marker?.top ?? 0}px`,
        }}
      />
      <ol ref={listRef} className="flex flex-col">
        {headings.map((heading) => {
          const isActive = heading.id === activeId;

          return (
            <li key={heading.id} data-id={heading.id}>
              <a
                href={`#${heading.id}`}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "focus-visible:outline-accent text-caption block rounded-sm py-1.5 pr-2 transition-[color] duration-(--duration-quick) ease-out focus-visible:outline-2 focus-visible:-outline-offset-2",
                  heading.depth > 2 ? "pl-7" : "pl-4",
                  isActive
                    ? "text-ink font-medium"
                    : "text-ink-faint hover:text-ink",
                )}
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
