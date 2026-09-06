import { cn } from "@/shared/lib/utils";
import type { TitleStyle, TitleTones } from "@/entities/post";
import { MatrixTitle } from "./matrix-title";
import { ValoTitle } from "./valo-title";

type AnimatedTitleProps = {
  title: string;
  style: TitleStyle;
  tones?: TitleTones;
  className?: string;
};

export function AnimatedTitle({
  title,
  style,
  tones,
  className,
}: AnimatedTitleProps) {
  if (style === "plain") {
    return <h1 className={className}>{title}</h1>;
  }

  return (
    // The entrance carries its own motion, so the header's chunk is off.
    <h1 className={cn("animate-none", className)}>
      {style === "matrix" ? (
        <MatrixTitle title={title} />
      ) : (
        <ValoTitle title={title} tones={tones} />
      )}
    </h1>
  );
}
