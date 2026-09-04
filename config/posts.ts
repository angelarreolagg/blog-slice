import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export const POSTS_DIR = "src/content/posts";

export type PostFileFrontmatter = {
  title: string;
  description: string;
  date: string;
  updated?: string;
  tags: Array<string>;
  draft: boolean;
};

export type PostFile = {
  slug: string;
  filePath: string;
  frontmatter: PostFileFrontmatter;
};

// YAML parses an unquoted date into a Date; the app models dates as ISO strings.
function toIsoDate(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);

  return typeof value === "string" ? value : "";
}

function readPostFile(root: string, fileName: string): PostFile {
  const filePath = path.join(root, POSTS_DIR, fileName);
  const { data } = matter(readFileSync(filePath, "utf8"));

  return {
    slug: fileName.replace(/\.mdx$/, ""),
    filePath,
    frontmatter: {
      title: String(data.title ?? ""),
      description: String(data.description ?? ""),
      date: toIsoDate(data.date),
      updated: data.updated ? toIsoDate(data.updated) : undefined,
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      draft: data.draft === true,
    },
  };
}

export function publishedPosts(root: string): Array<PostFile> {
  return readdirSync(path.join(root, POSTS_DIR))
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => readPostFile(root, fileName))
    .filter((post) => !post.frontmatter.draft)
    .sort((a, b) => b.frontmatter.date.localeCompare(a.frontmatter.date));
}

export function publishedSlugs(root: string): Array<string> {
  return publishedPosts(root).map((post) => post.slug);
}
