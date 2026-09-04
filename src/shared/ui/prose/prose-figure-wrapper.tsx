type FigureProps = React.ComponentProps<"figure"> & {
  "data-rehype-pretty-code-figure"?: string;
};

// The highlighter wraps every code block in a figure of its own.
export function ProseFigureWrapper({ children, ...props }: FigureProps) {
  return <figure {...props}>{children}</figure>;
}
