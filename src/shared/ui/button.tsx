import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/utils";

export type ButtonVariant = "primary" | "ghost";
export type ButtonSize = "sm" | "md";

// Press feedback is a CSS transition so a release mid-press returns smoothly.
const TAP_SCALE = "active:not-disabled:scale-[0.96]";

const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md text-meta font-medium whitespace-nowrap transition-[background-color,border-color,color,scale] duration-(--duration-quick) ease-out select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-ink text-bg hover:bg-ink/90",
        ghost:
          "border border-line bg-transparent text-ink-muted hover:border-line-strong hover:bg-surface hover:text-ink",
      },
      size: {
        sm: "h-8 px-3",
        md: "h-10 px-4",
      },
    },
    defaultVariants: {
      variant: "ghost",
      size: "md",
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    // Opts out of the press scale where the motion would only distract.
    static?: boolean;
  };

export function Button({
  className,
  variant,
  size,
  static: isStatic = false,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        buttonVariants({ variant, size }),
        !isStatic && TAP_SCALE,
        className,
      )}
      {...props}
    />
  );
}
