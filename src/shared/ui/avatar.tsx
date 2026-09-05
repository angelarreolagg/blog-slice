import { cn } from "@/shared/lib/utils";

const SOURCE_SIZE = 160;

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
  src?: string;
  className?: string;
};

export function Avatar({ name, src, className }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt=""
        width={SOURCE_SIZE}
        height={SOURCE_SIZE}
        loading="lazy"
        decoding="async"
        className={cn(
          "outline-image-edge size-8 shrink-0 rounded-full object-cover outline -outline-offset-1",
          className,
        )}
      />
    );
  }

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
