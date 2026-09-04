import path from "node:path";
import type { Plugin } from "vite";
import { POSTS_DIR, publishedPosts } from "./posts.ts";

const MODULE_ID = "virtual:published-posts";
const RESOLVED_ID = `\0${MODULE_ID}`;

// A draft must not reach the bundle at all, so the module graph is built from
// the published files only rather than filtered at runtime.
export function publishedPostsPlugin(): Plugin {
  let root = process.cwd();

  return {
    name: "published-posts",
    configResolved(config) {
      root = config.root;
    },
    resolveId(id) {
      return id === MODULE_ID ? RESOLVED_ID : undefined;
    },
    load(id) {
      if (id !== RESOLVED_ID) return undefined;

      const posts = publishedPosts(root);
      const imports = posts
        .map(
          (post, index) =>
            `import * as post${index} from ${JSON.stringify(post.filePath)};`,
        )
        .join("\n");
      const entries = posts
        .map(
          (post, index) =>
            `{ slug: ${JSON.stringify(post.slug)}, module: post${index} }`,
        )
        .join(", ");

      return `${imports}\nexport const posts = [${entries}];\n`;
    },
    configureServer(server) {
      const watched = path.join(root, POSTS_DIR);

      const invalidate = (file: string) => {
        if (!file.startsWith(watched)) return;

        const virtualModule = server.moduleGraph.getModuleById(RESOLVED_ID);
        if (virtualModule) server.moduleGraph.invalidateModule(virtualModule);
        server.ws.send({ type: "full-reload" });
      };

      server.watcher.on("add", invalidate);
      server.watcher.on("unlink", invalidate);
      server.watcher.on("change", invalidate);
    },
  };
}
