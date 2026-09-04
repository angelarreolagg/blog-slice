declare module "*.mdx" {
  import type { MDXProps } from "mdx/types";
  import type { PostFrontmatter } from "@/entities/post";

  export const frontmatter: PostFrontmatter;

  export default function MDXContent(props: MDXProps): React.JSX.Element;
}
