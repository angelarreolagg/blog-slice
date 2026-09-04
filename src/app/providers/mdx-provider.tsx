import { MDXProvider } from "@mdx-js/react";
import { mdxComponents } from "@/widgets/prose";

export function ProseProvider({ children }: { children: React.ReactNode }) {
  return <MDXProvider components={mdxComponents}>{children}</MDXProvider>;
}
