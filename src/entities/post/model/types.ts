import type { MDXProps } from "mdx/types";

export type PostFrontmatter = {
  title: string;
  description: string;
  date: string;
  updated?: string;
  tags?: Array<string>;
  draft?: boolean;
};

export type PostModule = {
  frontmatter: PostFrontmatter;
  default: (props: MDXProps) => React.JSX.Element;
};

export type PostSummary = {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  tags: Array<string>;
};

export type Post = PostSummary & {
  Content: PostModule["default"];
};
