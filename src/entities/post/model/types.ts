import type { MDXProps } from "mdx/types";

export type PostHeading = {
  depth: number;
  id: string;
  text: string;
};

export type PostFrontmatter = {
  title: string;
  description: string;
  date: string;
  updated?: string;
  author?: string;
  tags?: Array<string>;
  draft?: boolean;
};

export type PostModule = {
  frontmatter: PostFrontmatter;
  headings: Array<PostHeading>;
  default: (props: MDXProps) => React.JSX.Element;
};

export type PostSummary = {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  author?: string;
  tags: Array<string>;
  readingMinutes: number;
};

export type Post = PostSummary & {
  headings: Array<PostHeading>;
  Content: PostModule["default"];
};
