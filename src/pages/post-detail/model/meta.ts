import type { MetaDescriptor } from "react-router";
import { getPost } from "@/entities/post";
import { SITE } from "@/shared/config/site";

type MetaArgs = {
  params: { slug?: string };
};

export function meta({ params }: MetaArgs): Array<MetaDescriptor> {
  const post = params.slug ? getPost(params.slug) : undefined;

  if (!post) {
    return [
      { title: `Page not found — ${SITE.title}` },
      { name: "robots", content: "noindex" },
    ];
  }

  const url = `${SITE.url}/blog/${post.slug}`;

  return [
    { title: `${post.title} — ${SITE.title}` },
    { name: "description", content: post.description },
    { property: "og:type", content: "article" },
    { property: "og:title", content: post.title },
    { property: "og:description", content: post.description },
    { property: "og:url", content: url },
    { property: "article:published_time", content: post.date },
    ...(post.updated
      ? [{ property: "article:modified_time", content: post.updated }]
      : []),
    { tagName: "link", rel: "canonical", href: url },
  ];
}
