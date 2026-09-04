import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

export type ButtonVariant = "primary" | "ghost";
export type ButtonSize = "sm" | "md";

const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md text-meta font-medium whitespace-nowrap transition-[background-color,border-color,color,transform] duration-120 ease-soft select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
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
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
