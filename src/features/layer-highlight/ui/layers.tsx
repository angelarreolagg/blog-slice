import { useState } from "react";
import { cn } from "@/shared/lib/utils";
import type { LayerItem } from "../model/types";

type LayersProps = {
  label: string;
  items: Array<LayerItem>;
};

export function Layers({ label, items }: LayersProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = items.find((item) => item.id === activeId);

  function handleToggle(id: string) {
    setActiveId((current) => (current === id ? null : id));
  }

  return (
    <div role="group" aria-label={label} className="flex flex-col gap-1.5">
      {items.map((item) => {
        const isActive = item.id === activeId;
        const isReached = active?.reaches?.includes(item.id) ?? false;
        const isDimmed = active !== undefined && !isActive && !isReached;

        return (
          <button
            key={item.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => handleToggle(item.id)}
            className={cn(
              "shadow-border hover:shadow-border-hover focus-visible:outline-accent bg-bg flex min-h-11 w-full cursor-pointer flex-col items-start gap-0.5 rounded-md px-3 py-2 text-left transition-[box-shadow,background-color,color,opacity] duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2",
              isActive && "ring-accent bg-surface ring-1",
              isReached && "bg-surface",
              isDimmed && "opacity-60",
            )}
          >
            <span
              className={cn(
                "text-meta font-medium",
                isActive || isReached ? "text-ink" : "text-ink-muted",
              )}
            >
              {item.label}
            </span>
            {item.note && (
              <span className="text-caption text-ink-muted">{item.note}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
