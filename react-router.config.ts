import { cp, rename, rm } from "node:fs/promises";
import path from "node:path";
import type { Config } from "@react-router/dev/config";

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
  prerender: ({ getStaticPaths }) => getStaticPaths(),
  buildEnd: async ({ reactRouterConfig }) => {
    await flattenClientBuild(reactRouterConfig.buildDirectory);
  },
} satisfies Config;
