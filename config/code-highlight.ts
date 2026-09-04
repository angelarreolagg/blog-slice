import type { ShikiTransformer } from "shiki";
import type { ThemeRegistrationRaw } from "shiki";

// Sentinel foregrounds; the transformer swaps them for token classes so no raw
// colour value reaches the shipped HTML.
const SENTINELS = {
  "#000010": "code-token-text",
  "#000011": "code-token-comment",
  "#000012": "code-token-string",
  "#000013": "code-token-keyword",
  "#000014": "code-token-number",
} as const;

const SCOPES: Array<[string, Array<string>]> = [
  ["#000011", ["comment", "punctuation.definition.comment"]],
  [
    "#000012",
    ["string", "string.regexp", "constant.other.symbol", "meta.embedded.line"],
  ],
  [
    "#000013",
    [
      "keyword",
      "storage",
      "storage.type",
      "storage.modifier",
      "constant.language",
      "variable.language",
      "entity.name.tag",
      "support.type.primitive",
      "keyword.operator.new",
    ],
  ],
  ["#000014", ["constant.numeric", "constant.language.boolean", "constant"]],
  // Operators and punctuation stay prose-coloured; four colours, not twelve.
  ["#000010", ["keyword.operator", "punctuation", "meta.brace"]],
];

const tokenColors = [
  { settings: { foreground: "#000010" } },
  ...SCOPES.map(([foreground, scope]) => ({ scope, settings: { foreground } })),
];

export const codeTheme: ThemeRegistrationRaw = {
  name: "four-token",
  type: "light",
  colors: { "editor.foreground": "#000010" },
  // rehype-pretty-code only recognises a raw theme by its `tokenColors` key.
  tokenColors,
  settings: tokenColors,
};

function sentinelOf(style: unknown) {
  if (typeof style !== "string") return undefined;

  const match = /color:\s*(#[0-9a-fA-F]{6})/.exec(style);
  const hex = match?.[1]?.toLowerCase();

  return hex && hex in SENTINELS
    ? SENTINELS[hex as keyof typeof SENTINELS]
    : undefined;
}

export const tokenClassTransformer: ShikiTransformer = {
  name: "sentinel-to-token-class",
  span(node) {
    const className = sentinelOf(node.properties.style);

    delete node.properties.style;
    if (className) {
      node.properties.className = [className];
    }
  },
  pre(node) {
    delete node.properties.style;
    delete node.properties.tabindex;
  },
  code(node) {
    delete node.properties.style;
  },
};
