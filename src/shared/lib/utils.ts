import { createCn } from "cn/config";

// The project's type scale lives in the --text-* namespace, so `text-caption`
// and `text-ink-faint` both look like `text-*` to the merger and it drops one.
// Registering the sizes tells it which is which.
const FONT_SIZES = [
  "caption",
  "meta",
  "body",
  "lead",
  "h1",
  "h2",
  "h3",
  "display",
];

export const cn = createCn({
  extend: { classGroups: { "font-size": [{ text: FONT_SIZES }] } },
});
