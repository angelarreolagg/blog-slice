export function ProseUnorderedList({
  children,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul {...props} className="marker:text-ink-faint list-disc pl-5">
      {children}
    </ul>
  );
}

export function ProseOrderedList({
  children,
  ...props
}: React.ComponentProps<"ol">) {
  return (
    <ol {...props} className="marker:text-ink-faint list-decimal pl-5">
      {children}
    </ol>
  );
}
