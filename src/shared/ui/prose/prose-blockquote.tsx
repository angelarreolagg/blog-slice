type ProseBlockquoteProps = React.ComponentProps<"blockquote">;

export function ProseBlockquote({ children, ...props }: ProseBlockquoteProps) {
  return (
    <blockquote
      {...props}
      className="border-line text-ink-muted text-lead border-l pl-5 font-serif italic"
    >
      {children}
    </blockquote>
  );
}
