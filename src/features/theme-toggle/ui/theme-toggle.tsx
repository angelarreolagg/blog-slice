import { useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useTheme } from "../lib/use-theme";
import type { Theme } from "../model/theme";

const OPTIONS: Array<{ value: Theme; label: string; Icon: typeof Sun }> = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "system", label: "System", Icon: Monitor },
];

// Each option is 28px wide with a 2px gap; the indicator slides between them.
const INDICATOR_OFFSET: Record<Theme, string> = {
  light: "translate-x-0",
  dark: "translate-x-[calc(100%+2px)]",
  system: "translate-x-[calc(200%+4px)]",
};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  // The stored choice lands after hydration; only a click should animate.
  const [hasInteracted, setHasInteracted] = useState(false);

  function handleSelect(next: Theme) {
    setHasInteracted(true);
    setTheme(next);
  }

  return (
    <div
      role="group"
      aria-label="Theme"
      lang="en"
      className="border-line relative flex items-center gap-0.5 rounded-md border p-0.5"
    >
      <span
        aria-hidden
        className={cn(
          "bg-surface-hover absolute top-0.5 left-0.5 size-7 rounded-sm",
          hasInteracted && "transition-[translate] duration-150 ease-out",
          INDICATOR_OFFSET[theme],
        )}
      />
      {OPTIONS.map(({ value, label, Icon }) => {
        const isActive = theme === value;

        return (
          <button
            key={value}
            type="button"
            aria-label={label}
            aria-pressed={isActive}
            onClick={() => handleSelect(value)}
            className={cn(
              "focus-visible:outline-accent relative inline-flex size-7 cursor-pointer items-center justify-center rounded-sm transition-[color] duration-150 ease-out after:absolute after:-inset-x-px after:-inset-y-2 after:content-[''] focus-visible:outline-2 focus-visible:outline-offset-2",
              isActive ? "text-ink" : "text-ink-faint hover:text-ink",
            )}
          >
            <Icon className="size-4" strokeWidth={1.5} aria-hidden />
          </button>
        );
      })}
    </div>
  );
}
