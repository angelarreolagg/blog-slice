import { Check, Copy } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/shared/ui/button";
import { useCopy } from "../lib/use-copy";

type CopyButtonProps = {
  value: string;
  className?: string;
};

export function CopyButton({ value, className }: CopyButtonProps) {
  const { isCopied, copy } = useCopy();

  function handleClick() {
    void copy(value);
  }

  return (
    <Button
      size="sm"
      variant="ghost"
      onClick={handleClick}
      aria-label={isCopied ? "Copied" : "Copy code"}
      lang="en"
      className={cn(
        "bg-bg opacity-0 group-hover:opacity-100 focus-visible:opacity-100",
        className,
      )}
    >
      {isCopied ? (
        <Check className="size-4" aria-hidden />
      ) : (
        <Copy className="size-4" aria-hidden />
      )}
    </Button>
  );
}
