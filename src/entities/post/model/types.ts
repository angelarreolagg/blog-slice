import type { MDXProps } from "mdx/types";

// The entrance a post's title uses. Adding one means a new case in
// `AnimatedTitle`; posts that name none get the plain title.
export type TitleStyle = "plain" | "matrix" | "valo";

// Tones an entry may set for an entrance that takes them; each one that is
// left out falls through to the palette default.
export type TitleTones = {
  primary?: string;
  secondary?: string;
  text?: string;
};

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
  titleTones?: TitleTones;
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
  titleTones?: TitleTones;
  tags: Array<string>;
  readingMinutes: number;
};

export type Post = PostSummary & {
  headings: Array<PostHeading>;
  Content: PostModule["default"];
};
