import { Children, isValidElement, type ReactNode } from "react";
import { CopyButton } from "@/features/copy-code";

type CodeBlockProps = React.ComponentProps<"pre"> & {
  "data-language"?: string;
};

function textOf(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return textOf(node.props.children);
  }

  return "";
}

export function CodeBlock({ children, ...props }: CodeBlockProps) {
  const language = props["data-language"] ?? "code";
  const source = Children.toArray(children).map(textOf).join("");

  return (
    <div className="group relative">
      <pre
        {...props}
        tabIndex={0}
        role="region"
        aria-label={`${language} code block`}
        lang="en"
        className="text-ink overflow-x-auto p-4 font-mono text-[0.875rem] leading-[1.65]"
      >
        {children}
      </pre>
      <CopyButton value={source} className="absolute top-2 right-2" />
    </div>
  );
}
