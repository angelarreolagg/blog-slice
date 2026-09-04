import GithubSlugger from "github-slugger";
import type { Root } from "mdast";
import { toString } from "mdast-util-to-string";
import { valueToEstree } from "estree-util-value-to-estree";
import { define } from "unist-util-mdx-define";
import { visit } from "unist-util-visit";
import type { VFile } from "vfile";

const MIN_DEPTH = 2;
const MAX_DEPTH = 3;

export type PostHeading = {
  depth: number;
  id: string;
  text: string;
};

// Publishes the headings of each post as `export const headings`, the way
// remark-mdx-frontmatter publishes frontmatter. The slugger is instantiated per
// file and walked in document order so the ids match rehype-slug's exactly.
export function remarkHeadings() {
  return (tree: Root, file: VFile) => {
    const slugger = new GithubSlugger();
    const headings: Array<PostHeading> = [];

    visit(tree, "heading", (node) => {
      const text = toString(node);
      const id = slugger.slug(text);

      if (node.depth >= MIN_DEPTH && node.depth <= MAX_DEPTH) {
        headings.push({ depth: node.depth, id, text });
      }
    });

    define(tree, file, { headings: valueToEstree(headings) });
  };
}
