import { Link2 } from "lucide-react";
import { cn } from "cn";

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
          className="text-ink-faint hover:text-ink ease-soft ml-2 inline-flex translate-y-px opacity-0 transition-[color,opacity] duration-120 group-hover:opacity-100 focus-visible:opacity-100"
        >
          <Link2 className="size-4" aria-hidden />
        </a>
      )}
    </Tag>
  );
}
