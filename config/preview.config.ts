import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { defineConfig, type Plugin } from "vite";

const OUT_DIR = "dist";

// Vite's preview serves the index for every path; a static host resolves an
// extensionless URL to its directory index and answers 404.html otherwise.
function staticHostPlugin(): Plugin {
  return {
    name: "static-host-preview",
    configurePreviewServer(server) {
      const root = path.resolve(OUT_DIR);

      server.middlewares.use((request, response, next) => {
        const [pathname = "/", search] = (request.url ?? "/").split("?");

        if (!path.extname(pathname) && !pathname.endsWith("/")) {
          if (existsSync(path.join(root, pathname, "index.html"))) {
            request.url = `${pathname}/${search ? `?${search}` : ""}`;
            return next();
          }

          response.statusCode = 404;
          response.setHeader("Content-Type", "text/html");
          return response.end(readFileSync(path.join(root, "404.html")));
        }

        return next();
      });
    },
  };
}

export default defineConfig({
  appType: "mpa",
  plugins: [staticHostPlugin()],
  build: { outDir: OUT_DIR },
  preview: { port: 4173 },
});
