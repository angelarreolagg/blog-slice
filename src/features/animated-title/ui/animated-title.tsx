import { cn } from "@/shared/lib/utils";
import type { TitleStyle } from "@/entities/post";
import { MatrixTitle } from "./matrix-title";

type AnimatedTitleProps = {
  title: string;
  style: TitleStyle;
  className?: string;
};

export function AnimatedTitle({ title, style, className }: AnimatedTitleProps) {
  if (style === "matrix") {
    return (
      // The characters carry their own entrance, so the header's chunk is off.
      <h1 className={cn("animate-none", className)}>
        <MatrixTitle title={title} />
      </h1>
    );
  }

  return <h1 className={className}>{title}</h1>;
}
