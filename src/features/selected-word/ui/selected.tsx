import { useMeasuredSize } from "@/shared/lib/use-measured-size";

const HANDLE =
  "border-select bg-bg absolute size-[5px] border transition-opacity duration-(--duration-quick) ease-out";

type SelectedProps = {
  children: React.ReactNode;
};

// A design term, quoted the way a design tool would show it: the word sits in a
// selection frame, and pointing at it reveals the layer's measured box.
export function Selected({ children }: SelectedProps) {
  const { ref, size } = useMeasuredSize<HTMLSpanElement>();

  return (
    <span className="group/selected relative inline-block">
      <span
        aria-hidden
        className="border-select group-hover/selected:bg-select-fill pointer-events-none absolute -inset-x-[3px] -inset-y-[2px] border transition-[background-color] duration-(--duration-quick) ease-out"
      >
        <span className={`${HANDLE} -top-[3px] -left-[3px]`} />
        <span className={`${HANDLE} -top-[3px] -right-[3px]`} />
        <span className={`${HANDLE} -right-[3px] -bottom-[3px]`} />
        <span className={`${HANDLE} -bottom-[3px] -left-[3px]`} />
      </span>

      <span ref={ref} className="relative">
        {children}
      </span>

      {size && (
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-full left-1/2 mb-[11px] -translate-x-1/2 opacity-0 transition-opacity duration-(--duration-quick) ease-out group-hover/selected:opacity-100"
        >
          <span className="bg-surface text-ink-muted shadow-border text-caption block w-max rounded-sm px-1.5 py-px whitespace-nowrap tabular-nums">
            {size.width} × {size.height}
          </span>
        </span>
      )}

      <span
        aria-hidden
        className="border-select bg-bg pointer-events-none absolute bottom-full left-1/2 mb-[4px] size-[5px] -translate-x-1/2 rounded-full border opacity-0 transition-opacity duration-(--duration-quick) ease-out group-hover/selected:opacity-100"
      />
    </span>
  );
}
