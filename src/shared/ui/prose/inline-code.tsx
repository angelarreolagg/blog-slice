type InlineCodeProps = React.ComponentProps<"code"> & {
  "data-language"?: string;
};

export function InlineCode({ children, ...props }: InlineCodeProps) {
  // The highlighter marks block code with a language; only inline code is styled.
  if (props["data-language"]) {
    return <code {...props}>{children}</code>;
  }

  return (
    <code
      {...props}
      className="bg-surface text-ink rounded-sm px-1 py-0.5 font-mono text-[0.9375em]"
    >
      {children}
    </code>
  );
}
