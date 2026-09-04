import { cn } from "@/shared/lib/utils";

function initialsOf(name: string) {
  return name
    .split(/\s+/u)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

type AvatarProps = {
  name: string;
  className?: string;
};

export function Avatar({ name, className }: AvatarProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "bg-surface text-ink-muted shadow-border text-caption inline-flex size-8 shrink-0 items-center justify-center rounded-full font-medium",
        className,
      )}
    >
      {initialsOf(name)}
    </span>
  );
}
