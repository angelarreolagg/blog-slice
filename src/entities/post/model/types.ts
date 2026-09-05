import type { MDXProps } from "mdx/types";

// The entrance a post's title uses. Adding one means a new case in
// `AnimatedTitle`; posts that name none get the plain title.
export type TitleStyle = "plain" | "matrix";

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
  titleStyle?: TitleStyle;
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
  titleStyle: TitleStyle;
  tags: Array<string>;
  readingMinutes: number;
};

export type Post = PostSummary & {
  headings: Array<PostHeading>;
  Content: PostModule["default"];
};
