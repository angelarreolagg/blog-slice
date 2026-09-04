import { writeFile } from "node:fs/promises";
import path from "node:path";
import { SITE } from "../src/shared/config/site.ts";
import type { PostFile } from "./posts.ts";

function escapeXml(value: string) {
  return value.replace(/[<>&"']/g, (character) => {
    switch (character) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case '"':
        return "&quot;";
      default:
        return "&apos;";
    }
  });
}

function toRfc822(isoDate: string) {
  return new Date(`${isoDate}T00:00:00Z`).toUTCString();
}

export async function writeSitemap(outDir: string, posts: Array<PostFile>) {
  const urls = [
    { loc: `${SITE.url}/`, lastmod: posts[0]?.frontmatter.date },
    ...posts.map((post) => ({
      loc: `${SITE.url}/blog/${post.slug}`,
      lastmod: post.frontmatter.updated ?? post.frontmatter.date,
    })),
  ];

  const body = urls
    .map(
      ({ loc, lastmod }) =>
        `  <url>\n    <loc>${escapeXml(loc)}</loc>${
          lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ""
        }\n  </url>`,
    )
    .join("\n");

  await writeFile(
    path.join(outDir, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`,
    "utf8",
  );
}

export async function writeRss(outDir: string, posts: Array<PostFile>) {
  const items = posts
    .map(
      (post) =>
        `    <item>\n      <title>${escapeXml(post.frontmatter.title)}</title>\n      <link>${SITE.url}/blog/${post.slug}</link>\n      <guid isPermaLink="true">${SITE.url}/blog/${post.slug}</guid>\n      <description>${escapeXml(post.frontmatter.description)}</description>\n      <pubDate>${toRfc822(post.frontmatter.date)}</pubDate>\n    </item>`,
    )
    .join("\n");

  await writeFile(
    path.join(outDir, "rss.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n  <channel>\n    <title>${escapeXml(SITE.title)}</title>\n    <link>${SITE.url}/</link>\n    <atom:link href="${SITE.url}/rss.xml" rel="self" type="application/rss+xml"/>\n    <description>${escapeXml(SITE.description)}</description>\n    <language>${SITE.language}</language>\n${items}\n  </channel>\n</rss>\n`,
    "utf8",
  );
}
