type CodeTitleProps = React.ComponentProps<"figcaption"> & {
  "data-rehype-pretty-code-title"?: string;
};

// The highlighter emits a figcaption for a fenced block's `title="…"` meta.
export function CodeTitle({ children, ...props }: CodeTitleProps) {
  if (props["data-rehype-pretty-code-title"] === undefined) {
    return <figcaption {...props}>{children}</figcaption>;
  }

  return (
    <figcaption
      {...props}
      className="border-line text-caption text-ink-muted border-b px-4 py-2 font-mono"
    >
      {children}
    </figcaption>
  );
}
