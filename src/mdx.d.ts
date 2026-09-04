declare module "*.mdx" {
  import type { MDXProps } from "mdx/types";
  import type { PostFrontmatter, PostHeading } from "@/entities/post";

  export const frontmatter: PostFrontmatter;

  export const headings: Array<PostHeading>;

  export default function MDXContent(props: MDXProps): React.JSX.Element;
}
