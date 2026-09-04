import { posts } from "virtual:published-posts";
import type { Post, PostModule, PostSummary } from "./types";

function toSummary(slug: string, { frontmatter }: PostModule): PostSummary {
  return {
    slug,
    title: frontmatter.title,
    description: frontmatter.description,
    date: frontmatter.date,
    updated: frontmatter.updated,
    tags: frontmatter.tags ?? [],
  };
}

export function getPosts(): Array<PostSummary> {
  return posts.map(({ slug, module }) => toSummary(slug, module));
}

export function getPost(slug: string): Post | undefined {
  const entry = posts.find((candidate) => candidate.slug === slug);
  if (!entry) return undefined;

  return { ...toSummary(slug, entry.module), Content: entry.module.default };
}
