import { Link2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";

type HeadingLevel = "h1" | "h2" | "h3" | "h4";

type HeadingProps = React.ComponentProps<"h2"> & {
  level: HeadingLevel;
};

const LEVEL_CLASS: Record<HeadingLevel, string> = {
  h1: "text-h1",
  h2: "text-h2",
  h3: "text-h3",
  h4: "text-body font-semibold",
};

export function Heading({ level, id, className, children }: HeadingProps) {
  const Tag = level;

  return (
    <Tag
      id={id}
      className={cn(
        "group text-ink scroll-mt-24",
        LEVEL_CLASS[level],
        className,
      )}
    >
      {children}
      {id && (
        <a
          href={`#${id}`}
          aria-labelledby={id}
          className="text-ink-faint hover:text-ink group-hover:blur-0 focus-visible:blur-0 relative ml-2 inline-flex translate-y-px scale-[0.25] opacity-0 blur-[4px] transition-[color,opacity,filter,scale] duration-(--duration-fast) ease-in-out group-hover:scale-100 group-hover:opacity-100 after:absolute after:-inset-3.5 after:content-[''] focus-visible:scale-100 focus-visible:opacity-100"
        >
          <Link2 className="size-4" strokeWidth={2} aria-hidden />
        </a>
      )}
    </Tag>
  );
}
