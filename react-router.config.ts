import { cp, rename, rm } from "node:fs/promises";
import path from "node:path";
import type { Config } from "@react-router/dev/config";
import { writeRss, writeSitemap } from "./config/feeds.ts";
import { publishedPosts, publishedSlugs } from "./config/posts.ts";

// Framework mode emits <buildDirectory>/{client,server}; a static host wants the
// client output at the root of `dist`.
async function flattenClientBuild(buildDirectory: string) {
  const client = path.join(buildDirectory, "client");

  await rm(path.join(buildDirectory, "server"), {
    recursive: true,
    force: true,
  });
  await cp(client, buildDirectory, { recursive: true });
  await rm(client, { recursive: true, force: true });

  // Static hosts serve 404.html for unmatched paths; the SPA fallback is that page.
  await rename(
    path.join(buildDirectory, "__spa-fallback.html"),
    path.join(buildDirectory, "404.html"),
  );
}

export default {
  appDirectory: "src/app",
  buildDirectory: "dist",
  ssr: false,
  prerender: ({ getStaticPaths }) => [
    ...getStaticPaths().filter((staticPath) => !staticPath.includes(":")),
    ...publishedSlugs(process.cwd()).map((slug) => `/blog/${slug}`),
  ],
  buildEnd: async ({ reactRouterConfig }) => {
    const { buildDirectory } = reactRouterConfig;

    await flattenClientBuild(buildDirectory);

    const posts = publishedPosts(process.cwd());
    await writeSitemap(buildDirectory, posts);
    await writeRss(buildDirectory, posts);
  },
} satisfies Config;
