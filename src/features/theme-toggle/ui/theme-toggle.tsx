import { Monitor, Moon, Sun } from "lucide-react";
import { cn } from "cn";
import { useTheme } from "../lib/use-theme";
import type { Theme } from "../model/theme";

const OPTIONS: Array<{ value: Theme; label: string; Icon: typeof Sun }> = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "system", label: "System", Icon: Monitor },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div
      role="group"
      aria-label="Theme"
      lang="en"
      className="border-line flex items-center gap-0.5 rounded-md border p-0.5"
    >
      {OPTIONS.map(({ value, label, Icon }) => {
        const isActive = theme === value;

        return (
          <button
            key={value}
            type="button"
            aria-label={label}
            aria-pressed={isActive}
            onClick={() => setTheme(value)}
            className={cn(
              "ease-soft focus-visible:outline-accent relative inline-flex size-7 cursor-pointer items-center justify-center rounded-sm transition-colors duration-120 after:absolute after:-inset-2 after:content-[''] focus-visible:outline-2 focus-visible:outline-offset-2",
              isActive
                ? "bg-surface-hover text-ink"
                : "text-ink-faint hover:text-ink",
            )}
          >
            <Icon className="size-4" aria-hidden />
          </button>
        );
      })}
    </div>
  );
}
