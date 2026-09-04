import path from "node:path";
import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { mdxPlugin } from "./config/mdx.ts";
import { publishedPostsPlugin } from "./config/published-posts.ts";

export default defineConfig({
  plugins: [mdxPlugin(), publishedPostsPlugin(), reactRouter(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});
