import { posts } from "virtual:published-posts";
import type { Post, PostModule, PostSummary } from "./types";

type PostEntry = {
  slug: string;
  readingMinutes: number;
  module: PostModule;
};

function toSummary({ slug, readingMinutes, module }: PostEntry): PostSummary {
  const { frontmatter } = module;

  return {
    slug,
    title: frontmatter.title,
    description: frontmatter.description,
    date: frontmatter.date,
    updated: frontmatter.updated,
    author: frontmatter.author,
    titleStyle: frontmatter.titleStyle ?? "plain",
    tags: frontmatter.tags ?? [],
    readingMinutes,
  };
}

export function getPosts(): Array<PostSummary> {
  return posts.map(toSummary);
}

export function getPost(slug: string): Post | undefined {
  const entry = posts.find((candidate) => candidate.slug === slug);
  if (!entry) return undefined;

  return {
    ...toSummary(entry),
    headings: entry.module.headings,
    Content: entry.module.default,
  };
}
