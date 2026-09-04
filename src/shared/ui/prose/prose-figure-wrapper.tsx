type FigureProps = React.ComponentProps<"figure"> & {
  "data-rehype-pretty-code-figure"?: string;
};

// The highlighter wraps every code block in a figure of its own; that figure
// is the elevated surface, so a title bar and the block share one edge.
export function ProseFigureWrapper({ children, ...props }: FigureProps) {
  const isCodeFigure = props["data-rehype-pretty-code-figure"] !== undefined;

  return (
    <figure
      {...props}
      className={
        isCodeFigure
          ? "bg-surface shadow-border overflow-hidden rounded-lg"
          : undefined
      }
    >
      {children}
    </figure>
  );
}
