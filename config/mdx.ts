import mdx from "@mdx-js/rollup";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import type { Plugin } from "vite";
import { codeTheme, tokenClassTransformer } from "./code-highlight.ts";

export function mdxPlugin(): Plugin {
  return {
    // Must transform before React Router rewrites the module.
    enforce: "pre",
    ...mdx({
      // Without this MDXProvider is ignored and the component map never applies.
      providerImportSource: "@mdx-js/react",
      remarkPlugins: [
        remarkFrontmatter,
        [remarkMdxFrontmatter, { name: "frontmatter" }],
        remarkGfm,
      ],
      rehypePlugins: [
        rehypeSlug,
        [
          rehypePrettyCode,
          {
            theme: codeTheme,
            grid: false,
            keepBackground: false,
            transformers: [tokenClassTransformer],
          },
        ],
      ],
    }),
  };
}
